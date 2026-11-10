const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { CopilotClient } = require('@github/copilot-sdk');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = __dirname;
const DELIVERY_ROOT = path.join(ROOT, 'deliveries');
const JOB_ROOT = path.join(ROOT, '.automation-jobs');
const TIKTOK_CAMPAIGN_FILE = path.join(JOB_ROOT, 'tiktok-campaign.json');
fs.mkdirSync(DELIVERY_ROOT, { recursive: true });
fs.mkdirSync(JOB_ROOT, { recursive: true });
const jobs = new Map();
const runtimeConfigs = new Map();
const jobQueue = [];
let queueWorkerRunning = false;

const initialTikTokPosts = [
  ['Teacup Mystery: More Biscuits', '2026-11-11T19:00:00+07:00', 'approved'],
  ['Turn a Thought Into a Storyboard', '2026-11-12T19:00:00+07:00', 'planned'],
  ['Sound Changes the Scene', '2026-11-13T19:00:00+07:00', 'planned'],
  ['One Camera Move, Three Moods', '2026-11-14T07:00:00+07:00', 'planned'],
  ['A Lighting Change Is a Story Change', '2026-11-15T07:00:00+07:00', 'planned'],
  ['Build a World With Three Details', '2026-11-16T07:00:00+07:00', 'planned'],
  ['The Edit Is a Point of View', '2026-11-17T07:00:00+07:00', 'planned'],
  ['Make a Title Card Feel Like a Promise', '2026-11-18T07:00:00+07:00', 'planned'],
  ['A Better Prompt Starts With a Better Question', '2026-11-19T07:00:00+07:00', 'planned'],
  ['The 30-Second Pitch: A New Way to Imagine a Scene', '2026-11-20T07:00:00+07:00', 'planned']
].map(([title, scheduledAt, status], index) => ({
  day: index + 1, title, scheduledAt, status, postUrl: '', notes: index === 0 ? 'Founder approved in conversation; waiting for manual file selection in TikTok Studio.' : '',
  caption: index === 0 ? 'A mystery in a teacup… solved by one tiny biscuit thief. 🍪🔎 What should we investigate next? #MicroStory #AIAnimation #MysteryTok #ShortStory' : '',
  assetPath: index === 0 ? 'deliveries/job-1794296910646-cd112d/video01-mystery-comedy/renders/teacup-mystery-comedy.mp4' : ''
}));

const initialTikTokDepartmentAssignments = [
  { departmentId: 'naruto', task: 'Điều phối kế hoạch TikTok 10 ngày, cập nhật blocker và ghi báo cáo tiến độ mỗi 2 giờ.', deliverable: 'Bảng điều phối; follower chỉ cập nhật từ Founder read-back.', status: 'in_progress', evidence: 'Campaign monitor đang chạy local; bài ngày 1 đã duyệt nhưng chưa tải lên.' },
  { departmentId: 'hinata', task: 'Tổng hợp phân khúc khán giả toàn cầu và tách dữ kiện khỏi giả định khi chưa có Analytics.', deliverable: 'Bản phân khúc và giả định trong CAMPAIGN_PACK.md.', status: 'completed', evidence: 'Bản nháp nội bộ; chưa có dữ liệu audience/analytics.' },
  { departmentId: 'shikamaru', task: 'Lập lịch nội dung, KPI checkpoint và giả thuyết giờ đăng cho 10 ngày.', deliverable: 'Lịch 11–20/11/2026 theo ICT và mô hình theo dõi.', status: 'completed', evidence: 'Giờ đăng là giả thuyết; cần điều chỉnh khi có số liệu.' },
  { departmentId: 'sakura', task: 'Soạn hành trình từ xem video đến theo dõi và chỉnh bio theo định vị đã duyệt.', deliverable: 'Bio đã lưu/đọc lại và bản nháp funnel trong CAMPAIGN_PACK.md.', status: 'completed', evidence: 'Bio hiển thị trên hồ sơ; funnel là khuyến nghị nội bộ.' },
  { departmentId: 'jiraiya', task: 'Soạn 10 kịch bản, caption và CTA tiếng Anh cho thị trường toàn cầu.', deliverable: '10 kịch bản và caption trong CAMPAIGN_PACK.md.', status: 'completed', evidence: 'Bản nháp; bài công khai vẫn cần Founder duyệt.' },
  { departmentId: 'sai', task: 'Tạo phong cách video sáng, pha bí ẩn và hài cho video mở màn.', deliverable: 'Video dọc 20 giây và sound design local.', status: 'completed', evidence: 'MP4 đã render; TikTok chưa nhận file.' },
  { departmentId: 'sasuke', task: 'Xây bảng lịch 10 ngày, ghi số liệu follower và lưu báo cáo 2 giờ.', deliverable: 'Naruto Campaign Automation và API local.', status: 'completed', evidence: 'Dashboard hoạt động tại localhost:3001; trạng thái được lưu trong .automation-jobs.' },
  { departmentId: 'kakashi', task: 'Rà soát tính nhất quán, nhãn AI, bằng chứng tài sản và trạng thái phát hành.', deliverable: 'Báo cáo review cùng các blocker trước khi công bố.', status: 'reviewing', evidence: 'Agent Harness needs_review, 0 lệnh test; bài đăng chưa có URL đọc lại.' },
  { departmentId: 'tsunade', task: 'Giữ kế hoạch ở mức 0 ngân sách và không tự bật quảng cáo trả phí.', deliverable: 'Phạm vi vận hành không chi tiêu trong campaign pack.', status: 'completed', evidence: 'Chưa có quảng cáo hoặc khoản chi nào được ghi nhận.' }
];

function createTikTokCampaign() {
  return {
    id: 'cinetech-ai-10-day-2026-11', account: '@cinetech.ai', status: 'active',
    targetFollowers: 1000, baselineFollowers: 0, baselineObservedAt: '2026-11-10T15:01:00+07:00',
    deadline: '2026-11-20T23:59:59+07:00', timezone: 'Asia/Bangkok',
    posts: initialTikTokPosts, departmentAssignments: initialTikTokDepartmentAssignments,
    metrics: [{ followers: 0, observedAt: '2026-11-10T15:01:00+07:00', source: 'Founder read-back from TikTok profile', note: 'Baseline read-back in logged-in profile.' }],
    reports: [], lastCheckAt: null, nextCheckAt: null, createdAt: new Date().toISOString()
  };
}

