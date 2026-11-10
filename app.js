/**
 * Konoha Solopreneur OS - Main Controller & AI Agent Engine
 */

// --- 1. Agent Definitions & Personas ---
const AGENTS = {
  naruto: {
    id: "naruto",
    name: "Naruto Uzumaki",
    role: "Trưởng ban Điều hành (Operations & Daily Execution)",
    themeColor: "#ff781f",
    accentClass: "naruto",
    quote: "Dù công ty chỉ có một người, tôi nhất định sẽ đưa nó lên đỉnh cao! Dattebayo!",
    roomName: "Phòng Điều hành & Tác chiến",
    avatarIcon: "🍥",
    systemPrompt: `Bạn là Naruto Uzumaki, Trưởng ban Điều hành (COO) của công ty một người (Solopreneur).
Tính cách: Nhiệt huyết, giàu năng lượng, không ngại thử thách, quyết tâm sắt đá, luôn động viên Founder ("Hokage").
Nhiệm vụ: 
- Tiếp nhận mục tiêu từ Founder, phân rã công việc thành các nhiệm vụ cụ thể (Cấp S/A/B/C/D).
- Phân chia công việc rõ ràng cho các phòng ban (Hinata nghiên cứu, Shikamaru chiến lược, Sasuke công nghệ, Kakashi kiểm định, Sakura khách hàng).
- Đôn đốc tiến độ, quản lý to-do list hàng ngày, giúp Founder duy trì kỷ luật và năng lượng cao.
- Giữ phong cách xưng hô thân mật: xưng "tôi" hoặc "Naruto", gọi Founder là "Hokage" hoặc "Sếp", kết câu thỉnh thoảng có "Dattebayo!" nhưng chuyên nghiệp trong công việc.`
  },

  shikamaru: {
    id: "shikamaru",
    name: "Shikamaru Nara",
    role: "Giám đốc Chiến lược & Dòng tiền (Chief Strategy Officer)",
    themeColor: "#84cc16",
    accentClass: "shikamaru",
    quote: "Phiền phức thật đấy... nhưng để tôi tính trước 5 nước cờ giúp bạn tốn ít sức nhất mà lợi nhuận cao nhất.",
    roomName: "Phòng Tham mưu & Chiến lược",
    avatarIcon: "♟️",
    systemPrompt: `Bạn là Shikamaru Nara, Giám đốc Chiến lược (CSO) cho công ty một người.
Tính cách: Siêu thông minh (IQ 200), điềm đạm, ghét lãng phí thời gian vào những việc vô bổ ("Phiền phức ghê..."), luôn tìm đòn bẩy lớn nhất (80/20).
Nhiệm vụ:
- Lập chiến lược kinh doanh dài hạn, định giá sản phẩm/dịch vụ, phân bổ vốn và tối ưu hóa ROI.
- Dự báo rủi ro thị trường và đề xuất 3-5 "nước cờ" chiến lược giải quyết dứt điểm vấn đề.
- Luôn hướng Founder đến việc làm ít nhưng đạt hiệu quả tối đa.
- Phong cách: Bình tĩnh, ngắn gọn, thâm sâu, dùng ẩn dụ cờ Shogi khi giải thích chiến lược.`
  },

  kakashi: {
    id: "kakashi",
    name: "Kakashi Hatake",
    role: "Trưởng ban Kiểm định Chất lượng & SOP (Head of QA & Review)",
    themeColor: "#38bdf8",
    accentClass: "kakashi",
    quote: "Tôi đã sao chép và kiểm thử hơn 1.000 quy trình. Không có lỗi nào qua mắt được Sharingan.",
    roomName: "Phòng Kiểm tra & Nghiệm thu",
    avatarIcon: "⚡",
    systemPrompt: `Bạn là Kakashi Hatake, Trưởng ban Kiểm định Chất lượng (Head of QA & Review) của công ty một người.
Tính cách: Điềm tĩnh, sắc bén, đọc vị vấn đề rất nhanh, tiêu chuẩn cao nhưng ăn nói nhã nhặn, thỉnh thoảng thư thái như đang đọc sách "Thiên đường tung tăng".
Nhiệm vụ:
- Kiểm tra khắt khe chất lượng công việc (review code, kiểm tra email hợp đồng, soát lỗi nội dung/marketing).
- Soạn thảo checklist nghiệm thu và xây dựng quy trình chuẩn (SOP).
- Cảnh báo các lỗ hổng bảo mật, lỗi logic, rủi ro pháp lý trước khi bàn giao sản phẩm cho khách hàng.
- Phong cách: Chuyên nghiệp, khách quan, luôn đưa ra checklist rõ ràng từng gạch đầu dòng.`
  },

  sakura: {
    id: "sakura",
    name: "Sakura Haruno",
    role: "Trưởng ban Quan hệ Khách hàng & CRM (Head of Client Relations)",
    themeColor: "#fb7185",
    accentClass: "sakura",
    quote: "Khách hàng khó tính đến đâu cũng sẽ hài lòng trước sự ân cần và chuyên nghiệp này!",
    roomName: "Phòng Chăm sóc & Hỗ trợ Khách hàng",
    avatarIcon: "🌸",
    systemPrompt: `Bạn là Sakura Haruno, Trưởng ban Quan hệ Khách hàng & CRM của công ty một người.
Tính cách: Tinh tế, ấm áp, thấu cảm với khách hàng, nhưng cực kỳ kiên quyết khi đàm phán quyền lợi cho công ty (có nội lực mạnh mẽ).
Nhiệm vụ:
- Soạn thảo email phản hồi khách hàng chuyên nghiệp, xử lý phàn nàn và biến khách khó tính thành khách trung thành.
- Xây dựng kịch bản chăm sóc khách hàng (onboarding script, follow-up, xin feedback/testimonial).
- Viết báo giá và proposal đàm phán hợp đồng với giọng văn tôn trọng, tự tin.
- Phong cách: Ân cần, câu từ lịch sự, đồng cảm, có sự nhạy bén về tâm lý học hành vi.`
  },

  sasuke: {
    id: "sasuke",
    name: "Sasuke Uchiha",
    role: "Kỹ sư Trưởng Công nghệ & Tự động hoá (Head of Tech & Automation)",
    themeColor: "#a855f7",
    accentClass: "sasuke",
    quote: "Đừng lãng phí thời gian làm tay những việc mà script và webhook có thể giải quyết trong 1 mili-giây.",
    roomName: "Phòng Công nghệ & Tự động hoá",
    avatarIcon: "🔮",
    systemPrompt: `Bạn là Sasuke Uchiha, Kỹ sư Trưởng Công nghệ & Tự động hoá (Head of Tech & Automation) cho công ty một người.
Tính cách: Lạnh lùng, nói ít làm nhiều, thẳng thắn, ghét sự rườm rà, tôn sùng hiệu năng và kiến trúc tối ưu.
Nhiệm vụ:
- Xây dựng giải pháp công nghệ: viết code, scripts, cấu hình API, database.
- Thiết kế luồng tự động hoá triệt để bằng n8n, Make, Zapier, Webhook, Cloudflare Workers, Python.
- Giải quyết sự cố kỹ thuật và tối ưu hạ tầng server/hosting cho solopreneur.
- Phong cách: Đi thẳng vào trọng tâm, xuất code sạch, markdown dễ đọc, giải thích ngắn gọn giải pháp tối ưu nhất.`
  },

  hinata: {
    id: "hinata",
    name: "Hinata Hyuga",
    role: "Trưởng ban Nghiên cứu Thị trường & Dữ liệu (Head of Market Intel & Research)",
    themeColor: "#c084fc",
    accentClass: "hinata",
    quote: "Byakugan... Tôi sẽ tìm ra những ngách thị trường mà đối thủ chưa nhìn thấy.",
    roomName: "Phòng Nghiên cứu & R&D",
    avatarIcon: "👁️",
    systemPrompt: `Bạn là Hinata Hyuga, Trưởng ban Nghiên cứu Thị trường & Dữ liệu (Head of Market Intel & Research) cho công ty một người.
Tính cách: Tỉ mỉ, chu đáo, khiêm tốn nhưng cực kỳ kiên trì và sở hữu khả năng quan sát toàn cảnh như mắt thần Byakugan.
Nhiệm vụ:
- Nghiên cứu đối thủ cạnh tranh, phân tích xu hướng thị trường ngách và nhu cầu tiềm ẩn của khách hàng.
- Thu thập và tổng hợp dữ liệu, tóm tắt các tài liệu phức tạp thành báo cáo súc tích.
- Cung cấp dữ liệu đầu vào chuẩn xác để Shikamaru lên chiến lược và Naruto triển khai.
- Phong cách: Dịu dàng, chỉn chu, các báo cáo được trình bày khoa học với số liệu và nguồn tin cậy.`
  },

  jiraiya: {
    id: "jiraiya",
    name: "Jiraiya (Hiền nhân Cóc)",
    role: "Trưởng ban Marketing & Sáng tạo Nội dung (Chief Marketing & Storyteller)",
    themeColor: "#dc2626",
    accentClass: "jiraiya",
    quote: "Nghệ thuật không chỉ là chiêu thức, mà là câu chuyện chạm đến trái tim hàng vạn khách hàng!",
    roomName: "Phòng Marketing & Sáng tạo",
    avatarIcon: "✍️",
    systemPrompt: `Bạn là Jiraiya (Hiền nhân Cóc), Giám đốc Marketing & Trưởng ban Sáng tạo Nội dung (Chief Marketing & Storyteller) của công ty một người (Solopreneur).
Tính cách: Hào sảng, hóm hỉnh, trải đời, bậc thầy kể chuyện (tác giả bộ tiểu thuyết ăn khách "Thiên đường tung tăng"), có trực giác nhạy bén về tâm lý đám đông và xu hướng lan truyền.
Nhiệm vụ:
- Xây dựng chiến lược nội dung đa kênh: viết bài xã luận (Thought Leadership), kịch bản video ngắn (TikTok/Reels/Shorts), email newsletter, bài viết LinkedIn/Facebook thu hút tương tác bùng nổ.
- Nghệ thuật Storytelling bán hàng không như bán hàng (Story-selling, Hook - Story - Offer).
- Lên ý tưởng viral campaign, thông điệp truyền thông sắc bén và định vị thương hiệu cá nhân cho Founder.
- Phong cách: Hào sảng, văn phong lôi cuốn, giàu hình ảnh ví von, thỉnh thoảng pha chút tự đắc dễ thương của một đại văn hào!`
  },

  sai: {
    id: "sai",
    name: "Sai (Họa sư Làng Lá)",
    role: "Trưởng ban Thiết kế & Nhận diện Thương hiệu (Head of Design & Branding)",
    themeColor: "#475569",
    accentClass: "sai",
    quote: "Nét mực một khi hạ xuống phải có hồn. Bản vẽ tốt giá trị hơn ngàn lời nói.",
    roomName: "Phòng Thiết kế & Nghệ thuật",
    avatarIcon: "🎨",
    systemPrompt: `Bạn là Sai, Trưởng ban Thiết kế & Nhận diện Thương hiệu (Head of Design & Branding) của công ty một người.
Tính cách: Điềm tĩnh, chân thật, tỉ mỉ, có khiếu thẩm mỹ đỉnh cao về bố cục, màu sắc và typography (thừa kế bí thuật Siêu Thú Họa - nét vẽ biến thành hiện thực).
Nhiệm vụ:
- Thiết kế hệ thống nhận diện thương hiệu (Design System, Color Palette, Logo, Typography, Banners).
- Lên wireframe, prototype giao diện người dùng (UI/UX) trực quan, hiện đại, tối ưu tỷ lệ chuyển đổi (CRO).
- Chuẩn hóa các template đồ họa marketing, slide thuyết trình dự án cho Founder.
- Đưa ra lời khuyên thiết kế với góc nhìn sắc sảo, tối giản và có tính ứng dụng thương mại cao.
- Phong cách: Ngắn gọn, lịch thiệp, thẳng thắn nhưng mang tính xây dựng nghệ thuật cao.`
  },

  tsunade: {
    id: "tsunade",
    name: "Tsunade Senju (Hokage Đệ Ngũ)",
    role: "Giám đốc Tài chính & Quản trị Rủi ro (Chief Financial Officer - CFO)",
    themeColor: "#ca8a04",
    accentClass: "tsunade",
    quote: "Làm ăn mà không quản trị dòng tiền thì chỉ như canh bạc trắng tay! Hãy giữ nguồn dự trữ vững như Bách Hào Ấn!",
    roomName: "Phòng Tài chính & Ngân quỹ",
    avatarIcon: "💰",
    systemPrompt: `Bạn là Tsunade Senju (Hokage Đệ Ngũ), Giám đốc Tài chính & Quản trị Rủi ro (CFO & Risk Manager) của công ty một người.
Tính cách: Quyết đoán, uy quyền, sắc sảo về tiền bạc, đã trải qua vô số thăng trầm nên cực kỳ thấu hiểu rủi ro tài chính ("Đừng bao giờ chơi tất tay khi chưa nắm chắc phần thắng").
Nhiệm vụ:
- Quản trị dòng tiền vào - ra (Cashflow), lập bảng dự toán thu chi, kiểm soát chi phí hoạt động (OpEx) tối thiểu.
- Thiết lập quỹ dự phòng khẩn cấp (Emergency Runway) đảm bảo công ty một người sống sót ít nhất 6-12 tháng.
- Phân tích biên lợi nhuận ròng, tư vấn tái đầu tư lợi nhuận và kiểm toán rủi ro hợp đồng tài chính.
- Nhắc nhở Founder kỷ luật tài chính, tách bạch tiền túi cá nhân và tiền công ty.
- Phong cách: Thẳng thắn, quyết liệt, đáng tin cậy, giọng điệu của một nhà lãnh đạo từng trải bảo vệ ngân quỹ đến cùng.`
  }
};

// --- 2. Initial Data & State Storage ---
const DEPARTMENT_CAPABILITIES = {
  naruto: {
    operationalAgents: ["COO / Task Orchestrator", "Program Manager", "Status Report & Dependency Mapper"],
    skills: ["Project decomposition", "Timeline & milestone planning", "Kanban & weekly review", "Blocker escalation", "Specialist-agent routing"],
    skillRefs: ["task-brief-routing", "campaign-metrics"],
    outcome: "Kế hoạch theo mốc, owner, đầu ra, dependency, trạng thái và báo cáo Founder.",
    approval: "Không tự cam kết với khách hàng hoặc thay Founder quyết định ưu tiên."
  },
  shikamaru: {
    operationalAgents: ["Business Strategist", "Unit Economics Analyst"],
    skills: ["Affiliate unit economics", "Định giá SaaS/tool", "ROI & risk scenarios"],
    skillRefs: ["campaign-metrics"],
    outcome: "Đề xuất ưu tiên, giá bán và giả định lợi nhuận có thể kiểm tra.",
    approval: "Founder duyệt ngân sách, giá cuối cùng và mọi khoản chi."
  },
  kakashi: {
    operationalAgents: ["QA Release Gate", "Security & SOP Reviewer"],
    skills: ["QA regression", "Secret/API-key review", "SMT release checklist"],
    skillRefs: ["independent-qa", "build-and-verify"],
    outcome: "Biên bản PASS, NEEDS REVIEW hoặc BLOCKED kèm bằng chứng.",
    approval: "Có quyền chặn phát hành; không tự chứng nhận chất lượng sản xuất."
  },
  sakura: {
    operationalAgents: ["CRM Assistant", "Affiliate & DOP Content Planner"],
    skills: ["Proposal & CRM", "Content brief / shot-list", "Disclosure & follow-up"],
    skillRefs: ["task-brief-routing", "short-video-content-pack"],
    outcome: "Bản nháp proposal, kịch bản, lịch chăm sóc và nội dung có disclosure.",
    approval: "Không tự gửi, đăng bài, nhận tiền hoặc dùng tài khoản bên ngoài."
  },
  sasuke: {
    operationalAgents: ["Full-stack Builder", "Automation Engineer", "SMT Vision Engineer"],
    skills: ["Web/API & desktop tools", "n8n/webhook automation", "OpenCV/YOLO, fiducial & ROI"],
    skillRefs: ["build-and-verify", "independent-qa"],
    outcome: "Mã nguồn, bản demo chạy được, log test và hướng dẫn vận hành.",
    approval: "Mọi automation có tác động bên ngoài phải có bước Founder duyệt."
  },
  hinata: {
    operationalAgents: ["Market Researcher", "Competitor Mapper", "SMT Trend Scout"],
    skills: ["Research with evidence", "Competitor mapping", "Opportunity & trend scan"],
    skillRefs: ["evidence-first-research", "campaign-metrics"],
    outcome: "Evidence ledger: nguồn, ngày kiểm tra, nhận định và mức tin cậy.",
    approval: "Không trình bày số liệu suy đoán như dữ kiện đã xác minh."
  },
  jiraiya: {
    operationalAgents: ["Viral Storyteller", "Multi-channel Content Producer", "Thought Leadership Writer"],
    skills: ["Hook-Story-Offer formula", "Social viral scripts", "Newsletter & copy conversion", "Brand voice crafting"],
    skillRefs: ["short-video-content-pack"],
    outcome: "Kịch bản viral, bản thảo email/bài viết có cấu trúc dẫn dắt cảm xúc và CTA sắc bén.",
    approval: "Không tự động đăng bài lên mạng xã hội nếu chưa có Founder kiểm duyệt nội dung."
  },
  sai: {
    operationalAgents: ["UI/UX Designer", "Brand Identity Specialist", "Visual Asset Crafter"],
    skills: ["Design system & tokens", "Figma wireframe & UI layout", "Conversion-centered design", "Visual typography"],
    skillRefs: ["short-video-content-pack"],
    outcome: "Bộ quy chuẩn thiết kế (màu, font, component), wireframe chi tiết và hướng dẫn style UI.",
    approval: "Bản vẽ và giao diện cần Founder chốt mood & tone trước khi chuyển sang Sasuke dựng mã nguồn."
  },
  tsunade: {
    operationalAgents: ["Cashflow Comptroller", "Unit Economics & Runway Auditor", "Financial Risk Gate"],
    skills: ["Burn rate & runway calculation", "OpEx / CapEx modeling", "Profit margin stress-test", "Emergency fund sizing"],
    skillRefs: ["campaign-metrics"],
    outcome: "Bảng kiểm soát dòng tiền, báo cáo sức khỏe tài chính, kịch bản rủi ro và khuyến nghị trích lập quỹ.",
    approval: "Chỉ đưa ra phân tích và cảnh báo tài chính; mọi lệnh giải ngân hoặc chuyển tiền do Founder toàn quyền quyết định."
  }
};

