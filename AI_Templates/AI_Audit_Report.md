# AI AUDIT REPORT

- **Student name**: Dương Gia Huy
- **Student ID**: 23127052

---

## AI-generated Artifact

Em đã sử dụng AI cho những task sau đây:

### Artifact 1: 
**1. Prompt + Tool**
- **Tool:** Antigravity IDE / Gemini 3.1 Pro
- **Timestamp:** 20:51 31/08/2026
- **Prompt:**
```text
Execute. Run the test cases with Postman + Newman (or Karate / RestAssured). Every request must carry the header X-Student-Id: {StudentID} (for example, via a pre-request script). Produce the Newman / HTMLreport.

yêu cầu này là sao nhỉ?
```

**2. AI Output:** Đã giải thích chi tiết ý nghĩa của yêu cầu kiểm thử tự động với Newman (hoặc Karate/RestAssured), cách thêm header `X-Student-Id` bằng Pre-request Script và cách xuất HTML report.

### Artifact 2: 
**1. Prompt + Tool**
- **Tool:** Antigravity IDE / Gemini 3.1 Pro
- **Timestamp:** 11:04 01/09/2026
- **Prompt:**
```text
Bạn hãy tiến hành tạo cho tôi 1 agent skill phục vụ cho mục đích generate ra các test script (trong Postman).

Dưới đây là các ràng buộc mà agent skill phải tuyệt đối tuân thủ nghiêm ngặt:
1. Số lượng Test Cases: Luôn đảm bảo sinh ra ít nhất 35 test cases (pm.test) cho mỗi API endpoint.
2. Domain Partitions: Bao phủ hết toàn bộ parameters (giá trị hợp lệ, biên, lỗi, null, chuỗi rỗng).
3. State Transitions: Kiểm tra sự thay đổi trạng thái trước và sau khi gọi API (đặc biệt các API tạo/sửa/xóa).
4. Security (SEC-01 đến SEC-07): Bao phủ hết các case như SQL Injection, XSS, IDOR, role escalation, auth.
5. Schema Validation: Dùng thư viện tv4/ajv để match 100% cấu trúc JSON response với đặc tả.

Luồng hoạt động (workflow) của Skill phải tuân theo các bước sau:
- Bước 1 (API Analysis): Đọc API Specs do tôi cung cấp, lấy ra parameters, methods và các roles yêu cầu (nếu cần).
- Bước 2 (Test Planning): Lên kế hoạch để trải test cases bao phủ cả 4 mảng trên.
- Bước 3 (Code Generation): Sinh mã JavaScript (pm.test). Đảm bảo đủ 35 cases, nếu cần thì tự động sinh thêm các extreme edge cases.
- Bước 4 (Output): Trả về kịch bản Postman hoàn chỉnh có comment và đánh số thứ tự rõ ràng.

Bạn hãy đóng vai trò làm trợ lý, dựa vào các thiết kế hệ thống và luồng hoạt động mà tôi đã ghi để viết nội dung Markdown hoàn chỉnh cho file `SKILL.md` dùng trong Antigravity.
```

**2. AI Output:** Đã tạo một custom agent skill tên là `postman_test_generator` với các hướng dẫn chi tiết để sinh Postman test scripts thỏa mãn yêu cầu.

### Artifact 3: 
**1. Prompt + Tool**
- **Tool:** Antigravity IDE / Gemini 3.1 Pro
- **Timestamp:** 11:22 01/09/2026
- **Prompt:**
```text
Bạn hãy generate cho tôi 35 test cases cho FR-04: Quản lý hồ sơ cá nhân. Sử dụng endpoint là PUT /api/users/me.

Toàn bộ context cần thiết đã nằm sẵn trong @[d:\DaiHoc\KiemThuPM\HW06\api_constraint.md] và @[d:\DaiHoc\KiemThuPM\HW06\api_specification.md] 
```

**2. AI Output:** Đã tạo ra mã kịch bản Postman Test (với hơn 35 test cases) cho API `PUT /api/users/me` (FR-04), đảm bảo kiểm thử toàn diện về Schema Validation, Domain Partitions, Security và State Transitions dựa trên constraint và spec được cung cấp.

### Artifact 4: 
**1. Prompt + Tool**
- **Tool:** Antigravity IDE / Gemini 3.1 Pro
- **Timestamp:** 11:25 01/09/2026
- **Prompt:**
```text
Bạn hãy paste 37 test cases bạn vừa tạo vào bảng FR-04 ở @[d:\DaiHoc\KiemThuPM\HW06\Main_Report.md] 
```

**2. AI Output:** Đã xuất và định dạng 37 test cases của FR-04 thành các hàng trong bảng Markdown tại file `Main_Report.md` (bao gồm cột số thứ tự, tựa đề, và nội dung chi tiết) để sinh viên tiện thực hiện bước Audit.

### Artifact 5: 
**1. Prompt + Tool**
- **Tool:** Antigravity IDE / Gemini 3.1 Pro
- **Timestamp:** 16:45 01/09/2026
- **Prompt:**
```text
Ở chức năng FR-04 (PUT /api/users/me), nếu như API cập nhật thông tin thành công mà không trả về object user trong response body thì làm sao để dùng API Chaining trong Postman gọi tiếp endpoint GET /api/users/me nhằm verify lại dữ liệu đã lưu chuẩn xác chưa trực tiếp ngay trong script?.
```

**2. AI Output:** Đã hướng dẫn kỹ thuật API Chaining trong Postman: sử dụng Pre-request/Tests Script của request `PUT /api/users/me` để lưu các trường dữ liệu cập nhật (`updated_name`, `updated_phone`, `updated_address`) vào Postman Environment Variables. Sau đó thiết lập gọi tiếp request `GET /api/users/me` (thông qua Collection Runner hoặc hàm `postman.setNextRequest()`), tại đây viết assertion script đối chiếu dữ liệu trả về từ API GET với các biến môi trường đã lưu nhằm xác minh dữ liệu thực sự đã được cập nhật thành công vào hệ thống.

