# 🏯 KONOHA SOLOPRENEUR OS

## 🍥 Điều phối công việc qua Naruto

Mọi nhiệm vụ thực đi qua Naruto trước. Naruto phân tích brief, chọn tối đa năm phòng ban chuyên môn phù hợp, giao đầu việc và đầu ra cho từng phòng ban; Kakashi luôn làm cổng QA cuối. App, web và mã nguồn được giao cho Sasuke xây dựng sau khi có đầu vào chuyên môn phù hợp. Kế hoạch, các phòng ban được giao, tiến độ, blocker và kết quả được ghi ở **Báo cáo Tiến độ**.

Phiếu giao việc, lệnh công việc trong chat Naruto, yêu cầu công việc gửi ở chat phòng ban, nhiệm vụ mới từ Kanban, việc đẩy từ Xưởng ECC và follow-up từ Hội đồng đều được chuyển qua Naruto. Chat phòng ban vẫn có thể dùng để hỏi tư vấn; yêu cầu thực hiện sẽ được chuyển sang Naruto.

Để chạy AI thật, chọn nhà cung cấp và model tại **Cài đặt AI**, nhập API key rồi lưu để app xác thực. GitHub Copilot cần đăng nhập CLI bằng `copilot login`. Thiếu key/đăng nhập thì job ở trạng thái bị chặn, không tạo artifact giả. API key được gửi qua localhost khi tạo job và không ghi vào hồ sơ job. Không gửi key trong chat.

App artifact được lưu trong `deliveries/<job-id>/`; các đầu ra khác được tổng hợp trong `REPORT.md`. Job kết thúc ở `needs_founder_product_confirmation` hoặc `blocked_qa`; Founder vẫn là người xác nhận cuối cùng. Các API provider có thể tính phí hoặc giới hạn quota.

### Runner nền Naruto

Server xử lý job theo hàng đợi tuần tự, nên có thể đóng tab trình duyệt trong lúc job đang chạy. Lỗi provider tạm thời (429, 5xx hoặc lỗi mạng) được thử lại tối đa 3 lần, với thời gian chờ tăng dần. Server lưu báo cáo kiểm tra tiến độ mỗi 2 giờ cho job đang hoạt động; mở lại Báo cáo Tiến độ để xem. Khi hàng đợi trống, Naruto chờ Founder giao việc mới và không tự tạo task.

### Skill tái sử dụng cho Agent Harness

Sáu Codex Skill dùng chung nằm trong `.agents/skills/`: `task-brief-routing`, `evidence-first-research`, `short-video-content-pack`, `build-and-verify`, `independent-qa`, và `campaign-metrics`. `app.js` gắn skill phù hợp vào prompt từng phòng ban; `AGENTS.md` định tuyến công việc Codex. Đây là hướng dẫn tái sử dụng, không phải worker chạy nền độc lập.

Runner chỉ hoạt động khi tiến trình `node server.js` còn chạy. Sau khi Windows hoặc server khởi động lại, job đang chạy được đánh dấu `interrupted` vì API key không được lưu để tự tiếp tục; hãy gửi lại task qua Naruto. Tiến độ hai giờ là báo cáo nội bộ trong app, không gửi thông báo ra ngoài.
### Hệ Điều Hành Công Ty 1 Người với 9 AI Agents Làng Lá (3 Tầng Trụ Sở)

Ứng dụng web điều hành doanh nghiệp cá nhân (Solopreneur) toàn diện được thiết kế và nhân bản trực tiếp từ **Trụ sở Làng Lá 3 tầng 9 phòng ban**:

#### 🏛️ Tầng 3 (Executive, Creative & Finance)
1. **✍️ Jiraiya (Hiền nhân Cóc)** — *Trưởng ban Marketing & Sáng tạo Nội dung (Chief Marketing & Storyteller)*
2. **💰 Tsunade Senju (Hokage Đệ Ngũ)** — *Giám đốc Tài chính & Quản trị Rủi ro (Chief Financial Officer - CFO)*
3. **🎨 Sai (Họa sư Làng Lá)** — *Trưởng ban Thiết kế & Nhận diện Thương hiệu (Head of Design & Branding)*