function loadTikTokCampaign() {
  try {
    const saved = JSON.parse(fs.readFileSync(TIKTOK_CAMPAIGN_FILE, 'utf8'));
    if (saved?.id && Array.isArray(saved.posts) && Array.isArray(saved.metrics) && Array.isArray(saved.reports)) {
      if (!Array.isArray(saved.departmentAssignments)) {
        saved.departmentAssignments = initialTikTokDepartmentAssignments;
        fs.writeFileSync(TIKTOK_CAMPAIGN_FILE, JSON.stringify(saved, null, 2), 'utf8');
      }
      return saved;
    }
  } catch { /* Create the first local campaign record below. */ }
  const campaign = createTikTokCampaign();
  fs.writeFileSync(TIKTOK_CAMPAIGN_FILE, JSON.stringify(campaign, null, 2), 'utf8');
  return campaign;
}

const tikTokCampaign = loadTikTokCampaign();

function persistTikTokCampaign() {
  fs.writeFileSync(TIKTOK_CAMPAIGN_FILE, JSON.stringify(tikTokCampaign, null, 2), 'utf8');
}

function buildTikTokProgressReport(reason = 'scheduled') {
  const checkedAt = new Date();
  const latest = tikTokCampaign.metrics.at(-1);
  const published = tikTokCampaign.posts.filter(post => post.status === 'published_verified').length;
  const gap = latest ? Math.max(0, tikTokCampaign.targetFollowers - latest.followers) : null;
  const metricAgeHours = latest ? Math.max(0, (checkedAt.getTime() - Date.parse(latest.observedAt)) / 3600000) : null;
  const summary = latest
    ? `Naruto kiểm tra TikTok ${reason === 'manual' ? 'theo yêu cầu' : 'định kỳ'}: follower gần nhất ${latest.followers}/${tikTokCampaign.targetFollowers}; còn thiếu ${gap}; ${published}/10 bài có URL đọc lại. Số liệu được đọc lúc ${latest.observedAt}. ${metricAgeHours >= 2 ? 'Cần Founder đọc lại follower trong TikTok để cập nhật; runner không có API analytics.' : 'Chưa có API analytics; không tự suy đoán chỉ số mới.'}`
    : 'Chưa có số follower được Founder đọc lại từ TikTok; Naruto không thể xác nhận tiến độ ngoài nền tảng.';
  const report = { checkedAt: checkedAt.toISOString(), reason, followers: latest?.followers ?? null, publishedPosts: published, followerGap: gap, summary };
  tikTokCampaign.lastCheckAt = report.checkedAt;
  tikTokCampaign.nextCheckAt = new Date(checkedAt.getTime() + 2 * 60 * 60 * 1000).toISOString();
  tikTokCampaign.reports = [...tikTokCampaign.reports, report].slice(-100);
  persistTikTokCampaign();
  return report;
}

function runTikTokCampaignScheduler() {
  if (tikTokCampaign.status !== 'active') return;
  const next = Date.parse(tikTokCampaign.nextCheckAt || 0);
  if (!Number.isFinite(next) || Date.now() >= next) buildTikTokProgressReport('scheduled');
}

setTimeout(runTikTokCampaignScheduler, 1500).unref?.();
const campaignMonitor = setInterval(runTikTokCampaignScheduler, 60 * 1000);
campaignMonitor.unref?.();
for (const file of fs.readdirSync(JOB_ROOT).filter(name => name.endsWith('.json'))) {
  try {
    const saved = JSON.parse(fs.readFileSync(path.join(JOB_ROOT, file), 'utf8'));
    if (saved?.id && saved?.status) {
      if (['queued', 'planning', 'department_work', 'qa'].includes(saved.status)) {
        saved.status = 'interrupted';
        saved.error = 'Local server restarted during this job. Submit the task again through Naruto; API credentials are not persisted for automatic resume.';
        saved.events = [...(saved.events || []), 'Runner bá»‹ ngáº¯t do server khá»Ÿi Ä‘á»™ng láº¡i; cáº§n giao láº¡i task qua Naruto.'];
        saved.updatedAt = new Date().toISOString();
        fs.writeFileSync(path.join(JOB_ROOT, file), JSON.stringify(saved, null, 2), 'utf8');
      }
      jobs.set(saved.id, saved);
    }
  } catch { /* Ignore unreadable history files; leave them intact for inspection. */ }
}

async function runCopilotChat(payload) {
  const prompt = String(payload.prompt || '').trim();
  if (!prompt) throw Object.assign(new Error('prompt is required'), { statusCode: 400 });
  const model = String(payload.model || 'auto').trim();
  if (!/^[a-zA-Z0-9._:-]{1,100}$/.test(model)) throw Object.assign(new Error('Invalid Copilot model name'), { statusCode: 400 });
  const history = Array.isArray(payload.history) ? payload.history.slice(-6).map(item => {
    const speaker = item?.sender === 'user' ? 'Founder' : 'Assistant';
    return `${speaker}: ${String(item?.text || '').slice(0, 8000)}`;
  }).join('\n\n') : '';
  const fullPrompt = `${history ? `Recent conversation:\n${history}\n\n` : ''}Founder: ${prompt}`;
  const client = new CopilotClient({
    mode: 'empty',
    baseDirectory: path.join(ROOT, '.copilot-data'),
    workingDirectory: ROOT
  });
  let session;
  try {
    await client.start();
    const auth = await client.getAuthStatus();
    if (!auth.isAuthenticated) {
      throw Object.assign(new Error('GitHub Copilot chÆ°a Ä‘Äƒng nháº­p. Má»Ÿ PowerShell, cháº¡y `copilot login`, hoÃ n táº¥t xÃ¡c thá»±c rá»“i thá»­ láº¡i.'), { statusCode: 401 });
    }
    session = await client.createSession({
      sessionId: `konoha-chat-${crypto.randomUUID()}`,
      model,
      availableTools: [],
      systemMessage: { mode: 'append', content: String(payload.system || '') }
    });
    const response = await session.sendAndWait({ prompt: fullPrompt }, 120000);
    const text = response?.data?.content || '';
    if (!text) throw new Error('Copilot khÃ´ng tráº£ vá» ná»™i dung.');
    return text;
  } finally {
    if (session) await session.disconnect().catch(() => {});
    await client.stop().catch(() => {});
  }
}

function authFailureDetail(status) {
  if (status === 400) return 'YÃªu cáº§u cáº¥u hÃ¬nh khÃ´ng há»£p lá»‡. Kiá»ƒm tra model vÃ  API Base URL.';
  if (status === 401) return 'NhÃ  cung cáº¥p tá»« chá»‘i API key. Key sai, Ä‘Ã£ háº¿t háº¡n hoáº·c khÃ´ng Ä‘Ãºng loáº¡i.';
  if (status === 403) return 'Key Ä‘Æ°á»£c nháº­n diá»‡n nhÆ°ng tÃ i khoáº£n/project chÆ°a cÃ³ quyá»n dÃ¹ng API hoáº·c model nÃ y.';
  if (status === 404) return 'KhÃ´ng tÃ¬m tháº¥y endpoint hoáº·c model. Kiá»ƒm tra API Base URL vÃ  tÃªn model.';
  if (status === 429) return 'Key Ä‘Æ°á»£c nháº­n diá»‡n nhÆ°ng Ä‘ang háº¿t quota hoáº·c vÆ°á»£t giá»›i háº¡n tá»‘c Ä‘á»™.';
  if (status >= 500) return 'NhÃ  cung cáº¥p Ä‘ang lá»—i hoáº·c báº£o trÃ¬. HÃ£y thá»­ láº¡i sau.';
  return `Provider tráº£ vá» HTTP ${status}. Kiá»ƒm tra tráº¡ng thÃ¡i key vÃ  cáº¥u hÃ¬nh.`;
}