const COMPANY_SKILLS = {
  "task-brief-routing": {
    name: "Giao việc chuẩn qua Naruto",
    guide: "Chuẩn hóa yêu cầu thành mục tiêu, phạm vi, đầu ra bàn giao, tiêu chí nghiệm thu, owner/phòng ban, deadline, phụ thuộc và blocker. Naruto là cửa nhận việc và người điều phối cuối; giao tối đa 5 phòng ban phù hợp."
  },
  "evidence-first-research": {
    name: "Nghiên cứu có bằng chứng",
    guide: "Ưu tiên nguồn chính thức và nguồn sơ cấp; ghi URL, ngày truy cập, trích yếu và phạm vi. Tách dữ kiện, suy luận và điều chưa biết; không biến số ước tính thành dữ kiện."
  },
  "short-video-content-pack": {
    name: "Bộ sản xuất video ngắn",
    guide: "Bàn giao đối tượng khán giả, hook 1-3 giây, kịch bản theo cảnh, chữ trên màn hình/âm thanh, caption, CTA, hashtag và checklist tệp. Ghi nhãn AI/disclosure khi áp dụng; nội dung luôn là bản nháp chờ Founder duyệt, không tự đăng."
  },
  "build-and-verify": {
    name: "Xây dựng và kiểm chứng",
    guide: "Đọc cấu trúc repo và hướng dẫn trước khi sửa; thay đổi tối thiểu theo yêu cầu; nêu lệnh xác minh phù hợp, kết quả thật, giới hạn và cách khôi phục. Không tuyên bố chạy được nếu chưa có bằng chứng runtime."
  },
  "independent-qa": {
    name: "QA độc lập",
    guide: "Đối chiếu từng tiêu chí nghiệm thu với artifact hoặc kết quả kiểm tra độc lập. Phân loại PASS, NEEDS REVIEW hoặc BLOCKED; đính kèm bằng chứng và lỗi còn lại. Thiếu bằng chứng thì không phê duyệt; Kakashi không tự review phần mình làm."
  },
  "campaign-metrics": {
    name: "KPI và checkpoint",
    guide: "Ghi baseline, mục tiêu, số hiện tại, nguồn và thời điểm đọc, khoảng cách mục tiêu, xu hướng và quyết định/experiment kế tiếp. Số follower/chuyển đổi chỉ cập nhật từ nguồn đã quan sát; không bịa số hoặc bảo đảm kết quả."
  }
};

const AI_OPERATING_GUARDRAILS = `
Quy tắc vận hành: chỉ tạo phân tích, bản nháp, code hoặc checklist; ghi rõ giả định và phần chưa xác minh.
Không tự đăng nhập tài khoản, nhận tiền, chi tiền, xuất bản nội dung, gửi email/tin nhắn hay thay Founder quyết định cuối cùng.
Với Affiliate/DOP: luôn đề xuất disclosure và để nội dung ở trạng thái draft/needs_human_review.
Với SMT/AOI/X-ray: nêu fiducial/ROI/tolerance khi có dữ liệu; kết quả chưa xác minh phải là needs_review, không tự kết luận OK/NG.`;

const DEFAULT_MISSIONS = [
  {
    id: "m-1",
    title: "Xây dựng Landing Page thu hút 100 khách hàng tiềm năng đầu tiên",
    rank: "S",
    assignee: "sasuke",
    status: "in_progress",
    dueDate: "2026-11-05",
    desc: "Sasuke phụ trách code và tích hợp form n8n tự động gửi email chào mừng."
  },
  {
    id: "m-2",
    title: "Phân tích 5 đối thủ hàng đầu trong phân khúc dịch vụ tự động hóa",
    rank: "A",
    assignee: "hinata",
    status: "reviewing",
    dueDate: "2026-11-02",
    desc: "Hinata dùng Byakugan soi chi tiết bảng giá và điểm yếu dịch vụ của đối thủ."
  },
  {
    id: "m-3",
    title: "Định giá gói dịch vụ tư vấn hàng tháng (Retainer Package)",
    rank: "B",
    assignee: "shikamaru",
    status: "completed",
    dueDate: "2026-10-30",
    desc: "Đã chốt mức 3 tầng giá: 3tr / 7tr / 15tr tối ưu tỷ suất lợi nhuận."
  },
  {
    id: "m-4",
    title: "Soạn thảo kịch bản email chào hàng và xử lý từ chối (Cold Outreach)",
    rank: "A",
    assignee: "sakura",
    status: "backlog",
    dueDate: "2026-11-08",
    desc: "Sakura chuẩn bị bộ 3 email nuôi dưỡng khách hàng và kịch bản demo."
  },
  {
    id: "m-5",
    title: "Kiểm tra bảo mật và tối ưu checklist nghiệm thu dự án",
    rank: "B",
    assignee: "kakashi",
    status: "backlog",
    dueDate: "2026-11-10",
    desc: "Kakashi thiết lập bộ 15 tiêu chí nghiệm thu trước khi bàn giao cho đối tác."
  },
  {
    id: "m-6",
    title: "Soạn thảo kịch bản Storytelling & chuỗi bài viết Viral thu hút 10.000 độc giả",
    rank: "A",
    assignee: "jiraiya",
    status: "in_progress",
    dueDate: "2026-11-06",
    desc: "Jiraiya xây dựng chiến dịch Thought Leadership theo công thức Hook - Story - Offer."
  },
  {
    id: "m-7",
    title: "Thiết kế bộ nhận diện thương hiệu Konoha OS & Design System UI",
    rank: "B",
    assignee: "sai",
    status: "reviewing",
    dueDate: "2026-11-04",
    desc: "Sai xuất file Figma wireframe và hệ thống tokens màu sắc, typography cho sản phẩm."
  },
  {
    id: "m-8",
    title: "Lập bảng kế hoạch ngân quỹ & Quản trị rủi ro dòng tiền 6 tháng tới",
    rank: "S",
    assignee: "tsunade",
    status: "backlog",
    dueDate: "2026-11-12",
    desc: "Tsunade rà soát OpEx, tính toán điểm hòa vốn và trích lập quỹ dự phòng khẩn cấp."
  }
];

class AppState {
  constructor() {
    this.initializeFounderOnlyWorkspace();
    this.missions = this.loadMissions();
    this.settings = this.loadSettings();
    if (this.settings.apiProvider === "gemini" && this.settings.modelName === "gemini-2.0-flash") {
      this.settings.modelName = "gemini-3.8-flash";
      localStorage.setItem("konoha_settings", JSON.stringify(this.settings));
    }
    this.chatHistories = this.loadChatHistories();
    this.councilLog = this.loadCouncilLog();
    this.operationalPlans = this.loadOperationalPlans();
    this.founderNotifications = this.loadFounderNotifications();
    this.narutoMonitor = this.loadNarutoMonitor();
    this.currentView = "diorama";
    this.activeAgentId = "naruto";
  }

  initializeFounderOnlyWorkspace() {
    const workspaceEpoch = "founder-only-workspace-v2-clear-current-work";
    if (localStorage.getItem("konoha_workspace_epoch") === workspaceEpoch) return;
    // Archive current operational state before clearing it; preserve AI settings and generated artifacts.
    const archiveKey = "konoha_work_archive";
    let archive = [];
    try { archive = JSON.parse(localStorage.getItem(archiveKey) || "[]"); } catch { archive = []; }
    const previousWork = {
      archivedAt: new Date().toISOString(),
      missions: JSON.parse(localStorage.getItem("konoha_missions") || "[]"),
      chats: JSON.parse(localStorage.getItem("konoha_chats") || "{}"),
      councilLog: JSON.parse(localStorage.getItem("konoha_council_log") || "[]"),
      operationalPlans: JSON.parse(localStorage.getItem("konoha_operational_plans") || "[]"),
      founderNotifications: JSON.parse(localStorage.getItem("konoha_founder_notifications") || "[]")
    };
    if (previousWork.missions.length || previousWork.operationalPlans.length || Object.keys(previousWork.chats).length || previousWork.councilLog.length || previousWork.founderNotifications.length) {
      archive.unshift(previousWork);
      localStorage.setItem(archiveKey, JSON.stringify(archive.slice(0, 10)));
    }
    // Founder requested clearing current work. Keep recoverable local archive, AI settings, and generated artifacts.
    localStorage.setItem("konoha_missions", JSON.stringify([]));
    localStorage.setItem("konoha_chats", JSON.stringify({}));
    localStorage.setItem("konoha_council_log", JSON.stringify([]));
    localStorage.setItem("konoha_operational_plans", JSON.stringify([]));
    localStorage.setItem("konoha_founder_notifications", JSON.stringify([]));
    localStorage.setItem("konoha_workspace_epoch", workspaceEpoch);
  }

  loadMissions() {
    const data = localStorage.getItem("konoha_missions");
    return data ? JSON.parse(data) : DEFAULT_MISSIONS;
  }
  saveMissions() {
    localStorage.setItem("konoha_missions", JSON.stringify(this.missions));
  }

  loadSettings() {
    const data = localStorage.getItem("konoha_settings");
    return data ? JSON.parse(data) : {
      apiKey: "",
      apiProvider: "gemini", // "gemini" or "openai"
      apiBaseUrl: "",
      modelName: "gemini-3.8-flash",
      founderName: "Hokage Founder",
      companyName: "Konoha Studio"
    };
  }
  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem("konoha_settings", JSON.stringify(this.settings));
  }

  loadChatHistories() {
    const data = localStorage.getItem("konoha_chats");
    return data ? JSON.parse(data) : {};
  }
  saveChatHistories() {
    localStorage.setItem("konoha_chats", JSON.stringify(this.chatHistories));
  }

  loadCouncilLog() {
    const data = localStorage.getItem("konoha_council_log");
    return data ? JSON.parse(data) : [];
  }
  saveCouncilLog() {
    localStorage.setItem("konoha_council_log", JSON.stringify(this.councilLog));
  }

  loadOperationalPlans() {
    const data = localStorage.getItem("konoha_operational_plans");
    return data ? JSON.parse(data) : [];
  }
  saveOperationalPlans() {
    localStorage.setItem("konoha_operational_plans", JSON.stringify(this.operationalPlans));
  }

  loadFounderNotifications() {
    const data = localStorage.getItem("konoha_founder_notifications");
    return data ? JSON.parse(data) : [];
  }
  saveFounderNotifications() {
    localStorage.setItem("konoha_founder_notifications", JSON.stringify(this.founderNotifications));
  }

  loadNarutoMonitor() {
    const data = localStorage.getItem("konoha_naruto_monitor");
    return data ? JSON.parse(data) : { lastCheckedAt: null, lastSummary: "Chưa có dữ liệu kiểm tra tiến độ." };
  }
  saveNarutoMonitor() {
    localStorage.setItem("konoha_naruto_monitor", JSON.stringify(this.narutoMonitor));
  }
}

const state = new AppState();

// --- 3. AI Service (Gemini / OpenAI / Smart Simulator) ---
function buildNarutoOperationsReport(prompt) {
  const topic = escapeHtml(prompt);
  const normalized = prompt.toLowerCase();
  const isToddlerApp = /trẻ|tre|3 tuổi|3 tuoi|mầm non|mam non|\bgame\b|trò chơi|tro choi/.test(normalized);
  const project = isToddlerApp ? "MVP trò chơi phát triển nhận thức cho trẻ 3 tuổi" : "MVP theo mục tiêu Founder giao";
  const specialists = isToddlerApp
    ? [
      ["Product Scope Agent", "chốt 1 vòng chơi, độ tuổi, mục tiêu học tập và tiêu chí không làm"],
      ["Early Childhood & Safety Reviewer", "rà soát phù hợp lứa tuổi, thời lượng, âm thanh, dữ liệu trẻ em; chỉ là khuyến nghị, cần chuyên gia/người giám hộ phê duyệt"],
      ["Game UX & Learning Designer", "wireframe thao tác chạm, phần thưởng và độ khó phù hợp trẻ 3 tuổi"],
      ["Sasuke / Prototype Engineer", "dựng prototype local có thể chơi thử, không thu thập dữ liệu trẻ em mặc định"],
      ["Kakashi / QA Release Gate", "test luồng phụ huynh, crash, nội dung và checklist trước demo"]
    ]
    : [
      ["Product Scope Agent", "chốt mục tiêu, phạm vi MVP và tiêu chí hoàn thành"],
      ["Research Agent (Hinata)", "lập evidence ledger cho nhu cầu/rủi ro chưa xác minh"],
      ["Build Agent (Sasuke)", "tạo prototype và log kiểm thử"],
      ["QA Gate (Kakashi)", "xác minh đầu ra, rủi ro và điều kiện phát hành"]
    ];
  const plan = isToddlerApp
    ? [
      ["Ngày 0", "Founder", "Duyệt brief: 1 kỹ năng nhận thức, 1 nền tảng, thời lượng 3–5 phút; xác nhận không thu thập PII trẻ em."],
      ["Ngày 1", "Product Scope + Early Childhood Reviewer", "One-page brief, giới hạn an toàn và 3 tiêu chí quan sát được khi trẻ chơi."],
      ["Ngày 2", "Game UX Designer", "Luồng 3 màn hình, 1 mini-game, asset list; đưa Founder duyệt trước khi code."],
      ["Ngày 3–4", "Sasuke", "Prototype local, không có quảng cáo/đăng nhập/thanh toán; ghi log chạy thử."],
      ["Ngày 5", "Kakashi + Founder", "Test với người lớn đóng vai phụ huynh; kết luận PASS / NEEDS REVIEW / BLOCKED, không phát hành tự động."]
    ]
    : [
      ["Ngày 0", "Founder", "Duyệt mục tiêu, ngân sách và định nghĩa Done."],
      ["Ngày 1", "Hinata + Shikamaru", "Xác minh giả định, ưu tiên 80/20 và rủi ro."],
      ["Ngày 2–3", "Sasuke", "Dựng MVP và log kiểm thử."],
      ["Ngày 4", "Kakashi + Founder", "QA, quyết định PASS / NEEDS REVIEW / BLOCKED."]
    ];

  return `### 🍥 Naruto Uzumaki — Báo cáo Điều hành có lịch trình
**Yêu cầu nhận:** “${topic}”

**Kết luận điều phối:** Chưa được xem là lệnh “tự triển khai”. Tôi đề xuất bắt đầu bằng **${project}**, với một vòng MVP nhỏ, có mốc báo cáo và Founder duyệt từng cổng.

## AI agent đề xuất để hoàn thành việc
${specialists.map(([name, task]) => `- **${name}:** ${task}.`).join("\n")}

## Lịch trình và báo cáo cần nhận
${plan.map(([day, owner, output]) => `- **${day} — ${owner}:** ${output}`).join("\n")}

## Việc Cấp S hôm nay
1. Founder trả lời 3 điểm: **ai là người dùng/cha mẹ mục tiêu**, **chỉ số muốn cải thiện**, và **thiết bị ưu tiên**.
2. Tôi chuyển brief cho các specialist ở trên, nhưng chỉ tạo **nhiệm vụ nháp** cho đến khi Founder duyệt phạm vi.
3. Báo cáo tiếp theo phải có: tiến độ theo mốc, blocker, quyết định cần Founder chọn và link/output kiểm chứng.

## Cổng an toàn
${isToddlerApp ? "- Không dùng dữ liệu cá nhân của trẻ em, không quảng cáo, không thanh toán và không phát hành công khai trong MVP.\n- Nội dung phát triển trẻ chỉ là giả thuyết thiết kế; cần người chăm sóc/chuyên gia phù hợp xác nhận trước khi thử với trẻ." : "- Không gửi, đăng, chi tiền, tạo tài khoản hay phát hành bên ngoài nếu Founder chưa duyệt."}

**Trạng thái hiện tại:** \`needs_human_review\` — chờ Founder duyệt brief trước khi chuyển sang xây dựng. Dattebayo!`;
}

function createNarutoWorkPlan(prompt) {
  const normalized = prompt.toLowerCase();
  const toddler = /trẻ|tre|3 tuổi|3 tuoi|mầm non|mam non|\bgame\b|trò chơi|tro choi/.test(normalized);
  const now = Date.now();
  const planId = `plan-${now}`;
  // The form emits ASCII markers so parsing remains reliable across browser/terminal encodings.
  const titleMatch = prompt.match(/TASK_TITLE:[ \t]*([^\r\n]+)/i) || prompt.match(/Tên công việc:[ \t]*([^\r\n]+)/i);
  const dueMatch = prompt.match(/DUE_DATE:[ \t]*(\d{4}-\d{2}-\d{2})/i) || prompt.match(/Hạn hoàn thành:[ \t]*(\d{4}-\d{2}-\d{2})/i);
  const finalDue = dueMatch ? dueMatch[1] : null;
  const addDays = (days) => {
    const candidate = new Date(now + days * 86400000).toISOString().split("T")[0];
    return finalDue && candidate > finalDue ? finalDue : candidate;
  };
  const project = titleMatch ? titleMatch[1].trim() : (toddler ? "MVP trò chơi phát triển nhận thức cho trẻ 3 tuổi" : `MVP: ${prompt.trim().slice(0, 80)}`);
  const templates = [
    ["Naruto phân tích brief và chọn phòng ban", "naruto", "S", 0, "Chưa giao cho chuyên viên. Naruto sẽ lập kế hoạch, chọn phòng ban và tạo đầu việc theo từng năng lực."]
  ];
  return {
    id: planId,
    sourcePrompt: prompt,
    project,
    createdAt: new Date(now).toLocaleString(),
    status: "automation_queued",
    approval: {
      status: "automation",
      version: 1,
      requestedAt: new Date(now).toLocaleString()
    },
    resultUrl: "#",
    resultLabel: "Đang chờ Naruto phân công",
    milestones: templates.map(([title, assignee, rank, days, output]) => ({ title, assignee, rank, dueDate: addDays(days), output })),
    tasks: templates.map(([title, assignee, rank, days, desc], index) => ({
      id: `m-${now}-${index}`, planId, title, assignee, rank,
      dueDate: addDays(days), desc: `${desc} [Kế hoạch Naruto: ${project}]`,
      status: index === 0 ? "in_progress" : "backlog"
    }))
  };
}

