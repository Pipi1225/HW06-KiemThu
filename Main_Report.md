# HW06: API Testing

- **Student name**: Dương Gia Huy
- **Student ID**: 23127052

---

## AI Agent Skill Flow Diagram

![Screenshot Agent Skill Flow Diagram](images/flow_diagram_agent_skill.jpg)

## 1. AI-Generated Test Script
### 1.1. FR-04: Quản lý hồ sơ cá nhân
*   **API Endpoint sử dụng:** PUT /api/users/me
*   **Các Test Case do AI generated:**

| No. | Tựa đề | Nội dung | Status | Reasoning |
|---|---|---|---|---|
| 1 | [Schema] Response đúng định dạng JSON object | Kiểm tra response body phải là một JSON object. | VALID | Phù hợp với đặc tả trả về chuẩn RESTful. |
| 2 | [Schema] Response chứa message | Kiểm tra JSON trả về có trường message báo 'Profile updated'. | VALID | Phù hợp với phản hồi thực tế của server. |
| 3 | [Schema] User object khớp đặc tả | Kiểm tra user object có `id`, `name`, `email`, `role`. | INVALID | Đặc tả API không yêu cầu trả về user object và response thực tế chỉ trả về {"message": "Profile updated"}. Test case do AI tự suy đoán sai cấu trúc response nên bị loại bỏ. |
| 4 | [Schema] Validation với tv4/ajv | Dùng thư viện schema validator để đối chiếu JSON. | VALID | Phương pháp test tự động tốt nhất cho Schema. |
| 5 | [Domain - Valid] SĐT 10 số hợp lệ | Truyền SĐT 10 số (VD: 0912345678) -> Expect 200 OK. | VALID | Đáp ứng đúng Business Rule về số điện thoại ở Việt Nam. |
| 6 | [Domain - Valid] SĐT 11 số hợp lệ | Truyền SĐT 11 số (VD: 01234567890) -> Expect 200 OK. | VALID | Test case biên hợp lệ (độ dài tối đa của SĐT). |
| 7 | [Domain - Valid] Tên chứa khoảng trắng | Truyền Tên bình thường hợp lệ -> Expect 200 OK. | VALID | Phù hợp với dữ liệu tên thật trong thực tế. |
| 8 | [Domain - Valid] Tên dài tối đa 255 ký tự | Truyền Tên dài đúng 255 ký tự -> Expect 200 OK. | VALID | Test case biên hợp lệ (độ dài tối đa của Tên). |
| 9 | [Domain - Valid] Địa chỉ hợp lệ | Truyền Địa chỉ chứa chữ, số, dấu phẩy -> Expect 200 OK. | VALID | Dữ liệu phổ biến, đúng thực tế. |
| 10 | [Domain - Invalid] SĐT quá ngắn | Truyền SĐT 9 số -> Expect HTTP 400. | VALID | Test case Edge biên dưới (không hợp lệ) của SĐT. |
| 11 | [Domain - Invalid] SĐT quá dài | Truyền SĐT 12 số -> Expect HTTP 400. | VALID | Test case Edge biên trên (không hợp lệ) của SĐT. |
| 12 | [Domain - Invalid] SĐT không bắt đầu bằng số 0 | Truyền SĐT bắt đầu bằng số khác 0 -> Expect HTTP 400. | VALID | Vi phạm định dạng Prefix của số điện thoại. |
| 13 | [Domain - Invalid] SĐT chứa chữ cái | Truyền SĐT có ký tự a-z -> Expect HTTP 400. | VALID | Kiểm tra kiểu dữ liệu (chỉ cho phép số). |
| 14 | [Domain - Invalid] SĐT chứa ký tự đặc biệt | Truyền SĐT có dấu gạch ngang -> Expect HTTP 400. | VALID | Kiểm tra filter ký tự rác của hệ thống. |
| 15 | [Domain - Invalid] SĐT là chuỗi rỗng | Truyền SĐT "" -> Expect HTTP 400. | VALID | Kiểm tra validation `required` / `not empty`. |
| 16 | [Domain - Edge] SĐT là null | Truyền tham số phone = null -> Expect HTTP 400. | VALID | Test case Null value case. |
| 17 | [Domain - Invalid] Tên chuỗi rỗng | Truyền tên "" -> Expect HTTP 400. | VALID | Ràng buộc trong specs: Tên không được bỏ trống. |
| 18 | [Domain - Edge] Tên toàn khoảng trắng | Truyền tên "   " -> Expect HTTP 400. | VALID | Kiểm tra hàm `trim()` và validation của server. |
| 19 | [Domain - Edge] Tên quá 255 ký tự | Truyền tên 256 ký tự -> Expect HTTP 400. | VALID | Kiểm tra vi phạm giới hạn lưu trữ ở Database (Max length). |
| 20 | [Domain - Edge] Thiếu trường Name | Không gửi tham số name -> Expect HTTP 400. | VALID | Kiểm tra validation Missing Field trong Body. |
| 21 | [Domain - Invalid] Địa chỉ chuỗi rỗng | Truyền địa chỉ "" -> Expect HTTP 400. | INCOMPLETE | Trong đặc tả FR-04, địa chỉ là tham số optional (Rỗng thì vẫn có thể cập nhập được profile). |
| 22 | [Domain - Edge] Địa chỉ siêu dài (>1000 chars) | Truyền địa chỉ quá dài -> Expect HTTP 400/413. | VALID | Đảm bảo an toàn không bị tràn bộ nhớ/cơ sở dữ liệu. |
| 23 | [Security - SEC-02] Thiếu Authorization Header | Gửi request không có JWT -> Expect HTTP 401. | VALID | Yêu cầu bắt buộc của SEC-02 (Authentication). |
| 24 | [Security - SEC-02] JWT sai hoặc hết hạn | Gửi JWT token không hợp lệ -> Expect HTTP 401. | VALID | Kiểm tra logic verify Token của hệ thống. |
| 25 | [Security - SEC-06] Xử lý an toàn email | Cố tình truyền email mới -> DB không cập nhật email. | VALID | Do API chỉ trả về message success, cần phải gọi thêm API GET /users/me để xác minh data thật sự không bị đổi. |
| 26 | [Security - SEC-06] Xử lý an toàn role | Cố tình truyền role: admin -> Role vẫn là user. | VALID | Tương tự trên, cần gọi GET /users/me để xác minh quyền không bị leo thang (Privilege Escalation). |
| 27 | [Security - SQLi] Tấn công SQL Injection vào name | Truyền payload SQLi vào name -> Không sập DB. | VALID | Kiểm tra lỗ hổng Injection cơ bản. |
| 28 | [Security - SQLi] Tấn công SQL Injection vào phone | Truyền payload SQLi vào phone -> Lỗi 400. | VALID | Trường Phone chỉ nhận số, nếu nhập payload SQLi vào sẽ vướng format regex -> bắn ra lỗi 400. |
| 29 | [Security - XSS / SEC-04] Tấn công XSS vào name | Truyền `<script>` vào name -> Đã sanitize an toàn. | VALID | Kiểm tra lỗ hổng thực thi script (SEC-04). |
| 30 | [Security - XSS / SEC-04] Tấn công XSS vào địa chỉ | Truyền payload hình ảnh chứa mã XSS -> Xử lý an toàn. | VALID | Kiểm tra việc truyền XSS vector qua thẻ `<img>`. |
| 31 | [Security - IDOR] Sửa profile user khác | Cố tình truyền id của người khác -> Chỉ cập nhật data của mình. | VALID | Do API chỉ trả về message success, cần gọi GET /users/me để xác minh ID không bị ghi đè. |
| 32 | [Security - ContentType] Gửi XML thay vì JSON | Sửa Content-Type thành XML -> Expect HTTP 400/415. | VALID | Server REST API chỉ nên chấp nhận `application/json`. |
| 33 | [State] Tên thay đổi thành công | Gọi API GET /users/me sau khi PUT để lấy Tên so sánh. | VALID | Do API chỉ trả về message, việc xác minh State phải phụ thuộc vào API lấy thông tin. |
| 34 | [State] SĐT thay đổi thành công | Gọi API GET /users/me sau khi PUT để lấy SĐT so sánh. | VALID | Tương tự trên. |
| 35 | [State] Địa chỉ thay đổi thành công | Gọi API GET /users/me sau khi PUT để lấy Địa chỉ so sánh. | VALID | Tương tự trên. |
| 36 | [Performance] Thời gian phản hồi < 1000ms | Expect API xử lý trong thời gian nhanh. | INVALID | Không có yêu cầu Non-functional về thời gian trong đặc tả nghiệp vụ. Và nếu đưa Test case này vào sẽ có khả năng gây ra Flaky Test trên CI/CD |
| 37 | [Workflow] Lưu biến môi trường | Đưa data response vào biến Postman để chuẩn bị verify. | VALID | Cần thiết để cho việc chạy Automation Test nối tiếp nhau tiện lợi hơn. |