async function validateProvider(payload) {
  const provider = String(payload.provider || '').toLowerCase();
  const model = String(payload.model || '').trim();
  if (provider === 'copilot-cli') {
    const client = new CopilotClient({ mode: 'empty', baseDirectory: path.join(ROOT, '.copilot-data'), workingDirectory: ROOT });
    try {
      await client.start();
      const auth = await client.getAuthStatus();
      return auth.isAuthenticated
        ? { ok: true, provider, status: 'authenticated', detail: 'GitHub Copilot Ä‘Ã£ Ä‘Äƒng nháº­p vÃ  SDK nháº­n diá»‡n Ä‘Æ°á»£c tÃ i khoáº£n.' }
        : { ok: false, provider, status: 'login_required', detail: 'ChÆ°a Ä‘Äƒng nháº­p GitHub Copilot. Má»Ÿ PowerShell vÃ  cháº¡y `copilot login`, hoÃ n táº¥t xÃ¡c thá»±c rá»“i báº¥m LÆ°u Ä‘á»ƒ kiá»ƒm tra láº¡i.' };
    } catch {
      return { ok: false, provider, status: 'unavailable', detail: 'KhÃ´ng káº¿t ná»‘i Ä‘Æ°á»£c Copilot CLI/SDK. Kiá»ƒm tra cÃ i Ä‘áº·t CLI rá»“i thá»­ láº¡i.' };
    } finally { await client.stop().catch(() => {}); }
  }

  const apiKey = String(payload.apiKey || '').trim();
  const customBase = String(payload.apiBaseUrl || '').trim().replace(/\/$/, '');
  if (!apiKey) return { ok: false, provider, status: 'missing_key', detail: 'ChÆ°a nháº­p API key. ChÆ°a lÆ°u cáº¥u hÃ¬nh nÃ y.' };
  const defaults = { openai: 'https://api.openai.com/v1', deepseek: 'https://api.deepseek.com/v1', groq: 'https://api.groq.com/openai/v1', openrouter: 'https://openrouter.ai/api/v1' };
  let endpoint, headers = {};
  if (provider === 'gemini') {
    endpoint = 'https://generativelanguage.googleapis.com/v1beta/models?pageSize=100';
    headers['x-goog-api-key'] = apiKey;
  } else if (provider === 'anthropic') {
    endpoint = 'https://api.anthropic.com/v1/models?limit=100';
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
  } else if (['openai', 'deepseek', 'groq', 'openrouter', 'openai-compatible'].includes(provider)) {
    const base = customBase || defaults[provider] || '';
    let parsed;
    try { parsed = new URL(base); } catch { return { ok: false, provider, status: 'invalid_url', detail: 'API Base URL khÃ´ng há»£p lá»‡.' }; }
    if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname))) return { ok: false, provider, status: 'invalid_url', detail: 'API Base URL pháº£i dÃ¹ng HTTPS; HTTP chá»‰ Ä‘Æ°á»£c phÃ©p cho localhost.' };
    endpoint = `${base}/models`;
    headers.Authorization = `Bearer ${apiKey}`;
    if (provider === 'openrouter') { headers['HTTP-Referer'] = 'http://localhost'; headers['X-Title'] = 'Konoha Operations Center'; }
  } else return { ok: false, provider, status: 'unsupported', detail: 'NhÃ  cung cáº¥p nÃ y chÆ°a Ä‘Æ°á»£c há»— trá»£ kiá»ƒm tra.' };

  try {
    const response = await fetch(endpoint, { method: 'GET', headers, signal: AbortSignal.timeout(15000) });
    if (!response.ok) return { ok: false, provider, status: `http_${response.status}`, detail: authFailureDetail(response.status) };
    const data = await response.json();
    const list = data.models || data.data || [];
    if (model && Array.isArray(list) && list.length) {
      const normalized = model.replace(/^models\//, '');
      const found = list.some(item => [item.name, item.id].filter(Boolean).some(id => String(id).replace(/^models\//, '') === normalized));
      if (!found) return { ok: true, provider, status: 'key_valid_model_unlisted', detail: `API key Ä‘Æ°á»£c xÃ¡c thá»±c. Model â€œ${model}â€ khÃ´ng cÃ³ trong danh sÃ¡ch mÃ  provider tráº£ vá»; kiá»ƒm tra tÃªn hoáº·c quyá»n model trÆ°á»›c khi giao viá»‡c.` };
      return { ok: true, provider, status: 'valid', detail: `API key Ä‘Æ°á»£c provider cháº¥p nháº­n vÃ  model â€œ${model}â€ cÃ³ trong danh sÃ¡ch kháº£ dá»¥ng.` };
    }
    return { ok: true, provider, status: 'valid', detail: `API key Ä‘Æ°á»£c provider cháº¥p nháº­n.${model ? ` Danh sÃ¡ch model khÃ´ng Ä‘Æ°á»£c cung cáº¥p nÃªn chÆ°a xÃ¡c minh quyá»n dÃ¹ng model â€œ${model}â€.` : ''}` };
  } catch (error) {
    const timeout = error.name === 'TimeoutError' || error.name === 'AbortError';
    return { ok: false, provider, status: timeout ? 'timeout' : 'network_error', detail: timeout ? 'Provider khÃ´ng pháº£n há»“i trong 15 giÃ¢y. ChÆ°a thá»ƒ xÃ¡c nháº­n key; thá»­ láº¡i sau.' : 'KhÃ´ng káº¿t ná»‘i Ä‘Æ°á»£c provider. Kiá»ƒm tra máº¡ng, API Base URL hoáº·c tráº¡ng thÃ¡i dá»‹ch vá»¥.' };
  }
}

const MIME_TYPES = {
  '.md': 'text/markdown; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

function sendJson(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(value));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 200000) reject(new Error('Request too large')); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON')); } });
    req.on('error', reject);
  });
}

