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
| 1 | [Schema] Response khớp 100% với Schema định nghĩa | Kiểm tra Schema của Response khi request thành công | VALID | Cần thiết để xác nhận cấu trúc JSON phản hồi (đặc biệt khi giỏ hàng là mảng các items). |
| 2 | [Domain - Valid] Status code là 200/201 khi truyền body hợp lệ | Truyền id = 1, quantity = 2 -> Expect 200/201 | VALID | Kiểm tra hành vi đúng của hệ thống (Happy path). |
| 3 | [Domain - ID] id là số 0 -> Lỗi (400 Bad Request) | Truyền id = 0 -> Expect 400 | VALID | Đảm bảo ID sản phẩm phải là số nguyên dương hợp lệ. |
| 4 | [Domain - ID] id là số âm (-1) -> Lỗi | Truyền id = -1 -> Expect 400 | VALID | Kiểm tra biên dưới của ID, chống dữ liệu rác. |
| 5 | [Domain - ID] id là số thập phân (1.5) -> Lỗi | Truyền id = 1.5 -> Expect 400 | VALID | Đảm bảo kiểu dữ liệu Integer cho ID Database. |
| 6 | [Domain - ID] id bị thiếu (missing) -> Lỗi | Không truyền thuộc tính id -> Expect 400 | VALID | Thiếu ID thì hệ thống không biết thêm sản phẩm nào. |
| 7 | [Domain - ID] id là null -> Lỗi | Truyền id = null -> Expect 400 | VALID | Ràng buộc giá trị Not Null. |
| 8 | [Domain - ID] id là chuỗi ('1') -> Không hợp lệ hoặc ép kiểu | Truyền id dạng chuỗi -> Expect xử lý an toàn | INCOMPLETE | Cần xác định rõ hệ thống ép kiểu (trả về 200) hay báo lỗi (400) để thiết lập Script chính xác. |
| 9 | [Domain - ID] id là chuỗi rỗng ('') -> Lỗi | Truyền id = "" -> Expect 400 | VALID | Bắt lỗi chuỗi rỗng của tham số bắt buộc. |
| 10 | [Domain - ID] id không tồn tại trong CSDL -> Lỗi 404 | Truyền id = 999999 -> Expect 404/400 | VALID | Đảm bảo ràng buộc toàn vẹn tham chiếu (Referential Integrity). |
| 11 | [Domain - Name] name hợp lệ (có dấu Tiếng Việt) -> Thành công | Truyền name = "Sản phẩm A" -> Expect 200/201 | VALID | Đảm bảo hệ thống xử lý đúng định dạng chuỗi UTF-8 theo như payload mẫu trong Đặc tả. |
| 12 | [Domain - Name] name quá dài (>255 ký tự) -> Lỗi 400 | Truyền chuỗi name > 255 ký tự -> Expect 400 | VALID | Kiểm tra giới hạn biên (Boundary) của chuỗi đầu vào theo chuẩn DB chung. |
| 13 | [Domain - Name] name bị thiếu (missing) -> Lỗi 400 | Không truyền thuộc tính name -> Expect 400 | VALID | Xác minh xem tham số name có bắt buộc theo Đặc tả hay không. |
| 14 | [Domain - Name] name là null -> Lỗi 400 | Truyền name = null -> Expect 400 | VALID | Xử lý lỗi khi truyền null vào trường chuỗi. |
| 15 | [Domain - Name] name là chuỗi rỗng ('') -> Lỗi 400 | Truyền name = "" -> Expect 400 | VALID | Xử lý lỗi khi truyền chuỗi rỗng. |
| 16 | [Domain - Price] price hợp lệ (số nguyên dương) -> Thành công | Truyền price = 100000 -> Expect 200/201 | VALID | Kiểm tra kiểu dữ liệu số nguyên dương theo Đặc tả. |
| 17 | [Domain - Price] price là số 0 -> Lỗi | Truyền price = 0 -> Expect 400 | VALID | Giá tiền thông thường phải > 0, kiểm tra biên dưới. |
| 18 | [Domain - Price] price là số âm (-1000) -> Lỗi | Truyền price = -1000 -> Expect 400 | VALID | Giá tiền không được âm, kiểm tra Validation của hệ thống. |
| 19 | [Domain - Price] price bị thiếu (missing) -> Lỗi 400 | Không truyền thuộc tính price -> Expect 400 | VALID | Xác minh xem tham số price có bắt buộc theo Đặc tả hay không. |
| 20 | [Domain - Price] price là null -> Lỗi 400 | Truyền price = null -> Expect 400 | VALID | Xử lý lỗi khi truyền null vào trường số. |
| 21 | [Domain - Price] price là chuỗi ('100000') -> Xử lý (ép kiểu hoặc lỗi) | Truyền price dạng chuỗi -> Expect xử lý an toàn | VALID | Kiểm tra cơ chế tự động ép kiểu (Type Casting) của Framework Backend. |
| 22 | [Domain - Quantity] quantity hợp lệ (>=1) -> Thành công | Truyền quantity >= 1 -> Expect 200/201 | VALID | Đảm bảo tính hợp lệ của số lượng hàng vật lý. |
| 23 | [Domain - Quantity] quantity là số 0 -> Lỗi | Truyền quantity = 0 -> Expect 400 (Tối thiểu 1) | VALID | Nếu thêm 0 sản phẩm thì API phải từ chối. (Xóa thì dùng API khác). |
| 24 | [Domain - Quantity] quantity là số âm (-1) -> Lỗi | Truyền quantity = -1 -> Expect 400 | VALID | Ngăn chặn lỗ hổng Logic (Thêm số âm để làm giảm tổng tiền thanh toán). |
| 25 | [Domain - Quantity] quantity là số thập phân (1.5) -> Lỗi | Truyền quantity = 1.5 -> Expect 400 | VALID | Hàng hóa vật lý phải là số nguyên (Integer). |
| 26 | [Domain - Quantity] quantity bị thiếu (missing) -> Lỗi 400 | Không truyền thuộc tính quantity -> Expect 400 | INCOMPLETE | Nếu thiếu `quantity`, Backend có thể chủ động gán Default = 1 thay vì ném lỗi 400. Cần xác nhận Spec. |
| 27 | [Domain - Quantity] quantity là null -> Lỗi 400 | Truyền quantity = null -> Expect 400 | VALID | Bắt lỗi truyền null vào trường cần tính toán. |
| 28 | [State] Thêm sản phẩm CHƯA CÓ trong giỏ | Thêm sản phẩm mới -> Tạo dòng mới trong giỏ | VALID | Do POST chỉ trả về message, cần dùng API Chaining gọi GET /api/cart để xác minh sản phẩm đã lưu vào giỏ. |
| 29 | [State] Thêm sản phẩm ĐÃ CÓ trong giỏ | Thêm sản phẩm trùng -> Cộng dồn số lượng | VALID | Tương tự trên, cần gọi GET /api/cart để xác minh trạng thái giỏ hàng sau khi thêm trùng ID. |
| 30 | [State] Tổng tiền được tính toán lại | Xác minh Tổng cộng thay đổi đúng sau khi thêm | VALID | Do POST không trả về tổng tiền, dùng API Chaining gọi GET /api/cart để tính toán và xác minh tổng tiền > 0. |
| 31 | [Security-Auth] Không truyền Header Authorization | Gửi request không có token -> Expect 401 | VALID | Đảm bảo chỉ User đăng nhập mới thao tác được Cart. |
| 32 | [Security-Auth] Truyền Token không hợp lệ/hết hạn | Gửi request token sai -> Expect 401 | VALID | Xác minh tính an toàn của khâu Verify Token. |
| 33 | [Security-SQLi] SQL Injection ở id | Truyền id = "1 OR 1=1" -> Không sập DB | VALID | Kiểm thử lỗ hổng SQLi cơ bản. |
| 34 | [Security-XSS] XSS ở name | Truyền name = `<script>alert(1)</script>` -> Sanitize an toàn | VALID | Kiểm thử việc lưu mã độc vào tên sản phẩm. |
| 35 | [Security-IDOR] Thêm tham số lạ user_id | Chèn user_id của người khác vào payload -> Server bỏ qua | VALID | Chống lỗi BOLA: Không được phép thêm đồ vào giỏ của người khác. |

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
| E1 | [Business Logic] Mua vượt mức tồn kho (Out of stock) | Truyền quantity = 999999 -> Expect HTTP 400. | Kịch bản AI chưa phân tích đến giới hạn vật lý của kho hàng (Không thể bán thứ mình không có). |
| E2 | [Security] Hack giá trị đơn hàng (Cố tình thay đổi price) | Cố tình truyền `price = 1` -> Expect 200, nhưng Backend vẫn phải tính tổng tiền dựa trên giá gốc trong CSDL. | Bắt được lỗ hổng E-commerce chí mạng: Client truyền giá bao nhiêu Server tin bấy nhiêu. |
| E3 | [Method] Gửi sai HTTP Method | Sử dụng GET hoặc PUT thay vì POST -> Expect HTTP 405 Method Not Allowed. | API Test cần bao phủ cả các trường hợp request bị chặn ngay tại tầng Router. |
| E4 | [Security / Race Condition] Spam request đồng thời | Dùng Script bắn 2 request `Add to Cart` cùng một sản phẩm cách nhau chỉ 10ms -> Expect số lượng được cộng dồn chính xác. | Kịch bản chuyên sâu kiểm tra cơ chế khóa (Database Lock) của Server, ngăn lỗi Race Condition. |
| E5 | [State] Thêm sản phẩm đang bị khóa (Inactive) | Cố tình truyền `id` của một sản phẩm đã ngừng kinh doanh/bị ẩn -> Expect HTTP 400 / 403. | AI thường dựa trên cấu trúc dữ liệu mà bỏ qua các trạng thái (State) theo vòng đời của sản phẩm trong thực tế. |

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

