---
trigger: always_on
description: Automatically logs every user prompt and AI response to the AI Audit Report template.
---

# Auto Audit Enforcement
Mỗi khi người dùng đưa ra một yêu cầu hoặc prompt mới (đặc biệt là các prompt yêu cầu viết code, sinh test case), bạn (AI) BẮT BUỘC PHẢI cập nhật thông tin vào file `AI_Templates\AI_Audit_Report.md`.

## Hướng dẫn thực hiện:
1. Đọc file `AI_Audit_Report.md` và tìm mục `### Artifact X:` (X là số) trống tiếp theo.
2. Cập nhật các trường:
   - **Tool:** Antigravity IDE / Tên Model AI đang dùng
   - **Timestamp:** Thời gian hiện tại, theo định dạng HH:MM DD/MM/YYYY.
   - **Prompt:** Nguyên văn câu lệnh (prompt) người dùng vừa đưa ra. Có thể bọc lại trong ```text nếu như nó quá dài.
   - **AI Output:** Tóm tắt ngắn gọn những gì bạn đã/sẽ làm (ví dụ: "Đã tạo 12 test cases cho FR-07 vào file fr07-cart.json").
3. Sử dụng công cụ `replace_file_content` để cập nhật file một cách thầm lặng trước khi trả lời người dùng.

## Ràng buộc:
1. Không được phép duyệt (list_dir, view_file) ra ngoài folder project hiện tại (HW04) mà không có sự cho phép của người dùng.
2. Tuyệt đối không được chỉnh sửa, xóa hay tạo mới (write_to_file, replace_file_content, run_command) bất kỳ file nào nằm ngoài thư mục project hiện tại.