#### ⚔️ Tầng 2 (Strategy, Operations & Engineering)
4. **🍥 Naruto Uzumaki** — *Trưởng ban Điều hành & Tác chiến (Operations & Daily Execution - COO)*
5. **♟️ Shikamaru Nara** — *Giám đốc Chiến lược & Dòng tiền (Chief Strategy Officer - CSO)*
6. **🔮 Sasuke Uchiha** — *Kỹ sư Trưởng Công nghệ & Tự động hoá (Head of Tech & Automation - CTO)*

#### 🛡️ Tầng 1 (Client Relations, QA Gate & Market Intel)
7. **🌸 Sakura Haruno** — *Trưởng ban Quan hệ Khách hàng & CRM (Head of Client Relations)*
8. **⚡ Kakashi Hatake** — *Trưởng ban Kiểm định Chất lượng & SOP (Head of QA & Review)*
9. **👁️ Hinata Hyuga** — *Trưởng ban Nghiên cứu Thị trường & Dữ liệu (Head of Market Intel & Research)*

---

## 🚀 Cách khởi chạy ứng dụng

### Chạy đầy đủ với Node.js
Trong thư mục repository, chạy:
```bash
npm ci
npm start
```
Sau đó truy cập: **`http://localhost:3001`**.

Mở trực tiếp `index.html` hoặc dùng GitHub Pages chỉ phục vụ giao diện tĩnh; API, runner AI và lịch Naruto cần Node.js backend đang chạy. GitHub Pages không làm backend chạy 24/7.

---

## 🎯 Các tính năng cốt lõi

### 1. 🏢 Trụ sở 3D Cutaway Làng Lá (3 Tầng 9 Phòng Ban)
- Hiển thị trực quan toàn bộ 9 phòng ban qua góc nhìn Isometric 3D (Tầng 3: Marketing/Finance/Design, Tầng 2: Ops/Strategy/Tech, Tầng 1: CRM/QA/Intel).
- Hiệu ứng nhân vật làm việc trực tiếp (đèn server nhấp nháy, quạt gió, aura chakra, chim mực bay, cuộn sớ chuyển động, sonar Byakugan).
- Bấm vào từng phòng để xem số lượng nhiệm vụ đang xử lý và vào phòng chat riêng với Trưởng phòng đó.

### 2. 🌀 Hội đồng Làng Lá (Council War Room)
- Nhập bất kỳ mục tiêu kinh doanh lớn nào (ví dụ: *Ra mắt dịch vụ mới, tối ưu bảng giá, tự động hóa phễu bán hàng*).
- Cả 9 AI Agents sẽ cùng tham gia họp tuần tự, đưa ra góc nhìn chuyên môn đa chiều (Nghiên cứu -> Chiến lược -> Dòng tiền -> Marketing -> Thiết kế UI/UX -> Công nghệ -> Kiểm định SOP -> Chăm sóc khách hàng -> Điều phối).
- Tự động sinh nhiệm vụ gắn vào Kanban và cho phép **Xuất Biên bản Họp ra file Markdown** để lưu vào Obsidian / Notion.

### 3. 📜 Bảng Nhiệm Vụ Ninja (Kanban Mission Board)
- Phân loại nhiệm vụ chuẩn cấp bậc Ninja:
  - **🔴 Cấp S (S-Rank):** Mục tiêu sống còn, quyết định doanh thu lớn.
  - **🟠 Cấp A (A-Rank):** Chiến lược then chốt, sản phẩm cốt lõi.
  - **🟡 Cấp B (B-Rank):** Tự động hóa, tối ưu quy trình.
  - **🟢 Cấp C (C-Rank):** Nội dung, chăm sóc khách hàng.
  - **🔵 Cấp D (D-Rank):** Nhiệm vụ vụn vặt thường nhật.
