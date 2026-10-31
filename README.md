# 🏯 KONOHA SOLOPRENEUR OS
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

### Cách 1: Chạy trực tiếp (Không cần cài đặt)
Mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Google Chrome, Microsoft Edge, Safari, Firefox).

### Cách 2: Chạy với Node.js Server (Khuyên dùng)
Mở Terminal / PowerShell tại thư mục `D:\Demo` và chạy lệnh:
```bash
node server.js
```
Hoặc:
```bash
npm start
```
Sau đó truy cập: **`http://localhost:3000`**

### Cách 3: Chạy với Python
```bash
python -m http.server 3000
```

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
- **Chế độ Không cần API Key (Offline Simulator):** Mặc định ứng dụng đã tích hợp sẵn bộ não giả lập thông minh bám sát nghiệp vụ Solopreneur. Bạn có thể sử dụng ngay mà không tốn 1 xu chi phí!
- **Chế độ Real AI (Khuyên dùng):**
  - Nhập **Google Gemini API Key** (Lấy miễn phí tại [Google AI Studio](https://aistudio.google.com)).
  - Hoặc nhập **OpenAI API Key**.
  - Các Agent sẽ phân tích và trả lời theo thời gian thực với trí tuệ nhân tạo đỉnh cao!