async function askAI(label, prompt, config = {}) {
  const provider = String(config.provider || 'gemini').toLowerCase();
  if (provider === 'copilot-cli') return runCopilotChat({ model: config.model || 'auto', system: `You are ${label}.`, prompt });
  const apiKey = String(config.apiKey || '').trim();
  if (!apiKey) throw Object.assign(new Error(`Thiáº¿u API key cho ${provider}. Má»Ÿ CÃ i Ä‘áº·t vÃ  nháº­p key cá»§a nhÃ  cung cáº¥p.`), { code: 'MISSING_PROVIDER_KEY' });
  const model = String(config.model || '').trim();
  let response;
  if (provider === 'gemini') {
    const selectedModel = model || 'gemini-3.8-flash';
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(selectedModel)}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: `You are ${label}. ${prompt}` }] }], generationConfig: { temperature: 0.2 } })
    });
    if (!response.ok) throw await providerResponseError('Gemini', response);
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || '';
    if (!text) throw new Error(`${label} returned no text.`);
    return text;
  }
  if (provider === 'anthropic') {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: model || 'claude-3-5-haiku-latest', max_tokens: 4096, system: `You are ${label}.`, messages: [{ role: 'user', content: prompt }] })
    });
    if (!response.ok) throw await providerResponseError('Anthropic', response);
    const data = await response.json();
    const text = data.content?.filter(item => item.type === 'text').map(item => item.text).join('') || '';
    if (!text) throw new Error(`${label} returned no text.`);
    return text;
  }
  const defaults = {
    openai: 'https://api.openai.com/v1', deepseek: 'https://api.deepseek.com/v1',
    groq: 'https://api.groq.com/openai/v1', openrouter: 'https://openrouter.ai/api/v1'
  };
  const base = String(config.apiBaseUrl || defaults[provider] || '').trim().replace(/\/$/, '');
  if (!base || !['openai', 'deepseek', 'groq', 'openrouter', 'openai-compatible'].includes(provider)) throw new Error(`Provider khÃ´ng Ä‘Æ°á»£c há»— trá»£: ${provider}`);
  let parsed;
  try { parsed = new URL(base); } catch { throw new Error('API Base URL khÃ´ng há»£p lá»‡.'); }
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname))) throw new Error('API Base URL pháº£i dÃ¹ng HTTPS (HTTP chá»‰ Ä‘Æ°á»£c phÃ©p cho localhost).');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };
  if (provider === 'openrouter') { headers['HTTP-Referer'] = 'http://localhost'; headers['X-Title'] = 'Konoha Operations Center'; }
  response = await fetch(`${base}/chat/completions`, {
    method: 'POST', headers,
    body: JSON.stringify({ model: model || (provider === 'openai' ? 'gpt-4o-mini' : provider === 'deepseek' ? 'deepseek-chat' : provider === 'groq' ? 'llama-3.3-70b-versatile' : ''), messages: [{ role: 'system', content: `You are ${label}.` }, { role: 'user', content: prompt }], temperature: 0.2 })
  });
  if (!response.ok) throw await providerResponseError(provider, response);
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  if (!text) throw new Error(`${label} returned no text.`);
  return text;
}

async function providerResponseError(provider, response) {
  const detail = (await response.text()).slice(0, 1600);
  const error = new Error(`${provider} API ${response.status}: ${detail}`);
  error.statusCode = response.status;
  throw error;
}

async function askAIWithRetry(label, prompt, config, job) {
  const delays = [15000, 60000, 180000];
  for (let attempt = 0; ; attempt++) {
    try { return await askAI(label, prompt, config); }
    catch (error) {
      const transient = error.statusCode === 429 || error.statusCode >= 500 || ['AbortError', 'TimeoutError'].includes(error.name) || error instanceof TypeError;
      if (!transient || attempt >= delays.length) throw error;
      const waitMs = delays[attempt];
      job.events.push(`${label}: provider táº¡m thá»i lá»—i (${error.statusCode || error.name}); Naruto sáº½ thá»­ láº¡i láº§n ${attempt + 2}/4 sau ${Math.round(waitMs / 1000)} giÃ¢y.`);
      persistJob(job);
      await new Promise(resolve => setTimeout(resolve, waitMs));
    }
  }
}

function enqueueJob(job, config) {
  runtimeConfigs.set(job.id, config);
  jobQueue.push(job.id);
  persistJob(job);
  processJobQueue();
}

async function processJobQueue() {
  if (queueWorkerRunning) return;
  queueWorkerRunning = true;
  try {
    while (jobQueue.length) {
      const jobId = jobQueue.shift();
      const job = jobs.get(jobId);
      const config = runtimeConfigs.get(jobId);
      if (!job || !config) continue;
      await runJob(job, config);
      runtimeConfigs.delete(jobId);
    }
  } finally {
    queueWorkerRunning = false;
    if (jobQueue.length) processJobQueue();
  }
}

function runNarutoScheduledProgressCheck() {
  const now = new Date();
  for (const job of jobs.values()) {
    if (!['queued', 'planning', 'department_work', 'qa'].includes(job.status)) continue;
    const lastCheck = Date.parse(job.lastProgressReportAt || job.createdAt || 0);
    if (now.getTime() - lastCheck < 2 * 60 * 60 * 1000) continue;
    const assignments = job.departmentAssignments || [];
    const completed = assignments.filter(item => item.status === 'completed').length;
    const working = assignments.filter(item => item.status === 'in_progress').map(item => item.departmentName);
    const waiting = assignments.filter(item => item.status === 'queued').length;
    const blocked = assignments.filter(item => item.status === 'blocked').map(item => item.departmentName);
    const summary = assignments.length
      ? `Naruto kiá»ƒm tra tiáº¿n Ä‘á»™: ${completed}/${assignments.length} phÃ²ng ban Ä‘Ã£ ná»™p Ä‘áº§u ra; ${working.length ? `Ä‘ang lÃ m: ${working.join(', ')}` : 'khÃ´ng cÃ³ phÃ²ng ban Ä‘ang cháº¡y'}; ${waiting} chá»; ${blocked.length ? `blocker: ${blocked.join(', ')}` : 'chÆ°a ghi nháº­n blocker'}. Job: ${job.status}.`
      : `Naruto kiá»ƒm tra tiáº¿n Ä‘á»™: Ä‘ang á»Ÿ bÆ°á»›c ${job.status}; chÆ°a cÃ³ phÃ²ng ban nÃ o Ä‘Æ°á»£c giao hoáº·c bÃ¡o cÃ¡o. Job: ${job.status}.`;
    job.lastProgressReportAt = now.toISOString();
    job.progressReports = [...(job.progressReports || []), { checkedAt: now.toISOString(), summary }].slice(-20);
    job.events.push(summary);
    persistJob(job);
  }
}
const progressMonitor = setInterval(runNarutoScheduledProgressCheck, 2 * 60 * 60 * 1000);
progressMonitor.unref?.();