### Artifact 6: 
**1. Prompt + Tool**
- **Tool:** Antigravity IDE / Gemini 3.1 Pro (High)
- **Timestamp:** 01:36 02/09/2026
- **Prompt:**
```text
Bạn hãy generate cho tôi 35 test cases cho FR-07: Giỏ hàng (Shopping Cart). Sử dụng endpoint là POST /api/cart
Toàn bộ context cần thiết đã nằm sẵn trong @[d:\DaiHoc\KiemThuPM\HW06\api_constraint.md] và @[d:\DaiHoc\KiemThuPM\HW06\api_specification.md]
```

**2. AI Output:** Đã áp dụng skill postman-test-generator để phân tích và sinh ra 35 test cases bằng JavaScript (pm.test) cho API `POST /api/cart` (FR-07), bao phủ đầy đủ Domain Partitions, State Transitions, Security và Schema Validation.

### Artifact 7: 
**1. Prompt + Tool**
- **Tool:** Antigravity IDE / Gemini 3.1 Pro (High)
- **Timestamp:** 01:39 02/09/2026
- **Prompt:**
```text
Sau đó bạn hãy đổ 35 test case đó vào bảng ở phần FR-07 trong @[Main_Report.md], để trống phần Status và Reasoning để tôi tự điền
```

**2. AI Output:** Đã định dạng 35 test cases của FR-07 và dán vào bảng Markdown tại file `Main_Report.md`, để trống cột Status và Reasoning theo yêu cầu.

### Artifact 8: 
**1. Prompt + Tool**
- **Tool:** Antigravity IDE / Gemini 3.1 Pro
- **Timestamp:** 11:23 02/09/2026
- **Prompt:**
```text
Tôi đã tổng hợp và phân tích các bug tìm được trong quá trình chạy kiểm thử tự động tại @[d:\DaiHoc\KiemThuPM\HW06\Bug_Report.md]. Bạn hãy đọc nội dung file này và parse lại thành một file template Github Issues hoàn chỉnh (bao gồm Tiêu đề, Mô tả, Steps to Reproduce, Expected vs Actual và đường dẫn Screenshot tương ứng) để tôi tiện copy-paste đưa lên GitHub Issues.
```

**2. AI Output:** Đã đọc nội dung chi tiết của 14 bugs từ file `Bug_Report.md` do sinh viên tổng hợp, phân tích cấu trúc và chuyển đổi thành file `Github_Issues_Content.md` với định dạng chuẩn Markdown của GitHub Issues (gồm Tiêu đề chuẩn hóa theo module và severity, kịch bản tái hiện chi tiết, kết quả mong muốn/thực tế và link ảnh bằng chứng) giúp sinh viên dễ dàng đưa lên hệ thống theo dõi lỗi.

### Artifact 9: 
**1. Prompt + Tool**
- **Tool:** Antigravity IDE / Gemini 3.7 Flash
- **Timestamp:** 22:40 02/09/2026
- **Prompt:**
```text
Bạn hãy generate cho tôi test cases của Postman cho FR-14: Quản lý Danh mục (Category CRUD), API sử dụng là POST /api/categories (Phần extended case trong bài là sẽ DO TÔI tự làm)

Các context cần thiết đã nằm trong @[api_constraint.md] và @[api_specification.md] 

Có một số điểm lưu ý
Nếu dùng POST /api/categories, response trả về chỉ có:
{
    "message": "Category created",
    "id": 5
}
Nên cần phải dùng GET /api/categories
[
    {
        "id": 1,
        "name": "Điện thoại"
    },
    {
        "id": 2,
        "name": "Laptop"
    },
    {
        "id": 3,
        "name": "Phụ kiện"
    },
    {
        "id": 4,
        "name": "new_category"
    },
    {
        "id": 5,
        "name": "new_category"
    }
]
```

**2. AI Output:** Đã phân tích đặc tả API và các ràng buộc nghiệp vụ của FR-14 (`POST /api/categories`), áp dụng skill postman-test-generator để thiết kế và sinh 35 test cases chi tiết bao phủ toàn diện 4 mảng: Schema Validation, Domain Partitions, State Transitions (sử dụng API Chaining gọi `GET /api/categories` để xác minh dữ liệu thực tế trong danh sách), và Security Checks (SEC-01 đến SEC-07). Đồng thời tạo file mã nguồn JavaScript `Test_Script/FR14_Category.js`.

### Artifact 10: 
**1. Prompt + Tool**
- **Tool:** Antigravity IDE / Gemini 3.7 Flash
- **Timestamp:** 22:42 02/09/2026
- **Prompt:**
```text
Bạn hãy paste hết các test case đó vào @[Main_Report.md] , nhớ để trống trường reasoning và status để tôi tự làm
```

**2. AI Output:** Đã cập nhật toàn bộ 35 test cases của FR-14 (`POST /api/categories`) vào bảng kiểm thử tại mục 1.3 trong file `Main_Report.md`, đồng thời để trống các cột Status và Reasoning theo yêu cầu để sinh viên tự thực hiện đánh giá audit.

### Artifact 11: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 12: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 13: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 14: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 15: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 16: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 17: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 18: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 19: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 20: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 21: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 22: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 23: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 24: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 25: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 26: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 27: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 28: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 29: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**

### Artifact 30: 
**1. Prompt + Tool**
- **Tool:**
- **Timestamp:**
- **Prompt:**

**2. AI Output:**