### 1.2. FR-07: Giỏ hàng (Shopping Cart)
*   **API Endpoint sử dụng:** POST /api/cart
*   **Các Test Case do AI generated:**

| No. | Tựa đề | Nội dung | Status | Reasoning |
|---|---|---|---|---|
| 1 | [Schema] Response khớp 100% với Schema định nghĩa | Kiểm tra Schema của Response khi request thành công | | |
| 2 | [Domain-Valid] Status code là 200/201 khi truyền body hợp lệ | Truyền id = 1, quantity = 2 -> Expect 200/201 | | |
| 3 | [Domain-ID] id là số 0 -> Lỗi (400 Bad Request) | Truyền id = 0 -> Expect 400 | | |
| 4 | [Domain-ID] id là số âm (-1) -> Lỗi | Truyền id = -1 -> Expect 400 | | |
| 5 | [Domain-ID] id là số thập phân (1.5) -> Lỗi | Truyền id = 1.5 -> Expect 400 | | |
| 6 | [Domain-ID] id bị thiếu (missing) -> Lỗi | Không truyền thuộc tính id -> Expect 400 | | |
| 7 | [Domain-ID] id là null -> Lỗi | Truyền id = null -> Expect 400 | | |
| 8 | [Domain-ID] id là chuỗi ('1') -> Không hợp lệ hoặc ép kiểu | Truyền id dạng chuỗi -> Expect xử lý an toàn | | |
| 9 | [Domain-ID] id là chuỗi rỗng ('') -> Lỗi | Truyền id = "" -> Expect 400 | | |
| 10 | [Domain-ID] id không tồn tại trong CSDL -> Lỗi 404 | Truyền id = 999999 -> Expect 404/400 | | |
| 11 | [Domain-Name] name hợp lệ (có dấu Tiếng Việt) -> Thành công | Truyền name = "Sản phẩm A" -> Expect 200/201 | | |
| 12 | [Domain-Name] name quá dài (>255 ký tự) -> Lỗi 400 | Truyền chuỗi name > 255 ký tự -> Expect 400 | | |
| 13 | [Domain-Name] name bị thiếu (missing) -> Lỗi 400 | Không truyền thuộc tính name -> Expect 400 | | |
| 14 | [Domain-Name] name là null -> Lỗi 400 | Truyền name = null -> Expect 400 | | |
| 15 | [Domain-Name] name là chuỗi rỗng ('') -> Lỗi 400 | Truyền name = "" -> Expect 400 | | |
| 16 | [Domain-Price] price hợp lệ (số nguyên dương) -> Thành công | Truyền price = 100000 -> Expect 200/201 | | |
| 17 | [Domain-Price] price là số 0 -> Lỗi | Truyền price = 0 -> Expect 400 | | |
| 18 | [Domain-Price] price là số âm (-1000) -> Lỗi | Truyền price = -1000 -> Expect 400 | | |
| 19 | [Domain-Price] price bị thiếu (missing) -> Lỗi 400 | Không truyền thuộc tính price -> Expect 400 | | |
| 20 | [Domain-Price] price là null -> Lỗi 400 | Truyền price = null -> Expect 400 | | |
| 21 | [Domain-Price] price là chuỗi ('100000') -> Xử lý (ép kiểu hoặc lỗi) | Truyền price dạng chuỗi -> Expect xử lý an toàn | | |
| 22 | [Domain-Quantity] quantity hợp lệ (>=1) -> Thành công | Truyền quantity >= 1 -> Expect 200/201 | | |
| 23 | [Domain-Quantity] quantity là số 0 -> Lỗi | Truyền quantity = 0 -> Expect 400 (Tối thiểu 1) | | |
| 24 | [Domain-Quantity] quantity là số âm (-1) -> Lỗi | Truyền quantity = -1 -> Expect 400 | | |
| 25 | [Domain-Quantity] quantity là số thập phân (1.5) -> Lỗi | Truyền quantity = 1.5 -> Expect 400 | | |
| 26 | [Domain-Quantity] quantity bị thiếu (missing) -> Lỗi 400 | Không truyền thuộc tính quantity -> Expect 400 | | |
| 27 | [Domain-Quantity] quantity là null -> Lỗi 400 | Truyền quantity = null -> Expect 400 | | |
| 28 | [State] Thêm sản phẩm CHƯA CÓ trong giỏ | Thêm sản phẩm mới -> Tạo dòng mới trong giỏ | | |
| 29 | [State] Thêm sản phẩm ĐÃ CÓ trong giỏ | Thêm sản phẩm trùng -> Cộng dồn số lượng | | |
| 30 | [State] Tổng tiền được tính toán lại | Xác minh Tổng cộng thay đổi đúng sau khi thêm | | |
| 31 | [Security-Auth] Không truyền Header Authorization | Gửi request không có token -> Expect 401 | | |
| 32 | [Security-Auth] Truyền Token không hợp lệ/hết hạn | Gửi request token sai -> Expect 401 | | |
| 33 | [Security-SQLi] SQL Injection ở id | Truyền id = "1 OR 1=1" -> Không sập DB | | |
| 34 | [Security-XSS] XSS ở name | Truyền name = `\<script\>alert(1)\</script\>` -> Sanitize an toàn | | |
| 35 | [Security-IDOR] Thêm tham số lạ user_id | Chèn user_id của người khác vào payload -> Server bỏ qua | | |