- 4 cột tiến độ: *Chờ xử lý (Backlog)* ➔ *Đang triển khai* ➔ *Kakashi kiểm định (QA)* ➔ *Hoàn thành*.

### 4. 💬 Trò chuyện 1-on-1 với từng AI Agent
- Mỗi nhân vật có System Prompt riêng mang đậm cá tính, góc nhìn nghiệp vụ sắc bén.
- Lưu lại toàn bộ lịch sử trò chuyện cục bộ trên máy (`localStorage`).

### 5. ⚡ Xưởng Công Nghệ ECC (Bộ Ba Kỹ Thuật Làng Lá)
- Tích hợp chuẩn quy trình phát triển phần mềm **ECC (Everything Claude Code)** cho Solopreneur:
  - **Giai đoạn 1 (Shikamaru):** Phân tích đòn bẩy 80/20, lập sơ đồ dòng dữ liệu và thiết lập `RULES.md`.
  - **Giai đoạn 2 (Sasuke):** Kích hoạt các ECC Skills (`backend-api`, `tdd-runner`) để sinh mã nguồn sạch và bộ kiểm thử tự động chuẩn TDD.
  - **Giai đoạn 3 (Kakashi):** Kích hoạt ECC AgentShield & Hooks để quét bảo mật, kiểm thử runtime và ký quyết định phê duyệt Deploy lên Production.
  - Hỗ trợ tải toàn bộ gói mã nguồn (`.md`, `.js`) hoặc tự động đẩy nhiệm vụ sẵn sàng deploy vào Bảng Kanban.

---

## ⚙️ Cấu hình AI & API Key

Vào mục **Cài đặt (⚙️)** ở góc trên bên phải:
- Chọn Gemini, OpenAI/Codex, Anthropic, DeepSeek, Groq, OpenRouter, API tương thích OpenAI hoặc GitHub Copilot.
- Nút lưu sẽ kiểm tra key/đăng nhập trước khi xác nhận cấu hình. Nếu key sai, thiếu quyền, hết quota hoặc provider không kết nối được, app báo trạng thái và không lưu cấu hình đó.
- Khi chưa có API key hoặc Copilot login, hội thoại có thể dùng mô phỏng; job thực sẽ bị chặn và báo Founder, không được xem là đã chạy AI thật.

## Tự động hóa chiến dịch TikTok

Chạy `start.bat` hoặc `npm start`; mở mục **Naruto Điều phối** để xem thẻ **TikTok · @cinetech.ai**. Server lưu kế hoạch 10 ngày, trạng thái từng video, follower Founder đọc lại và nhật ký kiểm tra tại `.automation-jobs/tiktok-campaign.json`.

- Naruto ghi báo cáo tiến độ mỗi 2 giờ khi server local đang chạy. Sau khi server khởi động lại, monitor tiếp tục từ mốc đã lưu.
- Cập nhật follower chỉ sau khi đọc số trên hồ sơ TikTok; app ghi nguồn là Founder read-back và không gọi TikTok Analytics API.
- Trạng thái bài có thể ghi là đã dựng, đã duyệt, đã tải nhưng chưa xác minh, hoặc đã đăng có URL đọc lại. Ghi “đã đăng” yêu cầu URL video TikTok thuộc `@cinetech.ai`.
- Thẻ của từng phòng ban trên trang Trụ sở hiển thị toàn bộ đầu việc liên quan, trạng thái, đầu ra và ghi chú; phần chi tiết có thể mở ngay trên thẻ.
- Lịch đăng dùng Asia/Bangkok, từ 11 đến 20/11/2026. Giờ đăng là giả thuyết để theo dõi; không đảm bảo đạt 1.000 follower.
- Ứng dụng không tự đăng, bình luận, nhắn tin, mua quảng cáo, hoặc tạo số liệu. Upload và công bố vẫn qua TikTok Studio và cần Founder duyệt.
- Dữ liệu `.automation-jobs`, `.copilot-data`, `.git`, `node_modules` và `.env*` bị chặn khỏi static web server.