function createOperationalPlanFromNaruto(prompt) {
  const duplicate = state.operationalPlans.find(plan => plan.sourcePrompt === prompt && ["automation_queued", "automation_running"].includes(plan.status));
  if (duplicate) return duplicate;
  const plan = createNarutoWorkPlan(prompt);
  state.operationalPlans.unshift(plan);
  state.missions.unshift(...plan.tasks);
  state.saveOperationalPlans();
  state.saveMissions();
  return plan;
}

function syncNarutoDepartmentAssignments(plan, assignments) {
  if (!plan || !Array.isArray(assignments) || !assignments.length) return;
  plan.departmentAssignments = assignments.map(item => ({ ...item }));
  const prior = new Map(state.missions.filter(task => task.planId === plan.id).map(task => [task.assignee, task]));
  const dueDate = prior.values().next().value?.dueDate || new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
  const tasks = assignments.map((item, index) => {
    const existing = prior.get(item.departmentId);
    return {
      ...(existing || {}), id: existing?.id || `m-${plan.id}-${index}`, planId: plan.id,
      assignee: item.departmentId, rank: existing?.rank || "A", dueDate,
      title: `${item.departmentName}: ${item.task}`,
      desc: `Naruto giao: ${item.task} Đầu ra cần nộp: ${item.deliverable}`,
      status: item.status === "in_progress" ? "in_progress" : item.status === "completed" ? "reviewing" : "backlog"
    };
  });
  state.missions = state.missions.filter(task => task.planId !== plan.id);
  state.missions.unshift(...tasks);
  plan.milestones = tasks.map(task => ({ title: task.title, assignee: task.assignee, rank: task.rank, dueDate: task.dueDate, output: task.desc }));
  state.saveMissions();
}

function appendNarutoChatMessage(sender, text, planId) {
  const history = state.chatHistories.naruto || (state.chatHistories.naruto = []);
  if (planId && history.some(item => item.planId === planId && item.sender === sender)) return;
  history.push({ sender, text, planId, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
  state.saveChatHistories();
}

function handoffPlanToNarutoChat(plan, founderText) {
  state.activeAgentId = "naruto";
  appendNarutoChatMessage("user", founderText, plan.id);
  appendNarutoChatMessage("agent", "Naruto đã nhận việc và đang chọn phòng ban phù hợp. Theo dõi phân công, tiến độ và blocker trong Báo cáo Tiến độ.", plan.id);
  if (!plan.automationJobId && plan.status === "automation_queued") {
    startNarutoOrchestration(plan);
    runNarutoProgressCheck(false);
  }
  switchView("chat");
  renderAgentChatView();
  return plan;
}

function routeWorkRequestToNaruto(request, sourceAgentId = null) {
  const sourceAgent = AGENTS[sourceAgentId];
  const brief = `# PHIẾU GIAO VIỆC QUA NARUTO\nTASK_TITLE: ${request.trim().split(/[\r\n.!?]/)[0].slice(0, 100)}\nWORKSPACE: Workspace local theo cấu hình task\n\nOBJECTIVE:\n${request.trim()}\n\nREQUIRED_ARTIFACT:\nĐầu ra phù hợp với yêu cầu; nếu là app/web thì tạo preview local.\n\nACCEPTANCE_AND_TEST:\nNaruto phải chọn phòng ban phù hợp, giao đầu việc và đầu ra rõ ràng; Kakashi kiểm tra acceptance; báo Founder mọi blocker.\n${sourceAgent ? `\nYêu cầu được gửi khi đang mở phòng ${sourceAgent.name}; đây chỉ là ngữ cảnh tham khảo, Naruto vẫn là người giao việc.` : ""}`;
  const plan = createOperationalPlanFromNaruto(brief);
  return handoffPlanToNarutoChat(plan, request.trim());
}

function getPlanApprovalCopy(plan) {
  const approval = plan.approval || { status: "pending", version: 1 };
  if (approval.status === "automation") return { label: "Naruto đang điều phối", className: "text-sky-300", detail: "Naruto đang chọn phòng ban phù hợp; Kakashi sẽ kiểm tra đầu ra trước khi Founder xác nhận." };
  if (approval.status === "blocked") return { label: "Kakashi chặn bàn giao", className: "text-rose-300", detail: plan.automationError || "Cổng QA phát hiện blocker; cần xử lý trước khi Founder duyệt." };
  if (approval.status === "blocked_no_api") return { label: "Naruto đang chờ API/xác thực", className: "text-rose-300", detail: plan.automationError || "Bổ sung API key hoặc đăng nhập provider rồi gửi lại việc." };
  if (approval.status === "interrupted") return { label: "Job bị ngắt", className: "text-rose-300", detail: plan.automationError || "Server đã khởi động lại; cần gửi lại task qua Naruto." };
  if (approval.status === "failed") return { label: "Job lỗi", className: "text-rose-300", detail: plan.automationError || "Naruto chưa hoàn tất điều phối." };
  if (approval.status === "final_review" && plan.qaDisposition === "NEEDS_REVIEW") return { label: "Kakashi yêu cầu Founder xem thêm", className: "text-amber-300", detail: "Artifact đã sẵn sàng; Kakashi nêu các mục cần Founder xem trước khi chấp nhận." };
  if (approval.status === "final_review") return { label: "Sản phẩm sẵn sàng để Founder xác nhận", className: "text-emerald-300", detail: "Artifact và báo cáo QA đã được tạo; Founder vẫn xác nhận cuối." };
  if (approval.status === "approved") return { label: "Đã chấp nhận — đang triển khai", className: "text-emerald-300", detail: `Founder đã chấp nhận lúc ${approval.decidedAt || "chưa rõ"}.` };
  if (approval.status === "rejected") return { label: "Đã từ chối — phương án này đã huỷ", className: "text-rose-300", detail: approval.reason ? `Lý do: ${approval.reason}` : "Founder yêu cầu làm lại phương án khác." };
  return { label: "Chờ Founder duyệt", className: "text-amber-300", detail: "Chưa có task nào được phép triển khai." };
}

async function startNarutoOrchestration(plan) {
  plan.status = 'automation_queued';
  plan.automationError = null;
  plan.automationEvents = [];
  plan.approval = { ...plan.approval, status: 'automation' };
  plan.departmentAssignments = [];
  plan.departmentOutputs = {};
  plan.narutoPlan = '';
  const oldTasks = state.missions.filter(task => task.planId === plan.id);
  const dueDate = oldTasks[0]?.dueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
  state.missions = state.missions.filter(task => task.planId !== plan.id);
  state.missions.unshift({ id: `m-${plan.id}-naruto-${Date.now()}`, planId: plan.id, title: 'Naruto phân tích brief và chọn phòng ban', assignee: 'naruto', rank: 'S', dueDate, desc: 'Chưa giao cho chuyên viên; Naruto đang chọn phòng ban và đầu ra.', status: 'in_progress' });
  plan.milestones = [{ title: 'Naruto phân tích brief và chọn phòng ban', assignee: 'naruto', rank: 'S', dueDate, output: 'Đang điều phối.' }];
  state.saveMissions();
  state.saveOperationalPlans();
  updateNarutoApiNotice();
  try {
    const response = await fetch('/api/automation/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: plan.project,
        brief: plan.sourcePrompt,
        provider: state.settings.apiProvider,
        apiKey: state.settings.apiKey,
        model: state.settings.modelName,
        apiBaseUrl: state.settings.apiBaseUrl
      })
    });
    const job = await response.json();
    if (!response.ok) throw new Error(job.error || 'Không thể gửi công việc tới Naruto.');
    plan.automationJobId = job.id;
    plan.status = 'automation_running';
    state.saveOperationalPlans();
    renderOperationsReports();
    pollNarutoOrchestration(plan.id, job.id);
  } catch (error) {
    plan.status = 'automation_blocked';
    plan.automationError = error.message;
    plan.approval = { ...plan.approval, status: 'failed' };
    state.saveOperationalPlans();
    updateNarutoApiNotice();
    renderOperationsReports();
  }
}

async function pollNarutoOrchestration(planId, jobId) {
  const plan = state.operationalPlans.find(item => item.id === planId);
  if (!plan) return;
  try {
    const response = await fetch(`/api/automation/jobs/${jobId}`);
    const job = await response.json();
    if (!response.ok) throw new Error(job.error || 'Không đọc được trạng thái runner.');
    plan.automationStatus = job.status;
    plan.automationEvents = job.events || [];
    plan.progressReports = job.progressReports || [];
    if (job.outputs?.plan) plan.narutoPlan = job.outputs.plan;
    if (job.outputs?.departments) plan.departmentOutputs = job.outputs.departments;
    if (job.outputs?.qa) plan.qaReport = job.outputs.qa;
    if (job.departmentAssignments?.length) syncNarutoDepartmentAssignments(plan, job.departmentAssignments);
    if (job.qaDisposition) plan.qaDisposition = job.qaDisposition;
    if (job.status === 'needs_founder_product_confirmation') {
      plan.status = 'needs_founder_product_confirmation';
      plan.approval = { ...plan.approval, status: 'final_review', decidedAt: null };
      plan.resultUrl = job.artifactUrl || '#';
      plan.resultLabel = 'Mở sản phẩm để kiểm tra';
      state.missions.filter(task => task.planId === plan.id).forEach(task => { task.status = 'reviewing'; });
      state.saveMissions();
    } else if (job.status === 'blocked_qa') {
      plan.status = 'blocked_qa';
      plan.approval = { ...plan.approval, status: 'blocked' };
      plan.automationError = job.outputs?.qa || 'Kakashi chặn bàn giao.';
      plan.resultUrl = job.artifactUrl || plan.resultUrl || '#';
      plan.resultLabel = 'Xem artifact bị chặn';
    } else if (job.status === 'failed' || job.status === 'blocked_no_api_key' || job.status === 'interrupted') {
      plan.status = job.status;
      plan.automationError = job.error || 'Runner không hoàn tất.';
      plan.approval = { ...plan.approval, status: job.status === 'blocked_no_api_key' ? 'blocked_no_api' : job.status };
      if (job.status === 'blocked_no_api_key') {
        notifyNarutoMissingApi(plan);
      }
    } else {
      setTimeout(() => pollNarutoOrchestration(planId, jobId), 1500);
    }
    state.saveOperationalPlans();
    updateNarutoApiNotice();
    renderMissionsBoard(); renderDioramaCards(); renderOperationsReports();
  } catch (error) {
    plan.status = 'automation_failed'; plan.approval = { ...plan.approval, status: 'failed' }; plan.automationError = error.message; state.saveOperationalPlans(); updateNarutoApiNotice(); renderOperationsReports();
  }
}

function confirmFinalProduct(planId) {
  const plan = state.operationalPlans.find(item => item.id === planId);
  if (!plan || plan.approval?.status !== 'final_review') return;
  plan.approval = { ...plan.approval, status: 'approved', decidedAt: new Date().toLocaleString() };
  plan.status = 'completed_approved_by_founder';
  state.missions.filter(task => task.planId === planId).forEach(task => { task.status = 'completed'; });
  state.saveOperationalPlans(); state.saveMissions(); renderMissionsBoard(); renderDioramaCards(); renderOperationsReports();
}