const COMPANY_DEPARTMENTS = {
  hinata: { name: 'Hinata â€” NghiÃªn cá»©u & Dá»¯ liá»‡u', role: 'TÃ¬m báº±ng chá»©ng, phÃ¢n biá»‡t dá»¯ kiá»‡n vá»›i giáº£ Ä‘á»‹nh, láº­p danh sÃ¡ch cÃ¢u há»i cáº§n kiá»ƒm chá»©ng.' },
  shikamaru: { name: 'Shikamaru â€” Chiáº¿n lÆ°á»£c & Káº¿ hoáº¡ch', role: 'Æ¯u tiÃªn 80/20, phÃ¢n tÃ­ch pháº¡m vi, effort, phá»¥ thuá»™c vÃ  rá»§i ro.' },
  sakura: { name: 'Sakura â€” KhÃ¡ch hÃ ng & CRM', role: 'PhÃ¢n tÃ­ch ngÆ°á»i dÃ¹ng, hÃ nh trÃ¬nh khÃ¡ch hÃ ng, proposal vÃ  chÄƒm sÃ³c á»Ÿ dáº¡ng báº£n nhÃ¡p.' },
  jiraiya: { name: 'Jiraiya â€” Marketing & Ná»™i dung', role: 'ThÃ´ng Ä‘iá»‡p, ná»™i dung, ká»‹ch báº£n vÃ  storytelling; khÃ´ng tá»± Ä‘Äƒng hoáº·c gá»­i ra ngoÃ i.' },
  sai: { name: 'Sai â€” Thiáº¿t káº¿ & Tráº£i nghiá»‡m', role: 'Luá»“ng UX, há»‡ thá»‘ng hÃ¬nh áº£nh, giao diá»‡n, kháº£ nÄƒng tiáº¿p cáº­n vÃ  bá»‘ cá»¥c.' },
  sasuke: { name: 'Sasuke â€” CÃ´ng nghá»‡ & XÃ¢y dá»±ng', role: 'MÃ£ nguá»“n, app/prototype, API, tá»± Ä‘á»™ng hÃ³a vÃ  hÆ°á»›ng dáº«n cháº¡y local.' },
  tsunade: { name: 'Tsunade â€” TÃ i chÃ­nh & Rá»§i ro', role: 'Chi phÃ­, giáº£ Ä‘á»‹nh tÃ i chÃ­nh, dÃ²ng tiá»n vÃ  kiá»ƒm soÃ¡t rá»§i ro; khÃ´ng chi hoáº·c chuyá»ƒn tiá»n.' }
};

function persistJob(job) {
  job.updatedAt = new Date().toISOString();
  fs.writeFileSync(path.join(JOB_ROOT, `${job.id}.json`), JSON.stringify(job, null, 2), 'utf8');
}

function parseJsonReply(text) {
  const cleaned = String(text || '').replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('Naruto khÃ´ng tráº£ vá» gÃ³i Ä‘iá»u phá»‘i JSON há»£p lá»‡.');
  try { return JSON.parse(cleaned.slice(start, end + 1)); }
  catch { throw new Error('GÃ³i Ä‘iá»u phá»‘i cá»§a Naruto sai cáº¥u trÃºc; chÆ°a giao viá»‡c cho phÃ²ng ban.'); }
}

function wantsAppArtifact(brief) {
  return /\b(app|application|web|website|game|prototype|dashboard|landing page|html|software|script|source code)\b|á»©ng dá»¥ng|trÃ² chÆ¡i|trang web|báº£n máº«u|mÃ£ nguá»“n|tá»‡p code/i.test(brief);
}

function makeDepartmentAssignments(plan, requiresApp) {
  const seen = new Set();
  const assignments = (Array.isArray(plan.departmentAssignments) ? plan.departmentAssignments : [])
    .filter(item => item && COMPANY_DEPARTMENTS[item.departmentId] && item.departmentId !== 'kakashi' && !seen.has(item.departmentId) && seen.add(item.departmentId))
    .map(item => ({
      departmentId: item.departmentId,
      departmentName: COMPANY_DEPARTMENTS[item.departmentId].name,
      task: String(item.task || '').trim().slice(0, 1200),
      deliverable: String(item.deliverable || '').trim().slice(0, 500),
      status: 'queued'
    })).filter(item => item.task).slice(0, 5)
    .sort((a, b) => ({ hinata: 1, shikamaru: 2, tsunade: 3, sakura: 4, jiraiya: 5, sai: 6, sasuke: 7 })[a.departmentId] - ({ hinata: 1, shikamaru: 2, tsunade: 3, sakura: 4, jiraiya: 5, sai: 6, sasuke: 7 })[b.departmentId]);
  if (requiresApp && !assignments.some(item => item.departmentId === 'sasuke')) assignments.push({ departmentId: 'sasuke', departmentName: COMPANY_DEPARTMENTS.sasuke.name, task: 'XÃ¢y dá»±ng artifact app/prototype local theo yÃªu cáº§u vÃ  cÃ¡c Ä‘áº§u vÃ o chuyÃªn mÃ´n.', deliverable: 'Artifact cháº¡y local', status: 'queued' });
  if (!assignments.length) throw new Error('Naruto chÆ°a chá»n phÃ²ng ban há»£p lá»‡; khÃ´ng tá»± giao tháº³ng cho agent khÃ¡c.');
  assignments.push({ departmentId: 'kakashi', departmentName: 'Kakashi â€” QA & Release Gate', task: 'Kiá»ƒm tra Ä‘áº§u ra, acceptance criteria, lá»—i vÃ  rá»§i ro; ghi PASS, NEEDS_REVIEW hoáº·c BLOCKED.', deliverable: 'BÃ¡o cÃ¡o QA cÃ³ báº±ng chá»©ng', status: 'queued' });
  return assignments;
}

function markdownReport(job) {
  const departments = (job.departmentAssignments || []).map(item => `## ${item.departmentName}\n- Naruto giao: ${item.task}\n- Äáº§u ra: ${item.deliverable}\n- Tráº¡ng thÃ¡i: ${item.status}\n\n${job.outputs.departments?.[item.departmentId] || ''}`).join('\n\n');
  return `# BÃ¡o cÃ¡o Ä‘iá»u phá»‘i cÃ´ng viá»‡c: ${job.title}\n\n- Job: ${job.id}\n- Tráº¡ng thÃ¡i: ${job.status}\n- Táº¡o lÃºc: ${job.createdAt}\n- Naruto lÃ  Ä‘iá»u phá»‘i viÃªn; Founder duyá»‡t quyáº¿t Ä‘á»‹nh cuá»‘i.\n\n## Káº¿ hoáº¡ch Naruto\n${job.outputs.plan || 'ChÆ°a cÃ³'}\n\n## CÃ¡c phÃ²ng ban Ä‘Æ°á»£c giao\n${departments}\n\n## Artifact\n${job.artifactUrl || 'KhÃ´ng táº¡o artifact web cho brief nÃ y.'}\n\n## Kakashi â€” QA\n${job.outputs.qa || 'ChÆ°a cÃ³'}\n\n## Kiá»ƒm tra há»‡ thá»‘ng\n${(job.checks || []).join('\n')}\n`;
}

