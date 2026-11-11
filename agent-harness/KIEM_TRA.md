# Kết quả kiểm tra bàn giao — 27/10/2026

Các kết quả bên dưới là baseline của Harness CLI trước khi thêm worker Windows ngày 10/11/2026. Chúng không kiểm chứng worker hoặc tác vụ khởi động cùng Windows.

## Môi trường thực tế

- Windows, Git 2.55.0.windows.3.
- Codex CLI 0.163.0-alpha.10.2.
- `codex login status`: Logged in using ChatGPT.
- Python: runtime đi kèm Codex; không yêu cầu pip.
- `harness.ps1 doctor`: exit code 0.

## Kiểm thử bộ điều phối

`python -m unittest -v`: 5/5 đạt.

1. Từ chối repository có file chưa commit/untracked.
2. Từ chối tests không đúng cấu trúc mảng argv.
3. Khi lệnh test trả exit 3, nhiệm vụ failed, không phải needs_review.
4. Codex exit 0 nhưng không có turn.completed: nhiệm vụ failed.
5. Nhiệm vụ thành công lưu needs_review, capture file mới vào patch, không thay đổi repository nguồn và không cho chạy lại cùng ID.

Các test này dùng đầu ra Codex giả, Git/SQLite thật. Chạy ngoài sandbox lồng nhau vì Git MSYS gặp Access denied bên trong sandbox của phiên phát triển. Không thay đổi sandbox mà worker Codex sử dụng.

## End-to-end với Codex thật

- Job: `a0f3187dcf11`.
- Input: `job.demo.json`, mode review, timeout 120 giây.
- Repository: demo-project, commit `d750561aadc1f5996a4a61060dcb77445d88ae20`.
- Codex đọc hai file và giải thích đúng: 12/10 NG, 12/15 OK, 12/12 OK theo quy tắc <=.
- Harness chạy `{python} -B -m unittest -v`, 1 test method gồm 3 assertions đạt.
- Trạng thái cuối: needs_review.
- Artifacts: `data/jobs/a0f3187dcf11/`.

Codex ghi rõ chưa tự chạy test trong answer.md; harness là thành phần chạy test sau khi Codex hoàn tất. Hai thông tin này phù hợp với luồng triển khai.

## Chưa được xác minh

Chưa chạy chế độ edit trên mã nguồn sản xuất, chưa đánh giá độ chính xác đo ảnh X-ray, chưa test phục hồi mất điện hoặc hiệu năng nhiều worker. Timeout và Ctrl+C có mã dừng cây tiến trình nhưng chưa được kiểm thử end-to-end trên một Codex task bị treo. Không có dashboard, phát hành tự động hay QA agent riêng trong bản v1.
