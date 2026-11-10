(() => {
  const byId = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  let campaign = null;
  let requestPending = false;

  async function request(url, body) {
    const response = await fetch(url, body ? {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    } : { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    return data;
  }

  function localTime(value) {
    if (!value) return 'chưa có';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'không rõ';
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Bangkok' }).format(date) + ' ICT';
  }

  function statusText(status) {
    return ({ planned: 'Đã lên lịch', rendered: 'Đã dựng', approved: 'Founder đã duyệt', uploaded_unverified: 'Đã tải · chưa xác minh', published_verified: 'Đã đăng · có link đọc lại', skipped: 'Tạm bỏ' })[status] || status;
  }

  function showMessage(text, isError = false) {
    const target = byId('tiktok-campaign-message');
    if (!target) return;
    target.textContent = text;
    target.className = `text-xs rounded-lg p-3 ${isError ? 'text-rose-200 bg-rose-500/10 border border-rose-500/30' : 'text-emerald-200 bg-emerald-500/10 border border-emerald-500/30'}`;
  }

  function render() {
    if (!campaign) return;
    const latest = campaign.metrics?.at(-1);
    const current = latest?.followers ?? campaign.baselineFollowers;
    const published = campaign.posts.filter(post => post.status === 'published_verified').length;
    const gap = Math.max(0, campaign.targetFollowers - current);
    const cards = [
      ['Mục tiêu', `${campaign.targetFollowers.toLocaleString()} follower`],
      ['Đã đọc lại', `${current.toLocaleString()} follower`],
      ['Còn thiếu theo số liệu gần nhất', `${gap.toLocaleString()}`],
      ['Bài có link đọc lại', `${published}/10`]
    ];
    byId('tiktok-campaign-summary').innerHTML = cards.map(([label, value]) => `<div class="p-3 rounded-lg bg-slate-900"><div class="text-[10px] text-slate-500">${esc(label)}</div><div class="mt-1 text-sm font-bold text-slate-100">${esc(value)}</div></div>`).join('');
    const latestTime = latest?.observedAt || campaign.baselineObservedAt;
    const nextCheck = campaign.nextCheckAt ? ` · Lần kế tiếp dự kiến ${localTime(campaign.nextCheckAt)}` : '';
    const reports = campaign.reports || [];
    const latestReport = reports.at(-1);
    byId('tiktok-campaign-monitor').innerHTML = `<div class="font-semibold">Naruto monitor · ${campaign.status === 'active' ? 'đang chạy khi server local còn bật' : 'đang tạm dừng'}</div><div class="mt-1">Số liệu gần nhất: ${esc(localTime(latestTime))}${nextCheck}</div><div class="mt-1">${esc(latestReport?.summary || 'Chưa có báo cáo chu kỳ; runner sẽ tạo báo cáo đầu tiên khi khởi động.')}</div><details class="mt-2"><summary class="cursor-pointer text-sky-100">Lịch sử kiểm tra (${reports.length})</summary><div class="mt-2 space-y-1">${reports.slice().reverse().slice(0, 10).map(item => `<div class="text-[11px] text-slate-300">${esc(localTime(item.checkedAt))} · ${esc(item.summary)}</div>`).join('')}</div></details>`;
    byId('tiktok-campaign-posts').innerHTML = campaign.posts.map(post => {
      const when = localTime(post.scheduledAt);
      const options = ['planned', 'rendered', 'approved', 'uploaded_unverified', 'published_verified', 'skipped'];
      const link = post.postUrl ? `<a class="text-sky-300 underline" href="${esc(post.postUrl)}" target="_blank" rel="noopener noreferrer">Mở bài đã đọc lại</a>` : '';
      const note = post.notes ? `<div class="mt-1 text-[10px] text-slate-500">${esc(post.notes)}</div>` : '';
      const fileHint = post.day === 1 ? `<div class="mt-1 text-[10px] text-amber-200">MP4 đã dựng cục bộ; TikTok Studio vẫn cần chọn file và xác nhận sau tải.</div>` : '';
      const draftDetails = post.caption || post.assetPath ? `<details class="mt-2 text-[10px]"><summary class="cursor-pointer text-sky-200">Caption và tệp bàn giao</summary>${post.caption ? `<p class="mt-1 text-slate-300">${esc(post.caption)}</p>` : ''}${post.assetPath ? `<p class="mt-1 text-slate-500 break-all">Tệp local: ${esc(post.assetPath)}</p>` : ''}</details>` : '';
      return `<article class="rounded-lg bg-slate-950/70 border border-slate-800 p-3"><div class="flex flex-col md:flex-row md:items-center gap-2"><div class="min-w-0 flex-1"><div class="text-[10px] text-slate-500">Ngày ${post.day} · ${esc(when)}</div><div class="text-xs font-semibold text-slate-200 mt-0.5">${esc(post.title)}</div>${note}${fileHint}${draftDetails}${link}</div><div class="flex gap-2 items-center"><span class="text-[10px] text-slate-400">${esc(statusText(post.status))}</span><select aria-label="Trạng thái ngày ${post.day}" onchange="updateTikTokPostStatus(${post.day}, this.value)" class="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-[10px] text-slate-200">${options.map(value => `<option value="${value}" ${post.status === value ? 'selected' : ''}>${esc(statusText(value))}</option>`).join('')}</select></div></div></article>`;
    }).join('');
  }

  async function load() {
    if (requestPending) return;
    requestPending = true;
    try {
      campaign = await request('/api/tiktok-campaign');
      window.konohaTikTokCampaign = campaign;
      render();
      if (typeof window.renderDioramaCards === 'function') window.renderDioramaCards();
    }
    catch (error) { showMessage(`Không tải được campaign monitor: ${error.message}`, true); }
    finally { requestPending = false; }
  }

  window.checkTikTokCampaignNow = async function () {
    try { const data = await request('/api/tiktok-campaign/check', {}); campaign = data.campaign; render(); showMessage('Naruto đã ghi một báo cáo kiểm tra. Báo cáo chỉ dùng số follower Founder đã nhập; không đọc trực tiếp TikTok.'); }
    catch (error) { showMessage(`Kiểm tra thất bại: ${error.message}`, true); }
  };

  window.updateTikTokPostStatus = async function (day, status) {
    const body = { status };
    if (status === 'approved') {
      body.approvalNote = window.prompt('Ghi căn cứ duyệt của Founder (ví dụ: đã duyệt trong chat):', '') || '';
      if (!body.approvalNote.trim()) { await load(); showMessage('Chưa đổi trạng thái: cần ghi nhận căn cứ duyệt.', true); return; }
    }
    if (status === 'published_verified') {
      body.postUrl = window.prompt('Dán URL video TikTok đã mở lại trên hồ sơ:', '') || '';
      if (!body.postUrl.trim()) { await load(); showMessage('Chưa ghi là đã đăng: cần URL TikTok để đọc lại.', true); return; }
      body.note = 'Founder read-back URL từ hồ sơ TikTok.';
    }
    if (status === 'uploaded_unverified') body.note = window.prompt('Ghi chú trạng thái upload (chưa xác nhận công khai):', '') || '';
    try { const data = await request(`/api/tiktok-campaign/posts/${day}`, body); campaign = data.campaign; render(); showMessage(`Đã lưu trạng thái ngày ${day}: ${statusText(status)}. Đây là nhật ký nội bộ, không thực hiện upload/đăng bài.`); }
    catch (error) { await load(); showMessage(`Không lưu được trạng thái ngày ${day}: ${error.message}`, true); }
  };

  byId('tiktok-metric-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const input = byId('tiktok-followers-input');
    const followers = Number(input.value);
    if (!Number.isSafeInteger(followers) || followers < 0) { showMessage('Nhập số follower nguyên không âm đã đọc trên TikTok.', true); return; }
    try {
      const data = await request('/api/tiktok-campaign/metrics', { followers, note: byId('tiktok-metric-note').value });
      campaign = data.campaign; render(); input.value = ''; byId('tiktok-metric-note').value = '';
      showMessage('Đã lưu follower theo Founder read-back. Naruto đã ghi báo cáo tiến độ mới.');
    } catch (error) { showMessage(`Không lưu được số liệu: ${error.message}`, true); }
  });

  document.addEventListener('DOMContentLoaded', () => {
    load();
    window.setInterval(load, 30000);
  });
})();