### 1.3. FR-14: Quản lý Danh mục (Category CRUD)
*   **API Endpoint sử dụng:** POST /api/categories
*   **Các Test Case do AI generated:**

| No. | Tựa đề | Nội dung | Status | Reasoning |
|---|---|---|---|---|
|  |  |  |  |  |

## 2. Extend Test Script
### 2.1. FR-04: Quản lý hồ sơ cá nhân

| No. | Tựa đề | Nội dung / Kịch bản test | Reasoning |
|---|---|---|---|
| E1 | [Security] Gửi payload lớn (DoS) | Truyền chuỗi rất lớn (vài Megabytes) vào trường name/address -> Expect HTTP 413 Payload Too Large. | Kịch bản AI chưa có case tấn công cạn kiệt tài nguyên máy chủ. |
| E2 | [Domain] Tên chứa ký tự Unicode/Emoji | Truyền Tên "Nguyễn Văn A 🧑‍💻" -> Expect 200 OK. | Đảm bảo hệ thống và Database hỗ trợ mã hóa UTF-8 đầy đủ. |
| E3 | [Business Logic] Payload chứa trường không xác định | Thêm tham số `is_vip: true` vào JSON request -> Expect 200 OK. | Kiểm tra tính an toàn của API khi nhận DTO rác (server phải tự động bỏ qua trường lạ). |
| E4 | [Format] Số điện thoại chứa mã quốc gia | Truyền SĐT dạng `+84912345678` thay vì `09...` -> Expect HTTP 400. | Đặc tả ghi rõ số điện thoại nhập phải bắt đầu bằng số 0, kịch bản cũ chưa bao phủ case có dấu `+`. |
| E5 | [Method] Gửi sai HTTP Method | Gửi request update bằng phương thức `POST` thay vì `PUT` -> Expect HTTP 405 Method Not Allowed. | Test cases do AI sinh ra chỉ gắn với method PUT, cần mở rộng thêm qua bằng method POST để phủ tốt hơn nữa. |

### 2.2. FR-07: Giỏ hàng (Shopping Cart)

| No. | Tựa đề | Nội dung / Kịch bản test | Reasoning |
|---|---|---|---|
|  |  |  |  |

### 2.3. FR-14: Quản lý Danh mục (Category CRUD)

| No. | Tựa đề | Nội dung / Kịch bản test | Reasoning |
|---|---|---|---|
|  |  |  |  |

## 3. Execution of Test Script
Chi tiết phần kết quả của Test script của các FR nằm trong folder `HTML_Report`.

### 3.1. FR-04: Quản lý hồ sơ cá nhân
![Screenshot Postman FR-04](images/fr04-postman.jpg)
![Screenshot Newman FR-04](images/fr04-newman.jpg)

### 3.2. FR-07: Giỏ hàng (Shopping Cart)
![Screenshot Postman FR-07](images/fr07-postman.jpg)
![Screenshot Newman FR-07](images/fr07-newman.jpg)

### 3.3. FR-14: Quản lý Danh mục (Category CRUD)
![Screenshot Postman FR-14](images/fr14-postman.jpg)
![Screenshot Newman FR-14](images/fr14-newman.jpg)

## 3. Bug Found During Execution

## 4. Postman Features được sử dụng trong bài 