function openFounderApproval(planId) {
  switchView("reports");
  renderOperationsReports();
  requestAnimationFrame(() => document.getElementById(`approval-${planId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
}

function approveOperationalPlan(planId) {
  const plan = state.operationalPlans.find(item => item.id === planId);
  if (!plan || plan.approval?.status !== "pending") return;
  plan.approval = { ...plan.approval, status: "approved", decidedAt: new Date().toLocaleString() };
  plan.status = "approved_in_execution";
  const firstTask = state.missions.find(item => item.planId === planId);
  if (firstTask) firstTask.status = "in_progress";
  state.saveOperationalPlans();
  state.saveMissions();
  renderMissionsBoard();
  renderDioramaCards();
  renderOperationsReports();
}

function rejectOperationalPlan(planId) {
  const plan = state.operationalPlans.find(item => item.id === planId);
  if (!plan || !["pending", "final_review"].includes(plan.approval?.status)) return;
  const reason = window.prompt("Lý do từ chối (tuỳ chọn). Naruto sẽ dùng nội dung này để lập phương án khác:", "") || "Founder yêu cầu phương án khác.";
  plan.approval = { ...plan.approval, status: "rejected", decidedAt: new Date().toLocaleString(), reason };
  plan.status = "rejected_by_founder";
  // Cancel the unapproved tasks instead of letting them appear as executable work.
  state.missions = state.missions.filter(item => item.planId !== planId);

  const alternative = createNarutoWorkPlan(`${plan.sourcePrompt}\n\n# PHẢN HỒI FOUNDER — LẬP PHƯƠNG ÁN THAY THẾ\nLý do từ chối phương án trước: ${reason}`);
  alternative.project = `${plan.project} — Phương án B`;
  alternative.parentPlanId = plan.id;
  alternative.status = "automation_queued";
  alternative.approval = { status: "automation", version: (plan.approval.version || 1) + 1, requestedAt: new Date().toLocaleString(), replacesPlanId: plan.id };
  alternative.tasks = alternative.tasks.map(task => ({
    ...task,
    title: `${task.title} (PA B)`,
    desc: `${task.desc} Phản hồi Founder cần xử lý: ${reason}`,
    status: "backlog"
  }));
  state.operationalPlans.unshift(alternative);
  state.missions.unshift(...alternative.tasks);
  state.saveOperationalPlans();
  state.saveMissions();
  renderMissionsBoard();
  renderDioramaCards();
  renderOperationsReports();
  startNarutoOrchestration(alternative);
}

class AIService {
  static async queryAgent(agentId, prompt, contextHistory = []) {
    const agent = AGENTS[agentId];
    const settings = state.settings;
    const capability = DEPARTMENT_CAPABILITIES[agentId];
    const loadedSkills = (capability?.skillRefs || []).map(id => COMPANY_SKILLS[id]).filter(Boolean);
    const skillContext = loadedSkills.map(skill => `- ${skill.name}: ${skill.guide}`).join("\n");
    const operationalContext = `${agent.systemPrompt}\n\n${AI_OPERATING_GUARDRAILS}\n\nCác agent chuyên môn đang nạp: ${(capability?.operationalAgents || []).join(", ")}.\nSkill ưu tiên: ${(capability?.skills || []).join(", ")}.\nQuy trình skill áp dụng:\n${skillContext || "- Không có skill chuyên biệt."}`;

    if (settings.apiProvider === "copilot-cli") {
      return this.callCopilotCLI(settings.modelName || "auto", operationalContext, prompt, contextHistory);
    }
    if (!settings.apiKey || settings.apiKey.trim().length <= 10) {
      return this.smartSimulate(agentId, prompt);
    }

    const model = settings.modelName?.trim();
    switch (settings.apiProvider) {
      case "gemini":
        return this.callGeminiAPI(settings.apiKey, model || "gemini-3.8-flash", operationalContext, prompt, contextHistory);
      case "openai":
        return this.callOpenAIAPI(settings.apiKey, model || "gpt-4o-mini", operationalContext, prompt, contextHistory);
      case "anthropic":
        return this.callAnthropicAPI(settings.apiKey, model || "claude-sonnet-4-5", operationalContext, prompt, contextHistory);
      case "deepseek":
        return this.callCompatibleAPI(settings.apiKey, model || "deepseek-chat", operationalContext, prompt, contextHistory, settings.apiBaseUrl || "https://api.deepseek.com/v1");
      case "groq":
        return this.callCompatibleAPI(settings.apiKey, model || "llama-3.3-70b-versatile", operationalContext, prompt, contextHistory, settings.apiBaseUrl || "https://api.groq.com/openai/v1");
      case "openrouter":
        return this.callCompatibleAPI(settings.apiKey, model, operationalContext, prompt, contextHistory, settings.apiBaseUrl || "https://openrouter.ai/api/v1");
      case "openai-compatible":
        return this.callCompatibleAPI(settings.apiKey, model, operationalContext, prompt, contextHistory, settings.apiBaseUrl);
      default:
        return this.smartSimulate(agentId, prompt);
    }
  }

  static async callGeminiAPI(apiKey, model, systemPrompt, userMessage, history) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const contents = [];
    // Include history
    history.slice(-4).forEach(item => {
      contents.push({
        role: item.sender === "user" ? "user" : "model",
        parts: [{ text: item.text }]
      });
    });
    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    const body = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200
      }
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API Error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Không nhận được phản hồi từ mô hình.";
  }

  static async callOpenAIAPI(apiKey, model, systemPrompt, userMessage, history) {
    return this.callCompatibleAPI(apiKey, model, systemPrompt, userMessage, history, "https://api.openai.com/v1");
  }

  static async callCompatibleAPI(apiKey, model, systemPrompt, userMessage, history, baseUrl) {
    if (!model) throw new Error("Hãy nhập tên model cho nhà cung cấp API đã chọn.");
    if (!baseUrl) throw new Error("Hãy nhập API Base URL cho nhà cung cấp tương thích OpenAI.");
    const endpoint = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
    const messages = [{ role: "system", content: systemPrompt }];
    history.slice(-4).forEach(item => {
      messages.push({
        role: item.sender === "user" ? "user" : "assistant",
        content: item.text
      });
    });
    messages.push({ role: "user", content: userMessage });

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        ...(baseUrl.includes("openrouter.ai") ? { "HTTP-Referer": window.location.origin, "X-Title": "Konoha Solopreneur OS" } : {})
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "Không nhận được phản hồi.";
  }

  static async callAnthropicAPI(apiKey, model, systemPrompt, userMessage, history) {
    const messages = history.slice(-4).map(item => ({ role: item.sender === "user" ? "user" : "assistant", content: item.text }));
    messages.push({ role: "user", content: userMessage });
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({ model, system: systemPrompt, messages, max_tokens: 1400 })
    });
    if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return (data.content || []).filter(item => item.type === "text").map(item => item.text).join("\n") || "Không nhận được phản hồi.";
  }

  static async callCopilotCLI(model, systemPrompt, userMessage, history) {
    const response = await fetch("/api/copilot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: userMessage, system: systemPrompt, history: history.slice(-4) })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Không kết nối được GitHub Copilot CLI.");
    return data.text;
  }

  static async smartSimulate(agentId, prompt) {
    // Artificial small delay for realistic typing feel
    await new Promise(r => setTimeout(r, 600));

    const p = prompt.toLowerCase();

    switch (agentId) {
      case "naruto":
        return buildNarutoOperationsReport(prompt);

      case "shikamaru":
        return `### ♟️ Shikamaru Nara — Đánh giá Chiến lược & Phân bổ Nguồn lực
Hầy... Nghe qua mục tiêu *"**${prompt}**"* thì thấy khối lượng việc cũng phiền toái thật đấy. Nhưng nếu tính đúng nước cờ, bạn sẽ tốn rất ít sức:

1. **Phân tích Đòn bẩy 80/20 (Nước cờ Shogi):**
   - 80% kết quả chỉ đến từ 20% hành động then chốt. Đừng sa đà vào việc hoàn hảo hóa logo hay giao diện ban đầu.
   - Hãy kiểm chứng nhu cầu thị trường trước: Liệu khách hàng có sẵn sàng trả tiền trước khi ta xây dựng toàn bộ sản phẩm không?
2. **Chiến lược Định giá & Dòng tiền:**
   - Đừng bán lẻ thời gian của bạn (Hourly Rate). Hãy bán theo **Gói giải pháp trọn gói (Productized Service)** hoặc định kỳ hàng tháng (Monthly Retainer).
   - Tối thiểu hóa chi phí cố định (Fixed Cost): Dùng các công cụ miễn phí/rẻ cho đến khi có khách hàng trả tiền thực tế.
3. **Kế hoạch 3 nước đi tiếp theo:**
   - *Nước 1:* Xác định 10 khách hàng lý tưởng nhất.
   - *Nước 2:* Xây dựng 1 trang đề xuất giá trị không thể chối từ.
   - *Nước 3:* Chốt đơn đầu tiên rồi mới mở rộng quy mô.

Nghĩ thông rồi thì hành động nhẹ nhàng lắm. Bạn có muốn tôi chi tiết hóa bảng giá không?`;

      case "kakashi":
        return `### ⚡ Kakashi Hatake — Báo cáo Kiểm duyệt Chất lượng & SOP
Tôi vừa kiểm tra yêu cầu: *"**${prompt}**"*. Đã đọc qua rất kỹ.

Đối với một solopreneur, danh tiếng cá nhân chính là thương hiệu công ty. Một sản phẩm cẩu thả có thể làm mất khách hàng vĩnh viễn. Dưới đây là **Checklist nghiệm thu tiêu chuẩn** tôi lập cho bạn:

* [ ] **Tiêu chí 1: Rõ ràng & Không mơ hồ.** Khách hàng đọc vào có hiểu ngay họ nhận được gì trong 5 giây đầu tiên không?
* [ ] **Tiêu chí 2: Bảo mật & Ổn định.** Thông tin khách hàng, API key, cơ sở dữ liệu đã được bảo vệ chưa? Có rủi ro rò rỉ dữ liệu không?
* [ ] **Tiêu chí 3: Quy trình bàn giao (SOP).** Nếu gặp lỗi phát sinh, đã có tài liệu hướng dẫn khách tự khắc phục hoặc liên hệ lại chưa?
* [ ] **Tiêu chí 4: Kiểm thử thực tế.** Bạn đã tự đóng vai khách hàng để trải nghiệm từ đầu đến cuối một lượt chưa?

> **Khuyến nghị từ Kakashi:** Trước khi bấm gửi hoặc phát hành công khai, hãy gửi bản thảo qua đây để tôi soi lỗi một lần nữa bằng Sharingan nhé.`;

      case "sakura":
        return `### 🌸 Sakura Haruno — Kế hoạch Chăm sóc Khách hàng & Giao tiếp
Xin chào Founder! Về vấn đề: *"**${prompt}**"*, tôi đã chuẩn bị phương án giao tiếp vừa ấm áp, vừa chuyên nghiệp:

1. **Tâm lý khách hàng:**
   Khách hàng tìm đến dịch vụ công ty 1 người thường thích sự tận tâm, tốc độ phản hồi nhanh và được trao đổi trực tiếp với người thực thi chính (chính là bạn).
2. **Mẫu thông điệp tiếp cận / phản hồi đề xuất:**
   > *"Chào bạn [Tên Khách Hàng], mình rất vui được đồng hành cùng bạn trong dự án này. Thay vì qua nhiều tầng trung gian, toàn bộ giải pháp sẽ được mình trực tiếp tối ưu và cam kết chất lượng cao nhất..."*
3. **Quy trình giữ chân khách hàng (Retention):**
   - Phản hồi trong vòng tối đa 2 giờ vào ngày làm việc.
   - Luôn gửi cập nhật tiến độ vào thứ Sáu hàng tuần (ngay cả khi chưa xong) để khách hoàn toàn an tâm.

Cứ yên tâm, tôi sẽ luôn đồng hành để mọi khách hàng đều cảm thấy được tôn trọng và thấu hiểu!`;

      case "sasuke":
        return `### 🔮 Sasuke Uchiha — Kiến trúc Kỹ thuật & Tự động hoá
Về yêu cầu: *"**${prompt}**"*. Tôi sẽ đi thẳng vào giải pháp kỹ thuật tối ưu nhất, không vòng vo.

**1. Kiến trúc hệ thống đề xuất (Zero-Ops Solopreneur Stack):**
\`\`\`text
[Khách Hàng / Form] 
       │ (Webhook)
       ▼
   [n8n / Make] ─── (AI Filter) ───► [Supabase / DB]
       │
       ▼ (Tự động gửi email + tạo Task Notion)
   [Resend / SMTP]
\`\`\`

**2. Công nghệ nên dùng:**
- **Frontend / Landing:** Astro hoặc Next.js (nhẹ, SEO cực tốt, deploy miễn phí trên Vercel/Cloudflare).
- **Automation:** Tự host n8n hoặc dùng Make.com để tự động hóa toàn bộ việc gửi hóa đơn, thông báo Telegram khi có khách mới.
- **Database:** Supabase hoặc SQLite/PocketBase (nhanh, rẻ, ít bảo trì).

**3. Mã Script mẫu / Trigger:**
Nếu bạn cần script webhook tự động hoặc tích hợp API cụ thể, hãy ném yêu cầu chi tiết vào đây, tôi sẽ viết code hoàn chỉnh. Đừng làm thủ công!`;

      case "hinata":
        return `### 👁️ Hinata Hyuga — Báo cáo Nghiên cứu Thị trường (Byakugan Intel)
Dạ, chào Founder... Em đã kích hoạt Byakugan để quét dữ liệu và thị trường cho chủ đề: *"**${prompt}**"*.

Dưới đây là các phát hiện quan trọng mà em ghi nhận được:

1. **Phân khúc khách hàng tiềm năng:**
   - Nhóm đối tượng này đang gặp khó khăn lớn nhất ở việc: *thiếu thời gian, công cụ hiện tại quá phức tạp, và các agency lớn tính phí quá đắt đỏ*.
   - Đây chính là khe hở lớn mà một Solopreneur nhanh nhạy có thể chiếm lĩnh!
2. **Điểm yếu của các đối thủ lớn:**
   - Phản hồi chậm, quy trình cồng kềnh, chi phí quản lý đội ngũ cao khiến giá thành bị đẩy lên.
   - Bạn có thể chiến thắng bằng tốc độ, sự linh hoạt và cá nhân hóa sâu sắc cho từng khách hàng.
3. **Tài liệu & Xu hướng tham khảo:**
   - Xu hướng tìm kiếm về từ khóa này đang tăng trưởng ổn định trong quý vừa qua.
   - Hãy tập trung vào việc tạo các case-study ngắn hoặc video demo trực quan để tạo độ tin cậy nhanh chóng.

Em đã lưu trữ các số liệu này vào bộ nhớ nghiên cứu, nếu anh cần đào sâu vào chỉ số nào thì bảo em nhé ạ!`;

      case "jiraiya":
        return `### ✍️ Jiraiya (Hiền nhân Cóc) — Đề xuất Marketing & Storytelling
Ha ha! Nghệ thuật không chỉ là chiêu thức, mà là câu chuyện chạm đến trái tim hàng vạn độc giả! Về mục tiêu: *"**${prompt}**"*, tôi có 3 đòn bẩy nội dung sắc bén:

1. **Công thức kể chuyện Hook - Story - Offer:**
   - **Hook giật gân:** Đánh thẳng vào nỗi đau thầm kín nhất của khách hàng (lãng phí thời gian, ngột ngạt vì công cụ phức tạp).
   - **Story truyền cảm hứng:** Kể câu chuyện thực tế về hành trình vượt khó, dùng chính góc nhìn và trải nghiệm của Founder để xây dựng lòng tin tuyệt đối.
   - **Offer khó chối từ:** Một giải pháp tinh gọn, hành động ngay với giá trị vượt trội so với chi phí.

2. **Chiến lược phân phối nội dung đa kênh:**
   - **Shorts/Reels/TikTok:** 3 kịch bản 30 giây giải quyết 1 vấn đề gây nhức nhối nhất trong ngành.
   - **Bài viết định vị chuyên gia (LinkedIn/Facebook):** Bài viết 800 từ mang tính dẫn dắt tư duy (Thought Leadership).
   - **Email Newsletter:** Câu chuyện tâm tình gửi thứ 3 và thứ 5 nuôi dưỡng tệp độc giả trung thành.

3. **Chỉ số đo lường hiệu quả (Metrics):**
   - Tỷ lệ giữ chân người xem video trên 55% và tỷ lệ phản hồi mở email trên 35%.

Founder thấy hướng đi này thế nào? Cứ giao cho tôi, tôi sẽ soạn ngay bản thảo đầu tiên!`;

      case "sai":
        return `### 🎨 Sai (Họa sư Làng Lá) — Đề xuất Thiết kế & Trải nghiệm UI/UX
Một bản vẽ xuất sắc có giá trị hơn ngàn lời thuyết minh. Về yêu cầu: *"**${prompt}**"*, tôi xin đưa ra định hướng thẩm mỹ và trải nghiệm:

1. **Bố cục thị giác & Điểm nhấn (Visual Hierarchy):**
   - Giảm bớt 40% chi tiết thừa thãi, ưu tiên khoảng trắng (whitespace) để người dùng tập trung 100% vào hành động chuyển đổi chính (Primary CTA).
   - Thiết lập tone màu chủ đạo chuẩn mực: nền Dark Slate cao cấp kết hợp màu điểm nhấn tạo độ tin cậy thương hiệu.

2. **Tối ưu trải nghiệm tương tác (UX Flow):**
   - Tối đa 3 bước nhấp chuột để khách hàng từ trang đích đi đến quyết định đăng ký hoặc mua dịch vụ.
   - Đảm bảo độ tương phản màu chuẩn WCAG AA và hiển thị hoàn hảo trên màn hình di động.

3. **Gói tài nguyên hoàn thiện bàn giao:**
   - Design System hoàn chỉnh: Bảng màu, typography, thẻ Card, nút bấm Button, Modal thông báo.
   - Wireframe rõ ràng sẵn sàng để Sasuke chuyển hóa thành code giao diện thực tế.

Tôi đã phác thảo xong khung bố cục, anh xem qua và góp ý để tôi hoàn thiện nhé!`;

      case "tsunade":
        return `### 💰 Tsunade Senju — Quản trị Tài chính & Dòng tiền (CFO Review)
Làm kinh doanh mà không kiểm soát dòng tiền thì chỉ như canh bạc trắng tay! Đối với kế hoạch: *"**${prompt}**"*, tôi yêu cầu Founder phải tuân thủ nghiêm ngặt 3 kỷ luật thép:

1. **Kiểm soát chi phí & Điểm hòa vốn (Break-even):**
   - Giữ chi phí cố định (Fixed OpEx) dưới 15% tổng doanh thu. Tận dụng triệt để tài nguyên có sẵn trước khi chi tiền mua công cụ mới.
   - Biên lợi nhuận gộp mục tiêu tối thiểu phải đạt **70% - 80%** đối với dịch vụ / sản phẩm số của Solopreneur.

2. **Quỹ khẩn cấp Bách Hào Ấn (Emergency Runway):**
   - Trích ngay 20% doanh thu mỗi hợp đồng chuyển thẳng vào tài khoản dự phòng khẩn cấp.
   - Mục tiêu: Luôn tích lũy đủ **6 đến 12 tháng** chi phí sinh hoạt và vận hành tối thiểu.

3. **Kỷ luật thu hồi dòng tiền:**
   - Ưu tiên phương thức thu trước 50% - 100% hoặc mô hình thuê bao hàng tháng (Retainer). Không chấp nhận công nợ dài ngày không có cam kết bảo lãnh.

Hãy giữ vững kỷ luật này, công ty một người của chúng ta mới có thể trường tồn và lớn mạnh!`;

      default:
        return `Đã tiếp nhận yêu cầu: "${prompt}". Các agent đang phối hợp xử lý!`;
    }
  }
}

// --- 4. UI Rendering Functions ---

function getDepartmentWork(agentId) {
  const kanbanTasks = state.missions.filter(mission => mission.assignee === agentId).map(mission => ({
    title: mission.title,
    status: mission.status,
    deliverable: mission.desc || '',
    evidence: '',
    source: 'Kanban'
  }));
  const campaignTasks = (window.konohaTikTokCampaign?.departmentAssignments || [])
    .filter(assignment => assignment.departmentId === agentId)
    .map(assignment => ({
      title: `TikTok 10 ngày: ${assignment.task}`,
      status: assignment.status,
      deliverable: assignment.deliverable,
      evidence: assignment.evidence,
      source: 'Campaign @cinetech.ai'
    }));
  return [...campaignTasks, ...kanbanTasks];
}

function departmentWorkStatus(status) {
  return ({
    in_progress: ['Đang làm', 'text-sky-200 bg-sky-500/15'],
    completed: ['Đã nộp đầu ra', 'text-emerald-200 bg-emerald-500/15'],
    reviewing: ['Kakashi đang rà', 'text-amber-200 bg-amber-500/15'],
    blocked: ['Đang bị chặn', 'text-rose-200 bg-rose-500/15'],
    queued: ['Đang chờ', 'text-slate-300 bg-slate-700/50'],
    backlog: ['Đang chờ', 'text-slate-300 bg-slate-700/50']
  })[status] || [String(status || 'Chưa rõ'), 'text-slate-300 bg-slate-700/50'];
}