Tổng hợp danh sách các lỗi phát hiện được trong quá trình thực thi kiểm thử tự động với Newman. Chi tiết các bước tái hiện và phân tích chuyên sâu được trình bày tại [Bug_Report.md](Bug_Report.md).

| Bug ID | Feature | Endpoint | Tóm tắt lỗi phát hiện | Test Case liên quan | Severity |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **#1** | FR-04 | `PUT /api/users/me` | Leo thang đặc quyền (Privilege Escalation) qua Mass Assignment gán role admin | Test 25 | **Critical** |
| **#2** | FR-04 | `PUT /api/users/me` | Lỗ hổng Stored XSS trong Profile (Name & Address không sanitize thẻ script) | Test 28, 29 | **High** |
| **#3** | FR-04 | `PUT /api/users/me` | Lỗ hổng IDOR cho phép ghi đè/xung đột ID người dùng | Test 30 | **High** |
| **#4** | FR-04 | `PUT /api/users/me` | Crash 500 Internal Server Error khi gửi Content-Type dạng XML | Test 31 | **Medium** |
| **#5** | FR-04 | `PUT /api/users/me` | Thiếu validation định dạng Số điện thoại (chấp nhận rỗng, chữ, null, sai số) | Test 10–16, 27, E4 | **Medium** |
| **#6** | FR-04 | `PUT /api/users/me` | Thiếu validation trường Name (chấp nhận rỗng, khoảng trắng, vượt quá 255 ký tự) | Test 17–20 | **Medium** |
| **#7** | FR-04 | `PUT /api/users/me` | Trả về sai status code khi token lỗi (403 Forbidden thay vì 401 Unauthorized) | Test 23 | **Low** |
| **#8** | FR-07 | `POST /api/cart` | Thao túng giá tiền từ Client (Client-Side Price Tampering lưu giá 1đ) | Test E2 | **Critical** |
| **#9** | FR-07 | `POST /api/cart` | Cho phép thêm sản phẩm với số lượng không hợp lệ (số âm, 0, thập phân, null) | Test 23–25, 27 | **High** |
| **#10** | FR-07 | `POST /api/cart` | Cho phép thêm sản phẩm với giá tiền âm (`price = -1000`) | Test 18 | **High** |
| **#11** | FR-07 | `POST /api/cart` | Vi phạm toàn vẹn tham chiếu ID (chấp nhận ID rác, không tồn tại, số âm) | Test 3–7, 9, 10 | **High** |
| **#12** | FR-07 | `POST /api/cart` | Thiếu giới hạn trần số lượng mua (cho phép đặt số lượng phi lý 999,999) | Test E1 | **Medium** |
| **#13** | FR-07 | `POST /api/cart` | Chấp nhận chuỗi SQL Injection ở trường ID (`1 OR 1=1`) không ném lỗi 400 | Test 33 | **Medium** |
| **#14** | FR-07 | `POST /api/cart` | Thiếu validation độ dài tối đa cho trường Name sản phẩm (>255 ký tự) | Test 12 | **Low** |

## 4. Postman Features được sử dụng trong bài 