async function runJob(job, config) {
  let html = '';
  try {
    const requiresApp = wantsAppArtifact(job.brief);
    job.status = 'planning';
    job.events.push('Naruto Ä‘ang phÃ¢n tÃ­ch brief vÃ  chá»n phÃ²ng ban phÃ¹ há»£p.');
    persistJob(job);
    const routingReply = await askAIWithRetry('Naruto Uzumaki, COO and sole task orchestrator', `Báº¡n lÃ  Naruto, Ä‘iá»u phá»‘i viÃªn duy nháº¥t. PhÃ¢n tÃ­ch brief Founder rá»“i chá»n 1â€“5 phÃ²ng ban phÃ¹ há»£p tá»« danh sÃ¡ch cho phÃ©p. Táº¡o viá»‡c cá»¥ thá»ƒ riÃªng cho tá»«ng phÃ²ng ban vÃ  Ä‘áº§u ra nghiá»‡m thu. KhÃ´ng tá»± lÃ m thay chuyÃªn viÃªn. Kakashi sáº½ luÃ´n QA riÃªng sau cÃ¹ng.\n\nDanh sÃ¡ch Ä‘Æ°á»£c phÃ©p (departmentId â€” nÄƒng lá»±c):\n${Object.entries(COMPANY_DEPARTMENTS).map(([id, team]) => `- ${id}: ${team.name}. ${team.role}`).join('\n')}\n\nChá»‰ tráº£ JSON, khÃ´ng markdown, schema:\n{"plan":"káº¿ hoáº¡ch tiáº¿ng Viá»‡t ngáº¯n","departmentAssignments":[{"departmentId":"sasuke","task":"viá»‡c cá»¥ thá»ƒ","deliverable":"Ä‘áº§u ra"}]}\n\nNáº¿u brief lÃ  app/pháº§n má»m/prototype, pháº£i chá»n sasuke; chá»n thÃªm Sai/Hinata/Sakura/Jiraiya/Tsunade khi phÃ¹ há»£p. KhÃ´ng giao Kakashi vÃ o assignments vÃ¬ QA Ä‘Æ°á»£c Ä‘iá»u phá»‘i riÃªng. KhÃ´ng bá»‹a tiáº¿n Ä‘á»™, báº±ng chá»©ng hoáº·c hÃ nh Ä‘á»™ng bÃªn ngoÃ i.\n\nBRIEF FOUNDER:\n${job.brief}`, config, job);
    const routing = parseJsonReply(routingReply);
    job.outputs.plan = String(routing.plan || '').trim();
    if (!job.outputs.plan) throw new Error('Naruto tráº£ vá» gÃ³i Ä‘iá»u phá»‘i nhÆ°ng thiáº¿u káº¿ hoáº¡ch.');
    job.departmentAssignments = makeDepartmentAssignments(routing, requiresApp);
    job.requiresHtml = requiresApp;
    job.events.push(`Naruto Ä‘Ã£ giao viá»‡c cho ${job.departmentAssignments.slice(0, -1).map(item => item.departmentName.split(' â€” ')[0]).join(', ')}; Kakashi Ä‘Æ°á»£c giá»¯ lÃ m cá»•ng QA.`);
    persistJob(job);

    job.status = 'department_work';
    job.outputs.departments = {};
    for (const assignment of job.departmentAssignments.slice(0, -1)) {
      const team = COMPANY_DEPARTMENTS[assignment.departmentId];
      const workContext = job.departmentAssignments.slice(0, -1).filter(item => item.status === 'completed').map(item => `### ${item.departmentName}\nNhiá»‡m vá»¥: ${item.task}\nÄáº§u ra cáº§n: ${item.deliverable}\nKáº¿t quáº£:\n${job.outputs.departments[item.departmentId] || ''}`).join('\n\n');
      assignment.status = 'in_progress';
      job.events.push(`${assignment.departmentName} Ä‘ang xá»­ lÃ½ pháº§n viá»‡c Naruto giao.`);
      persistJob(job);
      const isBuilder = assignment.departmentId === 'sasuke' && requiresApp;
      const prompt = isBuilder
        ? `Naruto giao báº¡n xÃ¢y dá»±ng app/prototype. Táº¡o Má»˜T tÃ i liá»‡u HTML Ä‘á»™c láº­p hoÃ n chá»‰nh; chá»‰ tráº£ HTML, khÃ´ng markdown hoáº·c giáº£i thÃ­ch. Cháº¡y offline, khÃ´ng analytics, khÃ´ng tÃ i khoáº£n, khÃ´ng gá»­i dá»¯ liá»‡u, khÃ´ng gá»i API bÃªn ngoÃ i. Káº¿t há»£p káº¿ hoáº¡ch vÃ  Ä‘áº§u ra cÃ¡c phÃ²ng ban dÆ°á»›i Ä‘Ã¢y.\n\nBrief:\n${job.brief}\n\nKáº¿ hoáº¡ch Naruto:\n${job.outputs.plan}\n\nÄáº§u vÃ o phÃ²ng ban:\n${workContext}`
        : `Naruto giao báº¡n pháº§n viá»‡c dÆ°á»›i Ä‘Ã¢y. Táº­p trung Ä‘Ãºng nÄƒng lá»±c phÃ²ng ban; ghi rÃµ dá»¯ kiá»‡n, giáº£ Ä‘á»‹nh vÃ  pháº§n cáº§n Founder xÃ¡c nháº­n. KhÃ´ng tá»± Ä‘Äƒng nháº­p, gá»­i, Ä‘Äƒng, mua, chi tiá»n hay thá»±c hiá»‡n hÃ nh Ä‘á»™ng bÃªn ngoÃ i. Tráº£ lá»i tiáº¿ng Viá»‡t vá»›i Ä‘áº§u ra cÃ³ thá»ƒ bÃ n giao.\n\nPhÃ²ng ban: ${team.name}\nNÄƒng lá»±c: ${team.role}\nNhiá»‡m vá»¥: ${assignment.task}\nÄáº§u ra: ${assignment.deliverable}\n\nBrief Founder:\n${job.brief}\n\nKáº¿ hoáº¡ch Naruto:\n${job.outputs.plan}`;
      const result = await askAIWithRetry(`${team.name} â€” company department specialist`, prompt, config, job);
      if (isBuilder) {
        html = result.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
        if (!/<html[\s>]/i.test(html) || html.length < 200) throw new Error('Sasuke khÃ´ng tráº£ vá» artifact HTML Ä‘á»™c láº­p há»£p lá»‡.');
        assignment.status = 'completed';
        job.outputs.departments[assignment.departmentId] = `ÄÃ£ táº¡o artifact local: deliveries/${job.id}/index.html`;
      } else {
        job.outputs.departments[assignment.departmentId] = result.slice(0, 30000);
        assignment.status = 'completed';
      }
      persistJob(job);
    }

    const jobDir = path.join(DELIVERY_ROOT, job.id);
    fs.mkdirSync(jobDir, { recursive: true });
    if (requiresApp) {
      fs.writeFileSync(path.join(jobDir, 'index.html'), html, 'utf8');
      job.artifactUrl = `/deliveries/${job.id}/index.html`;
      job.outputs.build = `ÄÃ£ táº¡o app artifact: deliveries/${job.id}/index.html`;
      job.checks.push('PASS: Sasuke táº¡o artifact HTML Ä‘á»™c láº­p; cáº§n má»Ÿ preview Ä‘á»ƒ xÃ¡c nháº­n tÆ°Æ¡ng tÃ¡c vÃ  acceptance.');
    } else {
      job.artifactUrl = `/deliveries/${job.id}/REPORT.md`;
      job.outputs.build = `ÄÃ£ táº¡o bÃ¡o cÃ¡o bÃ n giao: deliveries/${job.id}/REPORT.md`;
    }

    const qaAssignment = job.departmentAssignments.find(item => item.departmentId === 'kakashi');
    qaAssignment.status = 'in_progress';
    job.status = 'qa';
    job.events.push('Kakashi Ä‘ang kiá»ƒm tra artifact vÃ  tiÃªu chÃ­ nghiá»‡m thu.');
    persistJob(job);
    let artifactForReview = requiresApp ? html.slice(0, 50000) : Object.entries(job.outputs.departments).map(([id, output]) => `## ${COMPANY_DEPARTMENTS[id].name}\n${output}`).join('\n\n').slice(0, 50000);
    job.reportDraftPath = path.join('deliveries', job.id, 'REPORT_DRAFT.md');
    fs.writeFileSync(path.join(jobDir, 'REPORT_DRAFT.md'), markdownReport(job), 'utf8');
    const reportDraftBytes = fs.statSync(path.join(jobDir, 'REPORT_DRAFT.md')).size;
    job.checks.push(`PASS: Server confirmed ${job.reportDraftPath} exists (${reportDraftBytes} bytes); complete review content is included below for Kakashi.`);
    artifactForReview = `Server đã xác nhận báo cáo dự thảo tồn tại tại ${job.reportDraftPath} (${reportDraftBytes} bytes). Kakashi hãy QA phần nội dung được cung cấp đầy đủ bên dưới, không yêu cầu truy cập filesystem.\n\n${artifactForReview}`;
    job.outputs.qa = await askAIWithRetry('Kakashi Hatake, independent QA and safety reviewer', `Naruto Ä‘Ã£ Ä‘iá»u phá»‘i cÃ¡c phÃ²ng ban; báº¡n lÃ  cá»•ng QA Ä‘á»™c láº­p. Äá»‘i chiáº¿u brief, káº¿ hoáº¡ch, Ä‘áº§u ra phÃ²ng ban vÃ  artifact. Báº£n bÃ¡o cÃ¡o dá»± tháº£o Ä‘Ã£ Ä‘Æ°á»£c ghi táº¡i ${job.reportDraftPath}; review cáº£ ná»™i dung Ä‘Æ°á»£c cung cáº¥p dÆ°á»›i Ä‘Ã¢y vÃ  nÃªu rÃµ nhá»¯ng gÃ¬ chÆ°a thá»ƒ kiá»ƒm chá»©ng. Báº¯t Ä‘áº§u cÃ¢u tráº£ lá»i báº±ng Ä‘Ãºng má»™t tráº¡ng thÃ¡i: PASS, NEEDS_REVIEW hoáº·c BLOCKED. Liá»‡t kÃª báº±ng chá»©ng Ä‘Ã£ kiá»ƒm tra, lá»—i cá»¥ thá»ƒ, acceptance chÆ°a chá»©ng minh vÃ  viá»‡c Founder cáº§n quyáº¿t Ä‘á»‹nh. KhÃ´ng gá»i má»™t háº¡ng má»¥c Ä‘áº¡t náº¿u chÆ°a cÃ³ báº±ng chá»©ng. KhÃ´ng phÃª duyá»‡t phÃ¡t hÃ nh, chi tiá»n, Ä‘Äƒng bÃ i hay hÃ nh Ä‘á»™ng bÃªn ngoÃ i.\n\nBrief:\n${job.brief}\n\nKáº¿ hoáº¡ch Naruto:\n${job.outputs.plan}\n\nÄáº§u ra phá»ng ban:\n${artifactForReview}`, config, job);
    qaAssignment.status = 'completed';
    job.qaDisposition = (job.outputs.qa.match(/\b(PASS|NEEDS_REVIEW|BLOCKED)\b/i) || [])[1]?.toUpperCase() || 'NEEDS_REVIEW';
    if (job.qaDisposition === 'BLOCKED') {
      qaAssignment.status = 'blocked';
      job.status = 'blocked_qa';
      job.events.push('Kakashi cháº·n bÃ n giao; xem bÃ¡o cÃ¡o QA Ä‘á»ƒ xá»­ lÃ½ blocker.');
    } else {
      job.status = 'needs_founder_product_confirmation';
      job.events.push(job.qaDisposition === 'PASS' ? 'Kakashi hoÃ n táº¥t QA; artifact chá» Founder xÃ¡c nháº­n.' : 'Kakashi yÃªu cáº§u Founder xem cÃ¡c Ä‘iá»ƒm NEEDS_REVIEW trÆ°á»›c khi xÃ¡c nháº­n.');
    }
    fs.writeFileSync(path.join(jobDir, 'REPORT.md'), markdownReport(job), 'utf8');
  } catch (error) {
    job.status = error.code === 'MISSING_PROVIDER_KEY' || error.statusCode === 401 ? 'blocked_no_api_key' : 'failed';
    const safeMessage = String(error.message || 'Runner dá»«ng.').replace(config.apiKey || '\u0000', '[REDACTED]');
    job.error = safeMessage;
    job.events.push(`Runner dá»«ng: ${safeMessage}`);
  } finally {
    persistJob(job);
  }
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && requestUrl.pathname === '/healthz') {
    return sendJson(res, 200, { ok: true, service: 'konoha-backend', checkedAt: new Date().toISOString() });
  }
  if (req.method === 'GET' && requestUrl.pathname === '/api/tiktok-campaign') {
    return sendJson(res, 200, tikTokCampaign);
  }
  if (req.method === 'POST' && requestUrl.pathname === '/api/tiktok-campaign/check') {
    return sendJson(res, 200, { campaign: tikTokCampaign, report: buildTikTokProgressReport('manual') });
  }
  if (req.method === 'POST' && requestUrl.pathname === '/api/tiktok-campaign/metrics') {
    readJson(req).then(payload => {
      const followers = Number(payload.followers);
      if (!Number.isSafeInteger(followers) || followers < 0 || followers > 100000000) return sendJson(res, 400, { error: 'followers must be an integer from 0 to 100000000' });
      const metric = {
        followers,
        observedAt: new Date().toISOString(),
        source: 'Founder manual read-back from TikTok profile',
        note: String(payload.note || '').trim().slice(0, 500)
      };
      tikTokCampaign.metrics = [...tikTokCampaign.metrics, metric].slice(-100);
      persistTikTokCampaign();
      const report = buildTikTokProgressReport('manual');
      sendJson(res, 200, { campaign: tikTokCampaign, metric, report });
    }).catch(error => sendJson(res, 400, { error: error.message }));
    return;
  }
  const campaignPostMatch = requestUrl.pathname.match(/^\/api\/tiktok-campaign\/posts\/(\d+)$/);
  if (req.method === 'POST' && campaignPostMatch) {
    readJson(req).then(payload => {
      const day = Number(campaignPostMatch[1]);
      const post = tikTokCampaign.posts.find(item => item.day === day);
      const allowed = new Set(['planned', 'rendered', 'approved', 'uploaded_unverified', 'published_verified', 'skipped']);
      const status = String(payload.status || '');
      if (!post) return sendJson(res, 404, { error: 'Campaign post not found' });
      if (!allowed.has(status)) return sendJson(res, 400, { error: 'Unsupported post status' });
      if (['uploaded_unverified', 'published_verified'].includes(status) && !['approved', 'uploaded_unverified'].includes(post.status)) return sendJson(res, 409, { error: 'Record Founder approval before upload or publication status' });
      if (post.status === 'published_verified' && status !== 'published_verified') return sendJson(res, 409, { error: 'Published verification is append-only; keep its URL and history' });
      if (status === 'published_verified') {
        let url;
        try { url = new URL(String(payload.postUrl || '')); } catch { return sendJson(res, 400, { error: 'TikTok post URL is required for published_verified' }); }
        const accountPath = `/@${tikTokCampaign.account.replace(/^@/, '')}/video/`;
        if (!/(^|\.)tiktok\.com$/i.test(url.hostname) || !url.pathname.startsWith(accountPath) || !/^\/@[^/]+\/video\/\d+/.test(url.pathname)) return sendJson(res, 400, { error: 'Enter a TikTok video URL for @cinetech.ai' });
      }
      if (status === 'approved' && !String(payload.approvalNote || '').trim()) return sendJson(res, 400, { error: 'Record Founder approval before setting approved' });
      const previous = post.status;
      post.status = status;
      post.postUrl = status === 'published_verified' ? String(payload.postUrl).trim() : (status === 'uploaded_unverified' ? '' : post.postUrl);
      post.notes = String(payload.note || payload.approvalNote || '').trim().slice(0, 500);
      post.updatedAt = new Date().toISOString();
      post.events = [...(post.events || []), { at: post.updatedAt, previous, status, note: post.notes }].slice(-20);
      persistTikTokCampaign();
      sendJson(res, 200, { campaign: tikTokCampaign, post });
    }).catch(error => sendJson(res, 400, { error: error.message }));
    return;
  }
  if (req.method === 'POST' && requestUrl.pathname === '/api/copilot/chat') {
    readJson(req).then(payload => runCopilotChat(payload)
      .then(text => sendJson(res, 200, { text }))
      .catch(error => sendJson(res, error.statusCode || 502, { error: error.message })))
      .catch(error => sendJson(res, 400, { error: error.message }));
    return;
  }
  if (req.method === 'POST' && requestUrl.pathname === '/api/providers/validate') {
    readJson(req).then(payload => validateProvider(payload)
      .then(result => sendJson(res, 200, result))
      .catch(() => sendJson(res, 200, { ok: false, status: 'validation_error', detail: 'KhÃ´ng hoÃ n táº¥t Ä‘Æ°á»£c kiá»ƒm tra xÃ¡c thá»±c. Thá»­ láº¡i sau.' })))
      .catch(error => sendJson(res, 400, { ok: false, status: 'invalid_request', detail: error.message }));
    return;
  }
  if (req.method === 'POST' && requestUrl.pathname === '/api/automation/jobs') {
    readJson(req).then(payload => {
      const brief = String(payload.brief || '').trim();
      if (!brief) return sendJson(res, 400, { error: 'brief is required' });
      const config = { provider: String(payload.provider || 'gemini'), apiKey: String(payload.apiKey || ''), model: String(payload.model || ''), apiBaseUrl: String(payload.apiBaseUrl || '') };
      const id = `job-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
      const job = { id, title: String(payload.title || 'Founder task'), brief, status: 'queued', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), events: ['ÄÃ£ nháº­n task tá»« Founder.'], outputs: {}, checks: [], artifactUrl: null };
      jobs.set(id, job);
      enqueueJob(job, config);
      sendJson(res, 202, job);
    }).catch(error => sendJson(res, 400, { error: error.message }));
    return;
  }
  const jobMatch = requestUrl.pathname.match(/^\/api\/automation\/jobs\/([\w-]+)$/);
  if (req.method === 'GET' && jobMatch) {
    const job = jobs.get(jobMatch[1]);
    return job ? sendJson(res, 200, job) : sendJson(res, 404, { error: 'Job not found in this server session' });
  }
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();

  // Keep private runtime state, credentials, source control, and dependencies out of the static web root.
  const relativeFilePath = path.relative(ROOT, filePath);
  const protectedSegments = new Set(['.automation-jobs', '.copilot-data', '.git', 'node_modules']);
  const segments = relativeFilePath.split(path.sep);
  const privateFile = segments.some(segment => protectedSegments.has(segment)) || segments.some(segment => /^\.env(?:\.|$)/i.test(segment));
  if (path.isAbsolute(relativeFilePath) || relativeFilePath === '..' || relativeFilePath.startsWith(`..${path.sep}`) || privateFile) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});
server.listen(PORT, HOST, () => {
  console.log(`\n======================================================`);
  console.log(`  KONOHA SOLOPRENEUR OS - Äang hoáº¡t Ä‘á»™ng!`);
  console.log(`  Truy cáº­p ngay trÃªn trÃ¬nh duyá»‡t:`);
  console.log(`  ðŸ‘‰ http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`======================================================\n`);
});\n