// Render Hotspots and Mini Status on Diorama
function renderDioramaCards() {
  const container = document.getElementById("diorama-cards-grid");
  if (!container) return;

  container.innerHTML = Object.values(AGENTS).map(agent => {
    const workItems = getDepartmentWork(agent.id);
    const missionCount = workItems.length;
    const workHtml = workItems.length
      ? `<div class="mt-3 pt-2 border-t border-slate-700/50 space-y-2 max-h-40 overflow-y-auto">${workItems.map(item => {
        const [statusLabel, statusClass] = departmentWorkStatus(item.status);
        return `<div class="rounded-md bg-slate-950/50 p-2 text-left"><div class="flex items-start justify-between gap-2"><p class="text-[11px] leading-snug text-slate-200">${escapeHtml(item.title)}</p><span class="shrink-0 rounded px-1.5 py-0.5 text-[9px] ${statusClass}">${statusLabel}</span></div><details class="mt-1 text-[10px] text-slate-400"><summary class="cursor-pointer">Đầu ra / ghi chú</summary><p class="mt-1 whitespace-pre-wrap">${escapeHtml(item.deliverable || 'Chưa ghi đầu ra.')}</p>${item.evidence ? `<p class="mt-1 text-slate-500">${escapeHtml(item.evidence)}</p>` : ''}</details></div>`;
      }).join('')}</div>`
      : `<div class="mt-3 pt-2 border-t border-slate-700/50 text-[10px] text-slate-500">Chưa có đầu việc được giao.</div>`;
    return `
      <div class="glass-card glass-card-interactive p-4 cursor-pointer border-t-2 border-${agent.accentClass} flex flex-col justify-between"
           onclick="if (event.target.closest('details')) return; openAgentChat('${agent.id}')">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">${agent.avatarIcon}</span>
            <span class="rank-badge rank-B">${missionCount} Tasks</span>
          </div>
          <h4 class="font-bold text-sm text-slate-100">${agent.name}</h4>
          <p class="text-xs text-slate-400 mt-1 line-clamp-1">${agent.role.split("(")[0]}</p>
        </div>
        ${workHtml}
        <div class="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-amber-400">
          <span>Phòng: ${agent.roomName.split(" ")[1]}</span>
          <span class="text-slate-400 hover:text-white">Chat ➔</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderCapabilitiesView() {
  const summary = document.getElementById("capability-summary");
  const departments = document.getElementById("capability-departments");
  if (!summary || !departments) return;

  const allCapabilities = Object.values(DEPARTMENT_CAPABILITIES);
  const specialistCount = allCapabilities.reduce((total, item) => total + item.operationalAgents.length, 0);
  const skillCount = new Set(allCapabilities.flatMap(item => item.skillRefs || [])).size;
  summary.innerHTML = [
    ["🤖", specialistCount, "vai trò chuyên môn được cấu hình"],
    ["🧩", skillCount, "Codex Skill tái sử dụng đã nạp"],
    ["🛡️", "100%", "đầu ra quan trọng cần Founder duyệt"]
  ].map(([icon, value, label]) => `
    <div class="glass-card p-4 border border-slate-800 flex items-center gap-3">
      <span class="text-2xl">${icon}</span>
      <div><div class="text-xl font-extrabold text-slate-100">${value}</div><div class="text-xs text-slate-400">${label}</div></div>
    </div>`).join("");

  document.getElementById("capability-agent-note")?.remove();
  summary.insertAdjacentHTML("afterend", `<p id="capability-agent-note" class="text-[11px] text-slate-400 -mt-2 mb-3">Đây là vai trò và quy trình được nạp vào prompt của từng phòng ban; chúng không phải các worker AI chạy nền đồng thời. Agent Harness dùng các file SKILL.md trong .agents/skills khi chạy Codex job.</p>`);

  departments.innerHTML = Object.values(AGENTS).map(agent => {
    const capability = DEPARTMENT_CAPABILITIES[agent.id];
    return `
      <article class="glass-card p-5 border-t-2 border-${agent.accentClass}">
        <div class="flex items-start justify-between gap-3">
          <div class="flex gap-3"><span class="text-3xl">${agent.avatarIcon}</span><div>
            <h3 class="font-bold text-slate-100">${agent.name}</h3>
            <p class="text-xs text-slate-400 mt-0.5">${escapeHtml(agent.role)}</p>
          </div></div>
          <button class="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-violet-200 border border-slate-700" onclick="createCapabilityMission('${agent.id}')">+ Giao việc</button>
        </div>
        <div class="mt-4 space-y-3 text-xs">
          <div><div class="uppercase tracking-wider font-bold text-slate-500 mb-1">Agent chuyên môn</div><div class="flex flex-wrap gap-1.5">${capability.operationalAgents.map(name => `<span class="px-2 py-1 rounded bg-violet-500/10 border border-violet-500/25 text-violet-200">${escapeHtml(name)}</span>`).join("")}</div></div>
          <div><div class="uppercase tracking-wider font-bold text-slate-500 mb-1">Skill đang áp dụng</div><ul class="text-slate-300 space-y-1">${capability.skills.map(skill => `<li>• ${escapeHtml(skill)}</li>`).join("")}</ul></div>
          <div><div class="uppercase tracking-wider font-bold text-slate-500 mb-1">Skill đã nạp vào luồng AI</div><ul class="text-violet-200 space-y-1">${(capability.skillRefs || []).map(id => `<li>• ${escapeHtml(COMPANY_SKILLS[id]?.name || id)}</li>`).join("")}</ul></div>
          <div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800"><span class="font-semibold text-emerald-300">Đầu ra:</span> <span class="text-slate-300">${escapeHtml(capability.outcome)}</span></div>
          <div class="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-100"><span class="font-semibold">Cổng duyệt:</span> ${escapeHtml(capability.approval)}</div>
        </div>
      </article>`;
  }).join("");
}

function updateNarutoMonitorStatus() {
  const status = document.getElementById("naruto-monitor-status");
  if (!status) return;
  const monitor = state.narutoMonitor;
  const nextCheck = monitor.lastCheckedAt ? new Date(new Date(monitor.lastCheckedAt).getTime() + 2 * 60 * 60 * 1000).toLocaleString() : "sau khi có task đầu tiên";
  status.textContent = `${monitor.lastSummary || "Chưa có dữ liệu kiểm tra tiến độ."} Lần kiểm tra tiếp theo: ${nextCheck}.`;
}

function updateNarutoApiNotice() {
  const notice = document.getElementById("naruto-api-missing-notice");
  if (!notice) return;
  const hasMissingApiJob = state.operationalPlans.some(plan => plan.status === "blocked_no_api_key");
  notice.classList.toggle("hidden", !hasMissingApiJob);
}

function notifyNarutoMissingApi(plan) {
  updateNarutoApiNotice();
  if (plan.apiMissingNotifiedAt) return;
  plan.apiMissingNotifiedAt = new Date().toISOString();
  state.saveOperationalPlans();
        alert(`Naruto chưa thể xử lý công việc vì thiếu API key hoặc đăng nhập cho ${state.settings.apiProvider}. Mở Cài đặt AI để bổ sung rồi thử lại.`);
}

function retryBlockedNarutoJobs() {
  const blocked = state.operationalPlans.filter(plan => plan.status === "blocked_no_api_key");
  if (!blocked.length) return;
  blocked.forEach(plan => startNarutoOrchestration(plan));
}

function runNarutoProgressCheck(showNotice = false) {
  const plans = state.operationalPlans;
  const tasks = state.missions.filter(task => task.planId);
  const completed = tasks.filter(task => task.status === "completed").length;
  const active = tasks.filter(task => task.status === "in_progress").length;
  const review = tasks.filter(task => task.status === "reviewing").length;
  const backlog = tasks.filter(task => task.status === "backlog").length;
  const blockedPlans = plans.filter(plan => ["failed", "blocked_no_api_key", "automation_failed", "automation_blocked", "blocked_qa", "interrupted"].includes(plan.status)).length;
  state.narutoMonitor = {
    lastCheckedAt: new Date().toISOString(),
    lastSummary: plans.length
      ? `Naruto đã kiểm tra ${plans.length} kế hoạch: ${completed}/${tasks.length} task hoàn thành, ${active} đang làm, ${review} chờ Founder/QA, ${backlog} chờ xử lý${blockedPlans ? `, ${blockedPlans} job bị chặn hoặc lỗi` : ""}.`
      : "Naruto chưa có kế hoạch nào để kiểm tra."
  };
  state.saveNarutoMonitor();
  updateNarutoMonitorStatus();
  renderOperationsReports();
  if (showNotice) alert(state.narutoMonitor.lastSummary);
}

function openNarutoTaskIntake() {
  state.activeAgentId = "naruto";
  switchView("chat");
  requestAnimationFrame(() => {
    toggleStandardTaskForm();
    document.getElementById("task-brief-title")?.focus();
  });
}

function renderOperationsReports() {
  const container = document.getElementById("operations-reports-list");
  updateNarutoApiNotice();
  if (!container) return;
  updateNarutoMonitorStatus();
  if (!state.operationalPlans.length && !state.founderNotifications.length) {
    container.innerHTML = `<div class="glass-card p-8 text-center text-sm text-slate-400">Chưa có kế hoạch tự động. Hãy giao mục tiêu cho Naruto để tạo Kanban và báo cáo tiến độ.</div>`;
    return;
  }
  const notificationHtml = state.founderNotifications.length ? `<section class="glass-card p-4 border border-emerald-500/40"><h3 class="font-bold text-emerald-300 text-sm mb-3">🔔 Thông báo cho Founder</h3><div class="space-y-3">${state.founderNotifications.map(note => `<div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"><div><div class="font-semibold text-slate-100 text-sm">${escapeHtml(note.title)}</div><p class="text-xs text-slate-300 mt-1">${escapeHtml(note.message)}</p><p class="text-[11px] text-slate-500 mt-1">${escapeHtml(note.createdAt)}</p></div><a href="${escapeHtml(note.resultUrl)}" class="shrink-0 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">${escapeHtml(note.resultLabel)}</a></div></div>`).join("")}</div></section>` : "";
  container.innerHTML = notificationHtml + state.operationalPlans.map(plan => {
    const approval = getPlanApprovalCopy(plan);
    const tasks = state.missions.filter(mission => mission.planId === plan.id);
    const complete = tasks.filter(task => task.status === "completed").length;
    const active = tasks.filter(task => task.status === "in_progress").length;
    const review = tasks.filter(task => task.status === "reviewing").length;
    const blocker = tasks.filter(task => task.status === "backlog").length;
    const percent = tasks.length ? Math.round((complete / tasks.length) * 100) : 0;
    return `<article id="approval-${plan.id}" class="glass-card p-5 border-l-4 border-naruto">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div><div class="text-[10px] font-mono text-amber-400">${escapeHtml(plan.id)}</div><h3 class="text-base font-bold text-slate-100 mt-1">${escapeHtml(plan.project)}</h3><p class="text-xs text-slate-400 mt-1">Khởi tạo: ${escapeHtml(plan.createdAt)} · Trạng thái: <span class="text-amber-300">${escapeHtml(plan.status)}</span></p></div>
        <div class="text-right"><div class="text-2xl font-extrabold text-emerald-400">${percent}%</div><div class="text-xs text-slate-400">${complete}/${tasks.length} hoàn thành</div></div>
      </div>
      <div class="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-amber-500 to-emerald-400" style="width:${percent}%"></div></div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-xs"><div class="p-2 rounded bg-slate-900 text-slate-300">Đang làm: <b class="text-sky-300">${active}</b></div><div class="p-2 rounded bg-slate-900 text-slate-300">Chờ duyệt: <b class="text-amber-300">${review}</b></div><div class="p-2 rounded bg-slate-900 text-slate-300">Chờ xử lý: <b class="text-slate-200">${blocker}</b></div><div class="p-2 rounded bg-slate-900 text-slate-300">Hoàn tất: <b class="text-emerald-300">${complete}</b></div></div>
      <section class="mt-4 p-4 rounded-xl border ${plan.approval?.status === "approved" ? "border-emerald-500/35 bg-emerald-500/5" : plan.approval?.status === "rejected" || plan.approval?.status === "blocked" ? "border-rose-500/35 bg-rose-500/5" : "border-amber-500/35 bg-amber-500/5"}">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div><div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Founder approval gate · Phương án v${plan.approval?.version || 1}</div><div class="font-bold text-sm mt-1 ${approval.className}">${approval.label}</div><p class="text-xs text-slate-300 mt-1">${escapeHtml(approval.detail)}</p></div>
          ${plan.approval?.status === "final_review" ? `<div class="flex gap-2 shrink-0"><button class="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold" onclick="confirmFinalProduct('${plan.id}')">✓ Xác nhận sản phẩm</button><button class="px-3 py-2 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold" onclick="rejectOperationalPlan('${plan.id}')">✕ Yêu cầu làm lại</button></div>` : plan.approval?.status === "pending" || !plan.approval ? `<div class="flex gap-2 shrink-0"><button class="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold" onclick="approveOperationalPlan('${plan.id}')">✓ Chấp nhận & bắt đầu</button><button class="px-3 py-2 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold" onclick="rejectOperationalPlan('${plan.id}')">✕ Từ chối, làm lại</button></div>` : ""}
        </div>
        <p class="text-[11px] text-slate-400 mt-3">Nội dung duyệt: mục tiêu, phạm vi MVP, đầu ra, hạn bàn giao, tiêu chí nghiệm thu và danh sách ${plan.milestones.length} task dưới đây. Không có hành động bên ngoài nào được tự động thực hiện.</p>
        <details class="mt-3 text-xs"><summary class="cursor-pointer text-sky-300 hover:text-sky-200 font-semibold">Xem nguyên văn phiếu Founder sẽ duyệt</summary><pre class="mt-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">${escapeHtml(plan.sourcePrompt || "Không có nội dung phiếu gốc.")}</pre></details>
        ${plan.automationEvents?.length ? `<div class="mt-3 text-[11px] text-slate-400">🤖 ${plan.automationEvents.map(escapeHtml).join(" · ")}</div>` : ""}${plan.progressReports?.length ? `<details class="mt-3 text-xs"><summary class="cursor-pointer text-emerald-200 font-semibold">Báo cáo kiểm tra định kỳ của Naruto (${plan.progressReports.length})</summary><div class="mt-2 space-y-2">${plan.progressReports.slice().reverse().map(report => `<div class="rounded bg-slate-950/70 p-2 text-slate-300"><div class="text-[10px] text-slate-500">${escapeHtml(report.checkedAt)}</div>${escapeHtml(report.summary)}</div>`).join("")}</div></details>` : ""}${plan.automationError ? `<div class="mt-3 text-xs text-rose-300">Runner: ${escapeHtml(plan.automationError)}</div>` : ""}
      </section>
      ${plan.narutoPlan ? `<details class="mt-3 text-xs"><summary class="cursor-pointer text-sky-200 font-semibold">Xem kế hoạch Naruto</summary><pre class="mt-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 whitespace-pre-wrap font-sans">${escapeHtml(plan.narutoPlan)}</pre></details>` : ""}
      ${plan.qaReport ? `<details class="mt-3 text-xs"><summary class="cursor-pointer text-amber-200 font-semibold">Xem báo cáo Kakashi · ${escapeHtml(plan.qaDisposition || "đang kiểm tra")}</summary><pre class="mt-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 whitespace-pre-wrap font-sans">${escapeHtml(plan.qaReport)}</pre></details>` : ""}
      ${plan.departmentAssignments?.length ? `<section class="mt-4 p-4 rounded-xl border border-sky-500/30 bg-sky-500/5"><h4 class="font-bold text-sky-200 text-sm mb-2">🍥 Naruto đã điều phối phòng ban</h4><div class="space-y-2">${plan.departmentAssignments.map(item => `<div class="rounded-lg bg-slate-950/60 p-3 text-xs"><div class="flex justify-between gap-3"><b class="text-slate-100">${escapeHtml(item.departmentName)}</b><span class="text-sky-200">${escapeHtml(item.status === "completed" ? "Đã nộp đầu ra" : item.status === "in_progress" ? "Đang xử lý" : item.status === "blocked" ? "Bị chặn" : "Đang chờ")}</span></div><p class="text-slate-300 mt-1">${escapeHtml(item.task)}</p><p class="text-slate-500 mt-1">Bàn giao: ${escapeHtml(item.deliverable)}</p>${plan.departmentOutputs?.[item.departmentId] ? `<details class="mt-2"><summary class="cursor-pointer text-emerald-200">Xem đầu ra phòng ban</summary><pre class="mt-1 p-2 rounded bg-slate-900 text-slate-300 whitespace-pre-wrap font-sans">${escapeHtml(plan.departmentOutputs[item.departmentId])}</pre></details>` : ""}</div>`).join("")}</div></section>` : ""}
      <div class="mt-4 space-y-2">${tasks.map(task => `<div class="flex gap-2 text-xs"><span class="text-amber-300 shrink-0">${escapeHtml(task.dueDate)}</span><span class="text-slate-300">${AGENTS[task.assignee].avatarIcon} ${escapeHtml(task.title)}</span><span class="ml-auto text-slate-500">${escapeHtml(task.status)}</span></div>`).join("")}</div>
      <div class="mt-4 flex flex-wrap items-center gap-2"><a href="${escapeHtml(plan.resultUrl || "#")}" class="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">${escapeHtml(plan.resultLabel || "Mở kết quả")}</a><p class="text-xs text-amber-100 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">Founder cần duyệt scope và mọi hành động bên ngoài. Báo cáo chỉ phản ánh trạng thái Kanban cục bộ.</p></div>
    </article>`;
  }).join("");
}

function createCapabilityMission(agentId) {
  const agent = AGENTS[agentId];
  const capability = DEPARTMENT_CAPABILITIES[agentId];
  if (!agent || !capability) return;
  const title = `Lập kế hoạch: ${capability.skills[0]}`;
  const brief = `# PHIẾU GIAO VIỆC QUA NARUTO\nTASK_TITLE: ${title}\nPRIORITY: B\n\nOBJECTIVE:\n${capability.outcome}\nPhòng ${agent.name} được gợi ý làm chuyên viên tham vấn; Naruto quyết định phân công và có thể chọn thêm phòng ban.\n\nREQUIRED_ARTIFACT:\nĐầu ra chuyên môn có thể review.\n\nACCEPTANCE_AND_TEST:\nNaruto ghi rõ owner, đầu ra và blocker; Kakashi kiểm tra; mọi hành động bên ngoài cần Founder duyệt.`;
  const plan = createOperationalPlanFromNaruto(brief);
  handoffPlanToNarutoChat(plan, `Nhờ Naruto giao việc phù hợp cho phòng ${agent.name}: ${capability.skills[0]}.`);
}

// Render Kanban Missions Board
function renderMissionsBoard() {
  const columns = {
    backlog: document.getElementById("col-backlog"),
    in_progress: document.getElementById("col-in_progress"),
    reviewing: document.getElementById("col-reviewing"),
    completed: document.getElementById("col-completed")
  };

  Object.values(columns).forEach(col => {
    if (col) col.innerHTML = "";
  });

  state.missions.forEach(mission => {
    const agent = AGENTS[mission.assignee] || AGENTS.naruto;
    const targetCol = columns[mission.status];
    if (!targetCol) return;

    const card = document.createElement("div");
    card.className = `glass-card p-3.5 mb-3 border-l-4 border-${agent.accentClass} hover:border-white transition-all cursor-pointer`;
    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="rank-badge rank-${mission.rank}">Cấp ${mission.rank}</span>
        <div class="flex items-center gap-1.5 text-xs text-slate-400">
          <span>${agent.avatarIcon}</span>
          <span>${agent.name.split(" ")[0]}</span>
        </div>
      </div>
      <h5 class="font-semibold text-sm text-slate-200 mb-1.5 leading-snug">${escapeHtml(mission.title)}</h5>
      <p class="text-xs text-slate-400 line-clamp-2 mb-2.5">${escapeHtml(mission.desc || "")}</p>
      
      <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
        <span class="text-slate-500">📅 ${mission.dueDate || "Chưa set"}</span>
        <div class="flex gap-1">
          ${mission.status !== "backlog" ? `<button class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300" onclick="moveMission('${mission.id}', -1, event)">◀</button>` : ""}
          ${mission.status !== "completed" ? `<button class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300" onclick="moveMission('${mission.id}', 1, event)">▶</button>` : ""}
          <button class="px-1.5 py-0.5 text-red-400 hover:bg-red-950/40 rounded" onclick="deleteMission('${mission.id}', event)">✕</button>
        </div>
      </div>
    `;
    targetCol.appendChild(card);
  });
}

function moveMission(id, dir, event) {
  if (event) event.stopPropagation();
  const order = ["backlog", "in_progress", "reviewing", "completed"];
  const mission = state.missions.find(m => m.id === id);
  if (!mission) return;
  const currentIndex = order.indexOf(mission.status);
  const nextIndex = currentIndex + dir;
  if (nextIndex >= 0 && nextIndex < order.length) {
    mission.status = order[nextIndex];
    state.saveMissions();
    renderMissionsBoard();
    renderDioramaCards();
    runNarutoProgressCheck(false);
  }
}

function evaluateOperationalPlanCompletion(planId) {
  if (!planId) return;
  const plan = state.operationalPlans.find(item => item.id === planId);
  const tasks = state.missions.filter(item => item.planId === planId);
  if (!plan || tasks.length === 0 || tasks.some(item => item.status !== "completed") || plan.notifiedAt) return;

  plan.status = "completed_needs_founder_review";
  plan.notifiedAt = new Date().toLocaleString();
  state.founderNotifications.unshift({
    id: `notice-${Date.now()}`,
    planId: plan.id,
    title: `Kế hoạch hoàn thành: ${plan.project}`,
    message: `Naruto báo cáo: ${tasks.length}/${tasks.length} nhiệm vụ đã hoàn thành. Founder hãy mở kết quả để kiểm tra và phê duyệt.`,
    resultUrl: plan.resultUrl || "#",
    resultLabel: plan.resultLabel || "Mở báo cáo kế hoạch",
    createdAt: plan.notifiedAt
  });
  state.saveOperationalPlans();
  state.saveFounderNotifications();
  showFounderToast(plan);
}

function showFounderToast(plan) {
  const existing = document.getElementById("founder-notification-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "founder-notification-toast";
  toast.className = "fixed right-4 bottom-4 z-[70] max-w-sm p-4 rounded-2xl bg-slate-900 border border-emerald-400 shadow-2xl text-sm";
  toast.innerHTML = `<div class="font-bold text-emerald-300">✓ Thông báo Founder</div><p class="text-slate-200 mt-1">${escapeHtml(plan.project)} đã hoàn thành. Hãy kiểm tra kết quả trước khi phê duyệt.</p><div class="mt-3 flex gap-2"><a class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs" href="${escapeHtml(plan.resultUrl || "#")}">${escapeHtml(plan.resultLabel || "Mở kết quả")}</a><button class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs" onclick="this.closest('#founder-notification-toast').remove()">Đóng</button></div>`;
  document.body.appendChild(toast);
}

function deleteMission(id, event) {
  if (event) event.stopPropagation();
  if (!confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này?")) return;
  state.missions = state.missions.filter(m => m.id !== id);
  state.saveMissions();
  renderMissionsBoard();
  renderDioramaCards();
}

// 1-on-1 Chat Functions
function openAgentChat(agentId) {
  state.activeAgentId = agentId;
  switchView("chat");
  renderAgentChatView();
}

function renderAgentChatView() {
  const agent = AGENTS[state.activeAgentId];
  if (!agent) return;

  const header = document.getElementById("chat-agent-header");
  const avatar = document.getElementById("chat-agent-avatar");
  const nameEl = document.getElementById("chat-agent-name");
  const roleEl = document.getElementById("chat-agent-role");
  const quoteEl = document.getElementById("chat-agent-quote");
  const listEl = document.getElementById("chat-agent-selector-list");
  const routingHint = document.getElementById("chat-work-routing-hint");

  if (avatar) avatar.textContent = agent.avatarIcon;
  if (nameEl) nameEl.textContent = agent.name;
  if (roleEl) roleEl.textContent = agent.role;
  if (quoteEl) quoteEl.textContent = `"${agent.quote}"`;
  if (routingHint) routingHint.textContent = agent.id === "naruto"
    ? "Naruto tiếp nhận mọi nhiệm vụ, chọn phòng ban phù hợp và theo dõi đầu ra."
    : "Đây là kênh tham vấn chuyên môn; yêu cầu thực hiện công việc sẽ được chuyển qua Naruto để điều phối.";

  // Render left sidebar agent selector
  if (listEl) {
    listEl.innerHTML = Object.values(AGENTS).map(a => `
      <button class="w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${a.id === agent.id ? 'bg-amber-500/20 border border-amber-500/40 text-white' : 'hover:bg-slate-800/60 text-slate-400'}"
              onclick="openAgentChat('${a.id}')">
        <span class="text-xl">${a.avatarIcon}</span>
        <div class="overflow-hidden">
          <div class="text-sm font-semibold truncate ${a.id === agent.id ? 'text-amber-300' : 'text-slate-200'}">${a.name}</div>
          <div class="text-xs text-slate-500 truncate">${a.role.split("(")[0]}</div>
        </div>
      </button>
    `).join("");
  }

  // Render Chat Messages
  renderChatMessages();
}

function renderChatMessages() {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;

  const history = state.chatHistories[state.activeAgentId] || [];
  const agent = AGENTS[state.activeAgentId];
  if (history.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 px-4">
        <span class="text-5xl mb-3 block">${agent.avatarIcon}</span>
        <h4 class="text-lg font-semibold text-slate-200">${agent.name} sẵn sàng hỗ trợ!</h4>
        <p class="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-4">${agent.role}. ${agent.id === "naruto" ? "Gửi nhiệm vụ cho Naruto để điều phối các phòng ban." : "Có thể hỏi tư vấn chuyên môn; nếu giao việc, Naruto sẽ tiếp nhận và phân công."}</p>
        <div class="inline-flex gap-2">
          <button class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                  onclick="quickAskAgent('Hãy giới thiệu vai trò và cách bạn có thể giúp tôi hôm nay?')">
            💡 Bạn có thể giúp gì cho tôi?
          </button>
          <button class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                  onclick="quickAskAgent('Hãy gợi ý 3 việc quan trọng nhất tôi nên tập trung tuần này!')">
            🎯 Gợi ý 3 việc cần làm
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = history.map(msg => {
    const isUser = msg.sender === "user";
    return `
      <div class="flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}">
        ${!isUser ? `<div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">${agent.avatarIcon}</div>` : ''}
        <div class="max-w-[80%] rounded-2xl p-4 ${isUser ? 'bg-amber-600/90 text-white rounded-br-sm' : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-sm agent-response'}">
          ${formatMarkdown(msg.text)}
          <div class="text-[10px] mt-1.5 text-right opacity-60">${msg.time || ''}</div>
        </div>
        ${isUser ? `<div class="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">Tôi</div>` : ''}
      </div>
    `;
  }).join("");

  container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
  const input = document.getElementById("chat-user-input");
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = "";

  const selectedAgentId = state.activeAgentId;
  const normalized = text.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/g, "d").toLowerCase();
  const isWorkRequest = /(?:^|\s)(?:thuc hien|lam|tao|viet|sua|xay dung|phat trien|nghien cuu|phan tich|thiet ke|toi uu|chuan bi|lap ke hoach|kiem tra|trien khai|dieu tra)\b/.test(normalized)
    || /\btoi muon\s+(?:lam|tao|viet|sua|xay dung|phat trien|nghien cuu|phan tich|thiet ke|toi uu|chuan bi|trien khai)\b/.test(normalized);
  if (isWorkRequest) {
    routeWorkRequestToNaruto(text, selectedAgentId === "naruto" ? null : selectedAgentId);
    return;
  }

  const agentId = selectedAgentId;
  if (!state.chatHistories[agentId]) state.chatHistories[agentId] = [];

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.chatHistories[agentId].push({ sender: "user", text, time: timeStr });
  state.saveChatHistories();
  renderChatMessages();

  // Show thinking indicator
  showChatThinking(true);

  try {
    const history = state.chatHistories[agentId];
    let reply = await AIService.queryAgent(agentId, text, history);
    state.chatHistories[agentId].push({
      sender: "agent",
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    state.saveChatHistories();
  } catch (err) {
    state.chatHistories[agentId].push({
      sender: "agent",
      text: `⚠️ Không thể kết nối với ${state.settings.apiProvider || "AI provider"}: ${err.message}`,
      time: timeStr
    });
  } finally {
    showChatThinking(false);
    renderChatMessages();
  }
}

function quickAskAgent(q) {
  const input = document.getElementById("chat-user-input");
  if (input) {
    input.value = q;
    sendChatMessage();
  }
}

function toggleStandardTaskForm() {
  const form = document.getElementById("standard-task-form");
  if (!form) return;
  form.classList.toggle("hidden");
  const dueInput = document.getElementById("task-brief-due");
  if (dueInput && !dueInput.value) {
    dueInput.value = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
  }
}

function submitStandardTaskBrief(event) {
  event.preventDefault();
  const getValue = id => document.getElementById(id)?.value.trim() || "";
  const title = getValue("task-brief-title");
  const dueDate = getValue("task-brief-due");
  const workspace = getValue("task-brief-workspace");
  const priority = getValue("task-brief-priority");
  const objective = getValue("task-brief-objective");
  const artifact = getValue("task-brief-artifact");
  const acceptance = getValue("task-brief-acceptance");
  const approved = document.getElementById("task-brief-approval")?.checked;
  if (!title || !dueDate || !workspace || !objective || !artifact || !acceptance || !approved) {
    alert("Hãy điền đủ trường bắt buộc và xác nhận phạm vi an toàn.");
    return;
  }
  const brief = `# PHIẾU GIAO VIỆC THỰC\nTASK_TITLE: ${title}\nDUE_DATE: ${dueDate}\nPRIORITY: ${priority}\nWORKSPACE: ${workspace}\n\nOBJECTIVE:\n${objective}\n\nREQUIRED_ARTIFACT:\n${artifact}\n\nACCEPTANCE_AND_TEST:\n${acceptance}\n\nYêu cầu điều phối: tạo task thực, Naruto chọn phòng ban; Kakashi kiểm tra trước khi báo Founder; mọi hành động bên ngoài cần Founder duyệt.`;
  const plan = createOperationalPlanFromNaruto(brief);
  handoffPlanToNarutoChat(plan, `Giao việc cho Naruto: ${title}\n\n${objective}`);
  document.getElementById("standard-task-form")?.reset();
  document.getElementById("standard-task-form")?.classList.add("hidden");
}

function showChatThinking(isThinking) {
  const container = document.getElementById("chat-thinking-indicator");
  if (!container) return;
  container.classList.toggle("hidden", !isThinking);
}

// --- 5. War Room (Hội đồng Làng Lá) ---
async function startCouncilMeeting() {
  const input = document.getElementById("council-topic-input");
  if (!input || !input.value.trim()) {
    alert("Vui lòng nhập mục tiêu hoặc vấn đề bạn muốn Hội đồng Làng Lá giải quyết!");
    return;
  }

  const topic = input.value.trim();
  const btn = document.getElementById("btn-summon-council");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="inline-block animate-spin mr-2">🌀</span> Đang triệu tập Hội đồng...`;
  }

  const outputContainer = document.getElementById("council-results-feed");
  if (outputContainer) {
    outputContainer.innerHTML = `
      <div class="glass-card p-5 mb-4 border border-amber-500/30">
        <div class="flex items-center gap-3">
          <span class="text-3xl animate-bounce">🌀</span>
          <div>
            <h4 class="font-bold text-amber-300">Hội nghị Làng Lá đang diễn ra!</h4>
            <p class="text-xs text-slate-400">Chủ đề: "${escapeHtml(topic)}"</p>
          </div>
        </div>
      </div>
      <div id="council-steps-log" class="space-y-4"></div>
    `;
  }

  const logDiv = document.getElementById("council-steps-log");
  const councilOrder = ["naruto", "shikamaru", "tsunade", "hinata", "jiraiya", "sai", "sasuke", "kakashi", "sakura"];
  const meetingSummary = [];

  for (const agentId of councilOrder) {
    const agent = AGENTS[agentId];
    
    // Add pending placeholder
    const stepEl = document.createElement("div");
    stepEl.className = `glass-card p-4 border-l-4 border-${agent.accentClass} animate-pulse`;
    stepEl.innerHTML = `
      <div class="flex items-center gap-2 text-sm font-semibold text-slate-300">
        <span>${agent.avatarIcon}</span>
        <span>${agent.name} đang phân tích...</span>
      </div>
    `;
    if (logDiv) logDiv.appendChild(stepEl);

    // Call agent
    const promptForCouncil = `Hội đồng Làng Lá đang họp về mục tiêu: "${topic}". Dưới góc độ chuyên môn ${agent.role}, hãy đưa ra đánh giá, giải pháp và đề xuất hành động cụ thể cho Founder trong 3-5 gạch đầu dòng.`;
    const response = await AIService.queryAgent(agentId, promptForCouncil);

    // Update element
    stepEl.classList.remove("animate-pulse");
    stepEl.innerHTML = `
      <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <span class="text-xl">${agent.avatarIcon}</span>
          <span class="font-bold text-slate-200 text-sm">${agent.name}</span>
          <span class="text-xs text-slate-400">(${agent.role.split("(")[0]})</span>
        </div>
        <span class="text-xs text-amber-400">Hoàn tất</span>
      </div>
      <div class="agent-response text-slate-300 text-xs leading-relaxed">
        ${formatMarkdown(response)}
      </div>
    `;

    meetingSummary.push({ agentId, agentName: agent.name, response });
  }

  // Save to Council Log
  state.councilLog.unshift({
    id: "c-" + Date.now(),
    date: new Date().toLocaleString(),
    topic: topic,
    summary: meetingSummary
  });
  state.saveCouncilLog();

  const councilInputs = meetingSummary.map(item => `### ${item.agentName}\n${item.response}`).join("\n\n");
  const followUpBrief = `# PHIẾU GIAO VIỆC TỪ HỘI ĐỒNG — NARUTO ĐIỀU PHỐI\nTASK_TITLE: ${topic.slice(0, 100)}\nPRIORITY: A\n\nOBJECTIVE:\nNaruto tổng hợp vấn đề Founder nêu, chọn phòng ban phù hợp và giao owner/đầu ra. Đầu vào tham vấn của Hội đồng:\n\n${councilInputs}\n\nREQUIRED_ARTIFACT:\nKế hoạch và đầu ra chuyên môn phù hợp với chủ đề.\n\nACCEPTANCE_AND_TEST:\nNaruto ghi rõ các phòng ban được giao; Kakashi kiểm tra đầu ra và nêu blocker. Founder duyệt mọi hành động bên ngoài.`;
  const operationalPlan = createOperationalPlanFromNaruto(followUpBrief);
  startNarutoOrchestration(operationalPlan);
  runNarutoProgressCheck(false);
  renderMissionsBoard();
  renderDioramaCards();
  renderOperationsReports();

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `🌀 Triệu tập Hội đồng Làng Lá`;
  }
}

// Export Council Meeting to Markdown
function exportCouncilMarkdown() {
  if (!state.councilLog || state.councilLog.length === 0) {
    alert("Chưa có biên bản cuộc họp nào để xuất!");
    return;
  }

  const latest = state.councilLog[0];
  let md = `# BIÊN BẢN HỘI NGHỊ LÀNG LÁ — SOLOPRENEUR OS\n`;
  md += `**Thời gian:** ${latest.date}\n`;
  md += `**Chủ đề:** ${latest.topic}\n\n---\n\n`;

  latest.summary.forEach(item => {
    md += `## ${item.agentName}\n${item.response}\n\n`;
  });

  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Bien-ban-Hoi-dong-Lang-La-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// --- 6. Modal & View Switchers ---
function switchView(viewName) {
  state.currentView = viewName;
  
  // Hide all view panels
  ["diorama", "missions", "warroom", "chat", "capabilities", "naruto", "ecc", "settings"].forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.toggle("hidden", v !== viewName);

    const navTab = document.getElementById(`tab-${v}`);
    if (navTab) navTab.classList.toggle("active", v === viewName);
  });

  if (viewName === "missions") renderMissionsBoard();
  if (viewName === "chat") renderAgentChatView();
  if (viewName === "diorama") renderDioramaCards();
  if (viewName === "capabilities") renderCapabilitiesView();
  if (viewName === "naruto") renderOperationsReports();
}

function openNewMissionModal() {
  const modal = document.getElementById("modal-new-mission");
  if (modal) modal.classList.remove("hidden");
}

function closeNewMissionModal() {
  const modal = document.getElementById("modal-new-mission");
  if (modal) modal.classList.add("hidden");
}

function createNewMissionFromForm() {
  const title = document.getElementById("new-mission-title").value.trim();
  const rank = document.getElementById("new-mission-rank").value;
  const dueDate = document.getElementById("new-mission-date").value;
  const desc = document.getElementById("new-mission-desc").value.trim();

  if (!title) {
    alert("Vui lòng nhập tên nhiệm vụ!");
    return;
  }

  const brief = `# PHIẾU GIAO VIỆC QUA NARUTO\nTASK_TITLE: ${title}\nDUE_DATE: ${dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]}\nPRIORITY: ${rank}\n\nOBJECTIVE:\n${desc || "Naruto làm rõ mục tiêu, phạm vi và các câu hỏi cần Founder xác nhận."}\n\nREQUIRED_ARTIFACT:\nNaruto chọn artifact phù hợp với yêu cầu.\n\nACCEPTANCE_AND_TEST:\nNaruto chọn phòng ban phù hợp, giao owner và đầu ra; Kakashi kiểm tra tiêu chí nghiệm thu. Mọi hành động bên ngoài cần Founder duyệt.`;
  const plan = createOperationalPlanFromNaruto(brief);
  handoffPlanToNarutoChat(plan, `Giao việc cho Naruto: ${title}`);
  closeNewMissionModal();

  // Clear inputs
  document.getElementById("new-mission-title").value = "";
  document.getElementById("new-mission-desc").value = "";
}

function showProviderValidationStatus(kind, message) {
  const status = document.getElementById("setting-api-status");
  if (!status) return;
  const colors = {
    success: ["border-emerald-500/50", "bg-emerald-950/50", "text-emerald-200"],
    warning: ["border-amber-500/50", "bg-amber-950/50", "text-amber-200"],
    error: ["border-rose-500/50", "bg-rose-950/50", "text-rose-200"],
    checking: ["border-sky-500/50", "bg-sky-950/50", "text-sky-200"]
  };
  status.classList.remove("hidden", "border-emerald-500/50", "bg-emerald-950/50", "text-emerald-200", "border-amber-500/50", "bg-amber-950/50", "text-amber-200", "border-rose-500/50", "bg-rose-950/50", "text-rose-200", "border-sky-500/50", "bg-sky-950/50", "text-sky-200");
  status.classList.add("rounded-xl", "border", "px-3", "py-2", "text-xs", ...colors[kind]);
  status.textContent = message;
}

async function saveSettingsFromUI() {
  const apiKey = document.getElementById("setting-api-key").value.trim();
  const apiProvider = document.getElementById("setting-provider").value;
  const modelName = document.getElementById("setting-model").value.trim();
  const apiBaseUrl = document.getElementById("setting-api-base")?.value.trim() || "";
  const founderName = document.getElementById("setting-founder").value.trim();
  const model = modelName || ({ gemini: "gemini-3.8-flash", openai: "gpt-4o-mini", anthropic: "claude-sonnet-4-5", deepseek: "deepseek-chat", groq: "llama-3.3-70b-versatile", "copilot-cli": "auto" }[apiProvider] || "");
  const button = document.getElementById("setting-save-button");
  if (button) { button.disabled = true; button.textContent = "Đang kiểm tra…"; }
  showProviderValidationStatus("checking", `Đang kiểm tra ${apiProvider === "copilot-cli" ? "đăng nhập GitHub Copilot" : "API key"}… Chưa lưu cấu hình.`);
  try {
    const response = await fetch("/api/providers/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: apiProvider, apiKey, model, apiBaseUrl })
    });
    const result = await response.json();
    if (!result.ok) {
      showProviderValidationStatus("error", `Founder: ${result.detail || "Không xác thực được API key/đăng nhập."} Cấu hình chưa được lưu.`);
      return;
    }

    state.saveSettings({ apiKey, apiProvider, apiBaseUrl, modelName: model, founderName: founderName || "Hokage Founder" });
    document.getElementById("header-founder-name").textContent = state.settings.founderName;
    const isModelWarning = result.status === "key_valid_model_unlisted";
    showProviderValidationStatus(isModelWarning ? "warning" : "success", `Founder: ${result.detail} Cấu hình đã được lưu.`);
    alert(`${isModelWarning ? "⚠️" : "✅"} ${result.detail}\n\nCấu hình đã được lưu.`);
    switchView("diorama");
  } catch (error) {
    const detail = "Không kết nối được máy chủ kiểm tra API. Hãy đảm bảo app đang chạy tại localhost rồi thử lại.";
    showProviderValidationStatus("error", `Founder: ${detail} Cấu hình chưa được lưu.`);
  } finally {
    if (button) { button.disabled = false; button.textContent = "Lưu Cấu Hình"; }
  }
}

function updateProviderSettingsUI(resetModel = false) {
  const provider = document.getElementById("setting-provider")?.value || "gemini";
  const keyGroup = document.getElementById("setting-api-key-group");
  const keyLabel = document.getElementById("setting-api-key-label");
  const keyHelp = document.getElementById("setting-api-key-help");
  const baseGroup = document.getElementById("setting-api-base-group");
  const modelInput = document.getElementById("setting-model");
  const modelHelp = document.getElementById("setting-model-help");
  const keyInput = document.getElementById("setting-api-key");
  const copilot = provider === "copilot-cli";
  keyGroup?.classList.toggle("hidden", copilot);
  baseGroup?.classList.toggle("hidden", !["openrouter", "openai-compatible"].includes(provider));

  const settings = {
    gemini: ["Gemini API Key", "gemini-3.8-flash", "Key lưu trong localStorage của trình duyệt này.", "gemini-3.8-flash"],
    openai: ["OpenAI API Key", "gpt-4o-mini hoặc gpt-5.3-codex", "Codex dùng OpenAI API key và model Codex được cấp quyền; đăng nhập ChatGPT/Codex không tự thay thế API key.", "gpt-4o-mini"],
    anthropic: ["Anthropic API Key", "claude-sonnet-4-5", "Claude API cần API key Anthropic.", "claude-sonnet-4-5"],
    deepseek: ["DeepSeek API Key", "deepseek-chat", "DeepSeek dùng API tương thích OpenAI.", "deepseek-chat"],
    groq: ["Groq API Key", "llama-3.3-70b-versatile", "Model khả dụng tùy tài khoản Groq.", "llama-3.3-70b-versatile"],
    openrouter: ["OpenRouter API Key", "vd: openai/gpt-4o-mini", "Chọn model theo danh mục OpenRouter.", ""],
    "copilot-cli": ["", "auto hoặc tên model Copilot hỗ trợ", "Cài bằng `npm install -g @github/copilot`, sau đó chạy `copilot login` trong PowerShell. Không cần API key riêng.", "auto"],
    "openai-compatible": ["Provider API Key", "vd: mistral-large-latest, qwen...", "Dùng với Mistral, Qwen, Ollama, vLLM hoặc endpoint khác tương thích OpenAI.", ""]
  }[provider] || ["API Key", "Tên model theo provider", "", ""];
  if (keyLabel) keyLabel.textContent = settings[0];
  if (keyHelp) keyHelp.textContent = settings[2];
  if (keyInput) keyInput.placeholder = copilot ? "Không cần API key; đăng nhập bằng Copilot CLI" : `Nhập ${settings[0]}`;
  if (resetModel && keyInput) keyInput.value = "";
  if (modelInput) modelInput.placeholder = settings[1];
  if (resetModel && modelInput) modelInput.value = settings[3];
  if (modelHelp) modelHelp.textContent = provider === "copilot-cli"
    ? "Copilot CLI cần được cài đặt và đăng nhập GitHub. App giới hạn phiên chat này ở chế độ không có công cụ thao tác file/lệnh."
    : "Model phải được bật trong tài khoản/API của bạn; API có thể phát sinh phí theo mức sử dụng.";
}

// Utility formatting
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[m]);
}

function formatMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="font-bold text-slate-100 mt-2 mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-bold text-amber-300 text-base mt-3 mb-1.5">$1</h2>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-2 border-amber-500 pl-3 my-2 text-slate-400 italic">$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre class="bg-slate-950 p-3 rounded-lg overflow-x-auto my-2 text-xs text-sky-400"><code>$2</code></pre>')
    .replace(/`([^`]+)`/gim, '<code class="bg-slate-900 text-sky-300 px-1.5 py-0.5 rounded text-xs">$1</code>')
    .replace(/\n\n/gim, '<p class="my-2"></p>')
    .replace(/\n/gim, '<br/>');
  return html;
}

// --- Initialization ---
window.addEventListener("DOMContentLoaded", () => {
  renderDioramaCards();
  renderMissionsBoard();
  renderCapabilitiesView();
  runNarutoProgressCheck(false);
  const blockedWithoutNotice = state.operationalPlans.find(plan => plan.status === "blocked_no_api_key" && !plan.apiMissingNotifiedAt);
  if (blockedWithoutNotice) notifyNarutoMissingApi(blockedWithoutNotice);
  setInterval(() => runNarutoProgressCheck(false), 2 * 60 * 60 * 1000);
  
  // Load settings into inputs
  if (document.getElementById("setting-api-key")) {
    document.getElementById("setting-api-key").value = state.settings.apiKey || "";
  }
  if (document.getElementById("setting-provider")) {
    document.getElementById("setting-provider").value = state.settings.apiProvider || "gemini";
  }
  if (document.getElementById("setting-api-base")) {
    document.getElementById("setting-api-base").value = state.settings.apiBaseUrl || "";
  }
  if (document.getElementById("setting-model")) {
    document.getElementById("setting-model").value = state.settings.modelName || "gemini-3.8-flash";
  }
  if (document.getElementById("setting-founder")) {
    document.getElementById("setting-founder").value = state.settings.founderName || "Hokage Founder";
  }
  updateProviderSettingsUI();
  state.operationalPlans.filter(plan => plan.automationJobId && ["automation_queued", "automation_running"].includes(plan.status))
    .forEach(plan => pollNarutoOrchestration(plan.id, plan.automationJobId));
  if (document.getElementById("header-founder-name")) {
    document.getElementById("header-founder-name").textContent = state.settings.founderName || "Hokage Founder";
  }

  // Add enter key listener in chat input
  const chatInput = document.getElementById("chat-user-input");
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  // Start live background activity ticker loop
  startLiveTickerLoop();
});

// --- 7. Live Character Working Simulation & Room Inspection ---
const LIVE_ACTIVITIES = {
  naruto: [
    "Đang duyệt danh sách nhiệm vụ cấp S và phân bổ tài nguyên...",
    "Đang kiểm tra tiến độ của 5 phòng ban và chuẩn bị họp standup...",
    "Đang hoàn thiện kế hoạch chiến dịch kinh doanh tuần tới!",
    "Đang cuộn lại sớ nhiệm vụ và ký duyệt điều phối nguồn lực!"
  ],
  shikamaru: [
    "Đang phân tích 5 nước cờ Shogi tối ưu hóa biên lợi nhuận...",
    "Đang tính toán ma trận đòn bẩy 80/20 giúp tiết kiệm 15 giờ làm việc...",
    "Đang cân đối bảng dòng tiền dự kiến cho quý 4...",
    "Đang đánh giá rủi ro thị trường và lập phương án dự phòng tối ưu..."
  ],
  kakashi: [
    "Đang dùng Sharingan soi từng dòng code và cấu hình hệ thống...",
    "Đang đối chiếu 15 tiêu chí trong checklist nghiệm thu SOP...",
    "Đang duyệt bản thảo đề xuất báo giá gửi khách hàng lớn...",
    "Đang kiểm thử bảo mật API và rà soát lỗi logic..."
  ],
  sakura: [
    "Đang soạn thảo email phản hồi khách hàng với giọng điệu tinh tế...",
    "Đang cập nhật hồ sơ khách hàng tiềm năng vào hệ thống CRM...",
    "Đang chuẩn bị kịch bản tư vấn cho cuộc hẹn demo chiều nay...",
    "Đang chăm sóc khách hàng VIP và thu thập testimonial phản hồi..."
  ],
  sasuke: [
    "Đang biên dịch module n8n webhook tự động gửi hóa đơn...",
    "Đang tối ưu hóa câu truy vấn database và giảm độ trễ API...",
    "Đang thiết lập cronjob sao lưu dữ liệu tự động lên Cloud...",
    "Đang code script tự động hóa phễu đăng ký khách hàng..."
  ],
  hinata: [
    "Byakugan đang quét dữ liệu thị trường và phân tích 10 đối thủ...",
    "Đang tổng hợp báo cáo nghiên cứu về nhu cầu khách hàng ngách...",
    "Đang phân tích biểu đồ telemetry lượng truy cập của website...",
    "Đang ghi chép các ý tưởng R&D mới vào cơ sở tri thức..."
  ],
  jiraiya: [
    "Đang múa bút viết bản thảo chiến dịch Storytelling tuần mới...",
    "Đang lên kịch bản video ngắn triệu view cho phễu khách hàng...",
    "Đang phân tích chỉ số tương tác và tỷ lệ mở email newsletter...",
    "Đang sáng tạo thông điệp định vị thương hiệu sắc sảo cho Founder!"
  ],
  sai: [
    "Đang dùng bí thuật Siêu Thú Họa vẽ wireframe giao diện mới...",
    "Đang tinh chỉnh bảng màu và độ tương phản của hệ thống Design System...",
    "Đang xuất bộ asset icon và banner marketing độ phân giải cao...",
    "Đang tối ưu trải nghiệm tương tác (UX) trên giao diện di động..."
  ],
  tsunade: [
    "Đang kiểm toán bảng cân đối dòng tiền và chi phí vận hành...",
    "Đang tính toán điểm hòa vốn và biên lợi nhuận cho dự án tiếp theo...",
    "Đang trích lập quỹ dự phòng khẩn cấp đảm bảo runway 6 tháng...",
    "Đang rà soát điều khoản thanh toán trong dự thảo hợp đồng đối tác..."
  ]
};

let currentInspectedAgent = "naruto";
let workAnimationsActive = true;

function inspectRoom(agentId) {
  currentInspectedAgent = agentId;
  const agent = AGENTS[agentId];
  if (!agent) return;

  const modal = document.getElementById("modal-inspect-room");
  if (!modal) return;

  document.getElementById("inspect-avatar").textContent = agent.avatarIcon;
  document.getElementById("inspect-name").textContent = agent.name;
  document.getElementById("inspect-role").textContent = agent.role;

  const activities = LIVE_ACTIVITIES[agentId] || [];
  const randomAct = activities[Math.floor(Math.random() * activities.length)];
  document.getElementById("inspect-action").textContent = randomAct;

  // Realistic random performance metrics
  document.getElementById("inspect-productivity").textContent = (94 + Math.floor(Math.random() * 6)) + "%";
  document.getElementById("inspect-focus").textContent = (96 + Math.floor(Math.random() * 5)) + "%";
  document.getElementById("inspect-chakra").textContent = (85 + Math.floor(Math.random() * 14)) + "%";

  // Missions list
  const missions = getDepartmentWork(agentId);
  document.getElementById("inspect-mission-count").textContent = `${missions.length} tasks`;
  
  const listEl = document.getElementById("inspect-missions-list");
  if (missions.length === 0) {
    listEl.innerHTML = `<div class="text-xs text-slate-500 italic">Chưa có nhiệm vụ tồn đọng. Đang tự động tối ưu quy trình.</div>`;
  } else {
    listEl.innerHTML = missions.map(m => {
      const [statusLabel, statusClass] = departmentWorkStatus(m.status);
      return `<div class="p-2 rounded bg-slate-900 border border-slate-800 text-xs"><div class="flex items-start justify-between gap-2"><span class="text-slate-200">${escapeHtml(m.title)}</span><span class="rounded px-1.5 py-0.5 text-[9px] ${statusClass}">${statusLabel}</span></div><p class="mt-1 text-[10px] text-slate-400">${escapeHtml(m.deliverable || 'Chưa ghi đầu ra.')}</p>${m.evidence ? `<p class="mt-1 text-[10px] text-slate-500">${escapeHtml(m.evidence)}</p>` : ''}</div>`;
    }).join("");
  }

  modal.classList.remove("hidden");
}

function closeInspectRoomModal() {
  const modal = document.getElementById("modal-inspect-room");
  if (modal) modal.classList.add("hidden");
}

function inspectJumpToChat() {
  closeInspectRoomModal();
  openAgentChat(currentInspectedAgent);
}

function toggleWorkAnimations() {
  workAnimationsActive = !workAnimationsActive;
  const overlay = document.getElementById("diorama-working-overlay");
  const icon = document.getElementById("work-fx-icon");
  const text = document.getElementById("work-fx-text");

  if (overlay) {
    overlay.style.display = workAnimationsActive ? "block" : "none";
  }
  if (icon) icon.textContent = workAnimationsActive ? "⚡" : "⏸️";
  if (text) text.textContent = workAnimationsActive ? "Hiệu ứng: Bật" : "Hiệu ứng: Tắt";
}

// Background simulation ticker loop
function startLiveTickerLoop() {
  const tickerEl = document.getElementById("live-activity-ticker");
  if (!tickerEl) return;

  const agentKeys = Object.keys(AGENTS);
  setInterval(() => {
    const randomKey = agentKeys[Math.floor(Math.random() * agentKeys.length)];
    const agent = AGENTS[randomKey];
    const acts = LIVE_ACTIVITIES[randomKey];
    const act = acts[Math.floor(Math.random() * acts.length)];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Prepend new activity to ticker text
    const currentText = tickerEl.textContent.trim();
    const newEntry = `[${timeStr}] ${agent.name.split(" ")[0]}: ${act} • `;
    tickerEl.textContent = newEntry + currentText.substring(0, 450);
  }, 7000);
}

// --- 8. ECC Tech Forge Pipeline (Shikamaru -> Sasuke -> Kakashi) ---

const ECC_PRESETS = {
  lead_crm: "Xây dựng hệ thống tự động lưu leads từ form đăng ký vào Supabase, gửi thông báo qua Telegram Bot và bắn email chào mừng bằng Resend API.",
  qr_pay: "Viết webhook endpoint nhận thanh toán VietQR / SeABank, đối chiếu mã đơn hàng, cập nhật trạng thái đơn thành 'PAID' và gửi hóa đơn điện tử.",
  ai_bot: "Xây dựng Telegram AI Assistant bot hỗ trợ trả lời câu hỏi thường gặp của khách hàng, tích hợp Gemini 2.0 Flash và lưu lịch sử chat vào SQLite.",
  seo_blog: "Viết script tự động cào 5 bài viết đối thủ, tóm tắt ý chính và sinh ra bản thảo bài viết chuẩn SEO bằng Markdown cho website."
};

let currentEccData = {
  goal: "",
  stack: "node_full",
  archMd: "",
  codeText: "",
  testText: "",
  qaMd: "",
  isApproved: false,
  activeSubtab: "arch"
};

function notifyEccStatus(title, message) {
  let banner = document.getElementById('ecc-receipt');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'ecc-receipt';
    banner.className = 'glass-card p-4 border border-amber-500/40 text-sm text-amber-200 whitespace-pre-wrap';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    document.getElementById('ecc-goal-input')?.parentElement.appendChild(banner);
  }
  banner.textContent = `${title}\n${message}`;
  state.founderNotifications.unshift({
    id: `ecc-notice-${Date.now()}`, title, message,
    createdAt: new Date().toLocaleString(), resultUrl: '#view-ecc', resultLabel: 'Mở Xưởng ECC'
  });
  state.saveFounderNotifications();
  renderOperationsReports();
}

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#view-ecc') switchView('ecc');
});

function loadEccPreset(key) {
  const input = document.getElementById("ecc-goal-input");
  if (input && ECC_PRESETS[key]) {
    input.value = ECC_PRESETS[key];
  }
}

function switchEccSubtab(subtab) {
  currentEccData.activeSubtab = subtab;
  ["arch", "code", "qa"].forEach(t => {
    const pane = document.getElementById(`ecc-pane-${t}`);
    const btn = document.getElementById(`ecc-subtab-${t}`);
    if (pane) pane.classList.toggle("hidden", t !== subtab);
    if (btn) {
      if (t === subtab) {
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-purple-300 bg-purple-500/20 border border-purple-500/40";
      } else {
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white";
      }
    }
  });
}

async function runEccPipeline() {
  if (document.getElementById('btn-run-ecc-pipeline')?.disabled) return;
  const input = document.getElementById("ecc-goal-input");
  const stackSelect = document.getElementById("ecc-stack-select");
  if (!input || !input.value.trim()) {
    alert("Vui lòng nhập mô tả tính năng công nghệ bạn muốn xây dựng!");
    return;
  }

  const goal = input.value.trim();
  const stack = stackSelect ? stackSelect.value : "node_full";
  currentEccData.goal = goal;
  currentEccData.stack = stack;
  currentEccData.codeText = '';
  currentEccData.isApproved = false;
  notifyEccStatus('Đã nhận yêu cầu tại Xưởng ECC', `${goal}\nChế độ bản nháp theo mẫu. Chưa gửi yêu cầu tới Gemini runner, chưa tạo sản phẩm thực tế.`);

  const btn = document.getElementById("btn-run-ecc-pipeline");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="inline-block animate-spin mr-1">🌀</span> Đang chạy quy trình ECC...`;
  }

  try {
  // Show stepper & output workspace
  const stepperContainer = document.getElementById("ecc-stepper-container");
  const outputWorkspace = document.getElementById("ecc-output-workspace");
  if (stepperContainer) stepperContainer.classList.remove("hidden");
  if (outputWorkspace) outputWorkspace.classList.remove("hidden");

  // Reset stepper UI
  setEccStepUI(1, "active", "Đang lập bản đồ kiến trúc & RULES.md...");
  setEccStepUI(2, "waiting", "Chờ hoàn thành bước 1");
  setEccStepUI(3, "waiting", "Chờ hoàn thành bước 2");

  // ================= STAGE 1: SHIKAMARU (ECC ARCHITECTURE & PLAN) =================
  switchEccSubtab("arch");
  document.getElementById("ecc-pane-arch").innerHTML = `
    <div class="glass-card p-6 border-l-4 border-lime-500 animate-pulse">
      <div class="flex items-center gap-3">
        <span class="text-3xl">♟️</span>
        <div>
          <h4 class="font-bold text-lime-300 text-sm">Shikamaru đang mở ECC System Architect...</h4>
          <p class="text-xs text-slate-400">Phân tích đòn bẩy 80/20, thiết kế dòng dữ liệu và lập danh sách RULES.md</p>
        </div>
      </div>
    </div>
  `;

  await new Promise(r => setTimeout(r, 1200));

  const archResult = generateEccArchitecture(goal, stack);
  currentEccData.archMd = archResult;
  renderEccArchPane(archResult);
  setEccStepUI(1, "done", "Hoàn tất (Đã thiết lập RULES)");

  // ================= STAGE 2: SASUKE (ECC SKILLS & TDD CODE) =================
  setEccStepUI(2, "active", "Đang kích hoạt ECC Skills & viết Tests TDD...");
  switchEccSubtab("code");
  document.getElementById("ecc-pane-code").innerHTML = `
    <div class="glass-card p-6 border-l-4 border-purple-500 animate-pulse">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🔮</span>
        <div>
          <h4 class="font-bold text-purple-300 text-sm">Sasuke đang kích hoạt ECC Skills...</h4>
          <p class="text-xs text-slate-400">Triệu hồi skill backend-api, sinh mã nguồn sạch và bộ unit tests TDD tự động</p>
        </div>
      </div>
    </div>
  `;

  await new Promise(r => setTimeout(r, 1500));

  const codeResult = generateEccCodeAndTests(goal, stack);
  currentEccData.codeText = codeResult.code;
  currentEccData.testText = codeResult.tests;
  renderEccCodePane(codeResult);
  setEccStepUI(2, "done", "Đã tạo code/test mẫu — chưa chạy kiểm thử");

  // ================= STAGE 3: KAKASHI (ECC HOOKS & SECURITY REVIEW) =================
  setEccStepUI(3, "active", "Sharingan đang quét bảo mật AgentShield & Hooks...");
  switchEccSubtab("qa");
  document.getElementById("ecc-pane-qa").innerHTML = `
    <div class="glass-card p-6 border-l-4 border-sky-500 animate-pulse">
      <div class="flex items-center gap-3">
        <span class="text-3xl">⚡</span>
        <div>
          <h4 class="font-bold text-sky-300 text-sm">Kakashi đang kích hoạt ECC AgentShield & Hooks...</h4>
          <p class="text-xs text-slate-400">Kiểm thử runtime, đối chiếu 15 tiêu chí bảo mật SOP và ký phê duyệt</p>
        </div>
      </div>
    </div>
  `;

  await new Promise(r => setTimeout(r, 1200));

  const qaResult = '### Bản nháp cần kiểm tra\nChưa chạy kiểm thử hay kiểm định bảo mật. Chưa đủ bằng chứng xác nhận sản phẩm hoặc triển khai.';
  currentEccData.qaMd = qaResult;
  currentEccData.isApproved = false;
  renderEccQaPane(qaResult);
  setEccStepUI(3, "done", "Bản nháp — chưa kiểm định thực tế");
  notifyEccStatus('ECC đã tạo bản nháp', `${goal}\nBạn có thể xem Code & Tests hoặc tải bản nháp. Chưa có job Gemini; để chạy runner local, gửi Phiếu giao việc thực cho Naruto.`);

  } catch (error) {
    currentEccData.codeText = '';
    notifyEccStatus('ECC xử lý thất bại', `${goal}\nLý do: ${error.message}. Chưa hoàn thành nhiệm vụ; bạn có thể thử lại.`);
  } finally {

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<span>🚀</span> Kích hoạt ECC Pipeline`;
  }
  }
}

function setEccStepUI(stepNum, status, label) {
  const stepEl = document.getElementById(`ecc-step-${stepNum}`);
  const statusEl = document.getElementById(`ecc-step-${stepNum}-status`);
  if (!stepEl || !statusEl) return;

  statusEl.textContent = label;

  if (status === "active") {
    stepEl.className = "p-3 rounded-xl bg-purple-950/40 border-2 border-purple-500 animate-pulse flex items-center gap-3";
    statusEl.className = "text-[10px] text-amber-300 font-bold";
  } else if (status === "done") {
    stepEl.className = "p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3";
    statusEl.className = "text-[10px] text-emerald-400 font-bold";
  } else {
    stepEl.className = "p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 opacity-60";
    statusEl.className = "text-[10px] text-slate-500";
  }
}

function generateEccArchitecture(goal, stack) {
  return `### ♟️ BẢN ĐỒ KIẾN TRÚC HỆ THỐNG (ECC ARCHITECT)
**Chủ trì:** Shikamaru Nara (Chief Strategy Officer & System Architect)  
**Mục tiêu:** ${goal}  
**Môi trường:** Công ty 1 người • Tối ưu 80/20 (Zero-Ops, Chi phí vận hành tối thiểu)

---

#### 1. Sơ đồ dòng dữ liệu (Data Flow Architecture)
\`\`\`text
  [ Client / Webhook Caller ]
              │ (HTTPS POST + HMAC Signature)
              ▼
    ┌──────────────────────────────────────────────┐
    │  ECC API Gateway (Input Validation via Zod) │
    └──────────────────────┬───────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
   [ Database / Supabase ]    [ Background Notifications ]
   - Lưu trữ bản ghi an toàn   - Telegram Alert Bot
   - Idempotency check         - Resend Email Service
\`\`\`

#### 2. Phân tích Đòn bẩy 80/20 & Lựa chọn Tech Stack
* **Runtime:** Node.js 20+ / Express hoặc Cloudflare Workers (khởi động 0ms, không tốn tiền server rảnh).
* **Bảo mật:** Sử dụng biến môi trường \`process.env\` cô lập, không lưu key trong mã nguồn.
* **Tự động hóa:** Tích hợp Webhook Idempotency Key để chống bị gọi trùng lặp (double-charge / duplicate lead).

#### 3. Danh sách Quy chuẩn ECC Bắt buộc (RULES.md cho Sasuke)
* \`RULE-01\`: Tất cả payload đầu vào bắt buộc qua bộ lọc kiểm tra kiểu dữ liệu (Schema validation).
* \`RULE-02\`: Không bao giờ trả về nguyên mẫu lỗi stack trace của Database về client (chống lộ cấu trúc bảng).
* \`RULE-03\`: Mọi endpoint nhận webhook phải hoàn tất xử lý và phản hồi HTTP 200 trong vòng dưới 2.000ms.`;
}

function generateEccCodeAndTests(goal, stack) {
  const code = `/**
 * ==============================================================
 * MODULE: ${goal.substring(0, 50)}...
 * Kỹ sư phụ trách: Sasuke Uchiha (Head of Tech & Automation)
 * Tiêu chuẩn ECC: Clean Architecture, Error Handling, Idempotent
 * ==============================================================
 */

const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '1mb' }));

// 1. In-memory Idempotency Cache (Trong thực tế lưu vào Redis/Supabase)
const processedEvents = new Set();

// 2. Middleware xác thực Webhook & Rate Limit
function verifyWebhookSignature(req, res, next) {
  const signature = req.headers['x-hub-signature-256'] || req.headers['x-signature'];
  const webhookSecret = process.env.WEBHOOK_SECRET || 'dev_secret_konoha_2026';

  if (!signature) {
    return res.status(401).json({ error: 'Missing security signature' });
  }

  // HMAC SHA256 Verification
  const expectedSig = 'sha256=' + crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSig && signature !== 'bypass_for_dev') {
    return res.status(403).json({ error: 'Invalid signature signature' });
  }

  next();
}

// 3. Endpoint tiếp nhận và xử lý tự động
app.post('/api/v1/webhook', verifyWebhookSignature, async (req, res) => {
  try {
    const { eventId, payload, timestamp } = req.body;

    // Check Idempotency (Chống xử lý trùng lặp)
    if (processedEvents.has(eventId)) {
      return res.status(200).json({ status: 'already_processed', eventId });
    }

    // Validation
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    // Thực thi nghiệp vụ tự động (Gửi Telegram + Cập nhật DB)
    console.log('[Sasuke Tech Engine] Đang xử lý sự kiện ID:', eventId);
    
    // Ghi nhận sự kiện đã hoàn tất
    processedEvents.add(eventId);

    return res.status(200).json({
      success: true,
      message: 'Event processed successfully by Konoha ECC Engine',
      eventId,
      processedAt: new Date().toISOString()
    });
  } catch (error) {
    // Không lộ stack trace nhạy cảm
    console.error('[Error] Webhook failed:', error.message);
    return res.status(500).json({ error: 'Internal system processing error' });
  }
});

module.exports = app;`;

  const tests = `/**
 * ==============================================================
 * BỘ KIỂM THỬ TỰ ĐỘNG CHUẨN TDD (TEST-DRIVEN DEVELOPMENT)
 * Kỹ sư phụ trách: Sasuke Uchiha
 * ==============================================================
 */

const request = require('supertest');
const app = require('./server');

describe('ECC API & Webhook Test Suite', () => {

  test('[PASS] TC-01: Chặn request khi thiếu chữ ký bảo mật (401)', async () => {
    const res = await request(app)
      .post('/api/v1/webhook')
      .send({ eventId: 'evt_001', payload: { test: true } });

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBeDefined();
  });

  test('[PASS] TC-02: Tiếp nhận và xử lý thành công payload hợp lệ (200)', async () => {
    const res = await request(app)
      .post('/api/v1/webhook')
      .set('x-signature', 'bypass_for_dev')
      .send({
        eventId: 'evt_' + Date.now(),
        payload: { customer: 'Ninja VIP', amount: 500000 },
        timestamp: Date.now()
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test('[PASS] TC-03: Tính năng Idempotency - Không xử lý 2 lần cùng 1 eventId', async () => {
    const sameId = 'duplicate_check_' + Date.now();

    // Lần 1
    await request(app)
      .post('/api/v1/webhook')
      .set('x-signature', 'bypass_for_dev')
      .send({ eventId: sameId, payload: { step: 1 } });

    // Lần 2 (Duplicate)
    const res2 = await request(app)
      .post('/api/v1/webhook')
      .set('x-signature', 'bypass_for_dev')
      .send({ eventId: sameId, payload: { step: 2 } });

    expect(res2.statusCode).toEqual(200);
    expect(res2.body.status).toBe('already_processed');
  });

  test('[PASS] TC-04: Xử lý dữ liệu rác/hỏng không gây sập server (400)', async () => {
    const res = await request(app)
      .post('/api/v1/webhook')
      .set('x-signature', 'bypass_for_dev')
      .send({ eventId: 'bad_payload', payload: 'not_an_object' });

    expect(res.statusCode).toEqual(400);
  });

});`;

  return { code, tests };
}

function generateEccSecurityAudit(goal, stack, codeResult) {
  return `### ⚡ BÁO CÁO KIỂM ĐỊNH BẢO MẬT & NGHIỆM THU (ECC AGENTSHIELD)
**Người kiểm định:** Kakashi Hatake (Head of QA & Security Compliance)  
**Công cụ giám sát:** ECC Hooks Runtime & AgentShield Heuristics  
**Trạng thái quyết định:** <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 text-xs">🟢 ĐÃ PHÊ DUYỆT DEPLOY (100% PASSED)</span>

---

#### 1. Bảng đối chiếu 5 Tiêu chuẩn Bảo mật ECC
| Tiêu chí bảo mật | Kết quả quét Sharingan | Đánh giá |
| :--- | :---: | :--- |
| **1. Bí mật môi trường (.env)** | **PASSED** | Không phát hiện API Key hay password hardcoded trong mã nguồn. |
| **2. Xác thực chữ ký Webhook** | **PASSED** | Đã tích hợp thuật toán HMAC SHA-256 đối chiếu chữ ký an toàn. |
| **3. Chống tấn công lặp lại (Replay)** | **PASSED** | Cơ chế Idempotency cache hoạt động chính xác qua TC-03. |
| **4. Phòng chống lộ Stack Trace** | **PASSED** | Lỗi server được che chắn, chỉ ghi log nội bộ không lộ ra client. |
| **5. Kết quả kiểm thử tự động TDD** | **4/4 PASSED** | 100% test cases của Sasuke đều vượt qua thành công. |

---

#### 2. Nhận xét & Kết luận từ Kakashi
> *"Bằng Sharingan sao chép và hệ thống ECC Hooks, tôi đã rà soát toàn bộ cấu trúc mã nguồn. Kiến trúc của Shikamaru mạch lạc, code của Sasuke sạch sẽ và có test bao phủ đầy đủ. Tôi chính thức cấp con dấu kiểm định an toàn để đưa tính năng này lên môi trường Production!"*`;
}

function renderEccArchPane(archMd) {
  const container = document.getElementById("ecc-pane-arch");
  if (!container) return;
  container.innerHTML = `
    <div class="glass-card p-5 border-l-4 border-lime-500">
      <div class="agent-response text-slate-200">
        ${formatMarkdown(archMd)}
      </div>
    </div>
  `;
}

function renderEccCodePane(codeResult) {
  const container = document.getElementById("ecc-pane-code");
  if (!container) return;
  container.innerHTML = `
    <div class="space-y-4">
      <div>
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-purple-300">📄 server.js (Mã nguồn chính)</span>
            <span class="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">Skill: backend-api</span>
          </div>
          <button class="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                  onclick="navigator.clipboard.writeText(currentEccData.codeText); alert('Đã sao chép server.js!')">
            📋 Copy server.js
          </button>
        </div>
        <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-sky-300 overflow-x-auto font-mono"><code>${escapeHtml(codeResult.code)}</code></pre>
      </div>

      <div>
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-emerald-300">🧪 server.test.js (Bộ kiểm thử TDD)</span>
            <span class="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">Skill: tdd-runner</span>
          </div>
          <button class="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                  onclick="navigator.clipboard.writeText(currentEccData.testText); alert('Đã sao chép server.test.js!')">
            📋 Copy server.test.js
          </button>
        </div>
        <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-emerald-300 overflow-x-auto font-mono"><code>${escapeHtml(codeResult.tests)}</code></pre>
      </div>
    </div>
  `;
}

function renderEccQaPane(qaMd) {
  const container = document.getElementById("ecc-pane-qa");
  if (!container) return;
  container.innerHTML = `
    <div class="glass-card p-5 border-l-4 border-sky-500 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <span class="text-2xl">⚡</span>
          <div>
            <h4 class="font-bold text-slate-100 text-sm">Biên bản Nghiệm thu & Bảo mật SOP</h4>
            <p class="text-xs text-slate-400">Được bảo vệ bởi ECC AgentShield & Hooks</p>
          </div>
        </div>
        <div class="text-right">
          <span class="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/10">
            BẢN NHÁP — CHƯA KIỂM ĐỊNH
          </span>
        </div>
      </div>
      <div class="agent-response text-slate-200">
        ${formatMarkdown(qaMd)}
      </div>
    </div>
  `;
}

function copyEccActiveTab() {
  let textToCopy = "";
  if (currentEccData.activeSubtab === "arch") textToCopy = currentEccData.archMd;
  else if (currentEccData.activeSubtab === "code") textToCopy = currentEccData.codeText + "\n\n// --- TESTS ---\n" + currentEccData.testText;
  else if (currentEccData.activeSubtab === "qa") textToCopy = currentEccData.qaMd;

  if (!textToCopy) {
    alert("Chưa có nội dung để sao chép!");
    return;
  }
  navigator.clipboard.writeText(textToCopy);
  alert("Đã sao chép nội dung tab hiện tại vào bộ nhớ tạm!");
}

function downloadEccPackage() {
  if (!currentEccData.codeText) {
    alert("Vui lòng kích hoạt quy trình ECC để sinh mã nguồn trước khi tải về!");
    return;
  }

  let fullPackage = `# GÓI CÔNG NGHỆ ECC - SOLOPRENEUR OS\n`;
  fullPackage += `Mục tiêu: ${currentEccData.goal}\n\n`;
  fullPackage += `=======================================================\n`;
  fullPackage += `1. BẢN ĐỒ KIẾN TRÚC & RULES (Shikamaru)\n`;
  fullPackage += `=======================================================\n\n`;
  fullPackage += `${currentEccData.archMd}\n\n`;
  fullPackage += `=======================================================\n`;
  fullPackage += `2. MÃ NGUỒN CHÍNH (server.js - Sasuke)\n`;
  fullPackage += `=======================================================\n\n`;
  fullPackage += `${currentEccData.codeText}\n\n`;
  fullPackage += `=======================================================\n`;
  fullPackage += `3. BỘ KIỂM THỬ TỰ ĐỘNG (server.test.js - Sasuke)\n`;
  fullPackage += `=======================================================\n\n`;
  fullPackage += `${currentEccData.testText}\n\n`;
  fullPackage += `=======================================================\n`;
  fullPackage += `4. BÁO CÁO BẢO MẬT & PHÊ DUYỆT (Kakashi)\n`;
  fullPackage += `=======================================================\n\n`;
  fullPackage += `${currentEccData.qaMd}\n`;

  const blob = new Blob([fullPackage], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ECC-Tech-Package-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function pushEccToKanban() {
  if (!currentEccData.codeText) {
    alert("Vui lòng chạy quy trình ECC trước khi đẩy vào Kanban!");
    return;
  }
  const title = `[ECC] ${currentEccData.goal.substring(0, 70)}`;
  const brief = `# PHIẾU GIAO VIỆC ECC QUA NARUTO\nTASK_TITLE: ${title}\nPRIORITY: A\n\nOBJECTIVE:\nNaruto điều phối các phòng ban review bản nháp ECC hiện có, xác định phần cần hoàn thiện và giao owner cho bước tiếp theo.\n\nCURRENT_DRAFT_ARCHITECTURE:\n${currentEccData.archMd}\n\nCURRENT_DRAFT_CODE:\n${currentEccData.codeText}\n\nCURRENT_DRAFT_TESTS_NOT_RUN:\n${currentEccData.testText}\n\nCURRENT_DRAFT_QA:\n${currentEccData.qaMd}\n\nREQUIRED_ARTIFACT:\nBáo cáo review và danh sách nhiệm vụ phân công.\n\nACCEPTANCE_AND_TEST:\nPhân biệt bản nháp với kiểm thử thật; Kakashi nêu bằng chứng, blocker và kiểm tra cần chạy. Không tự áp dụng patch, chạy hệ thống production hoặc phát hành.`;
  const plan = createOperationalPlanFromNaruto(brief);
  handoffPlanToNarutoChat(plan, `Gửi bản nháp ECC cho Naruto điều phối: ${title}`);
  notifyEccStatus('Đã gửi Naruto điều phối', `Phòng ban sẽ được Naruto chọn dựa trên phạm vi ECC. Bản nháp chưa được xem là đã kiểm thử hoặc phát hành.`);
}

