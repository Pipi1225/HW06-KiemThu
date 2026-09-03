# HW06 - AI-Driven API Testing Report

- **Student Name:** Dương Gia Huy
- **Student ID:** 23127052
- **GitHub Repository:** [https://github.com/Pipi1225/HW06-KiemThu](https://github.com/Pipi1225/HW06-KiemThu)

---

## 1. Bảng Tự Đánh Giá (Self-Assessment Table)

| No. | Criteria | Max Grade | Self-Assessed Grade |
| :---: | :--- | :---: | :---: |
| **1** | **API 1 (Pool A - FR-04)** — Full pipeline *(generate + audit + extend + execute + bugs)* | 30 |  |
| **2** | **API 2 (Pool B - FR-07)** — Full pipeline *(generate + audit + extend + execute + bugs)* | 30 |  |
| **3** | **API 3 (Pool C - FR-14)** — Full pipeline *(generate + audit + extend + execute + bugs)* | 30 |  |
| **4** | **Agent Skills** *(AI-driven test generator)* | 10 |  |
| | **Total** | **100** |  |

---

## 2. Báo Cáo Tổng Hợp Kiểm Thử (Test Summary Report)

### 2.1. Thống kê tổng quan theo từng API (Overall Statistics)

- **Số lượng API được kiểm thử (Number of APIs):** 3 APIs (Bao phủ đầy đủ 3 nhóm Pool A, Pool B, Pool C):
  1. **API 1 (Pool A):** `PUT /api/users/me` - FR-04: Quản lý hồ sơ cá nhân
  2. **API 2 (Pool B):** `POST /api/cart` - FR-07: Giỏ hàng (Shopping Cart)
  3. **API 3 (Pool C):** `POST /api/categories` - FR-14: Quản lý danh mục sản phẩm (Category Management)

| Feature / API | Endpoint | Method | AI Generated | Human Added | Total Cases | Excluded (Audit) | Executed | Passed | Failed | Bugs Found |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **FR-04: Quản lý hồ sơ** | `/api/users/me` | `PUT` | 37 | 5 | 42 | **2** | 40 | 18 | 22 | 7 |
| **FR-07: Giỏ hàng** | `/api/cart` | `POST` | 35 | 5 | 40 | **3** | 37 | 18 | 19 | 7 |
| **FR-14: Danh mục** | `/api/categories` | `POST` | 35 | 5 | 40 | **3** | 37 | 25 | 12 | 4 |
| **TỔNG CỘNG (TOTAL)** | | | **107** | **15** | **122** | **8** | **114** | **61** | **53** | **18** |

---

### 2.2. Tóm tắt lỗi phát hiện được (Bugs Discovered)

Toàn bộ **18 lỗi thực tế** đã được phân tích chuyên sâu, tạo bằng chứng ảnh và đăng lên hệ thống theo dõi:
- **Critical (3 bugs):**
  - **Bug #1:** Lỗ hổng leo thang đặc quyền (Privilege Escalation) qua Mass Assignment gán role `admin` (`PUT /api/users/me`).
  - **Bug #8:** Lỗ hổng thao túng giá tiền từ Client (Client-Side Price Manipulation) cho phép lưu giá 1đ vào giỏ hàng (`POST /api/cart`).
  - **Bug #15:** Lỗ hổng kiểm soát truy cập (Broken Access Control / BOLA) cho phép User thường tự ý tạo Danh mục (`POST /api/categories`).
- **High (7 bugs):**
  - **Bug #2:** Stored XSS trong Name và Address (`PUT /api/users/me`).
  - **Bug #3:** IDOR ghi đè thuộc tính ID người dùng (`PUT /api/users/me`).
  - **Bug #9:** Chấp nhận số lượng âm, 0, thập phân trong giỏ hàng (`POST /api/cart`).
  - **Bug #10:** Cho phép thêm sản phẩm với giá tiền âm (`POST /api/cart`).
  - **Bug #11:** Vi phạm toàn vẹn tham chiếu ID sản phẩm không tồn tại (`POST /api/cart`).
  - **Bug #16:** Thiếu toàn bộ validation cho trường Name danh mục (rỗng, space, null, mảng, >255) (`POST /api/categories`).
- **Medium (5 bugs):**
  - **Bug #4:** Crash 500 Internal Server Error khi nhận Content-Type XML (`PUT /api/users/me`).
  - **Bug #5:** Thiếu hoàn toàn validation định dạng Số điện thoại (`PUT /api/users/me`).
  - **Bug #6:** Thiếu validation bắt buộc và độ dài cho Name (`PUT /api/users/me`).
  - **Bug #12:** Thiếu chặn trần số lượng đặt mua 999,999 mặt hàng (`POST /api/cart`).
  - **Bug #13:** Chấp nhận chuỗi SQL Injection ở ID sản phẩm (`POST /api/cart`).
  - **Bug #17:** Crash 500 Internal Server Error khi nhận Content-Type XML (`POST /api/categories`).
- **Low (3 bugs):**
  - **Bug #7:** Trả về sai status code 403 thay vì 401 khi Token không hợp lệ (`PUT /api/users/me`).
  - **Bug #14:** Thiếu validation giới hạn độ dài cho Name sản phẩm (`POST /api/cart`).
  - **Bug #18:** Trả về sai HTTP status code khi gọi sai Method (404 Not Found thay vì 405) (`POST /api/categories`).

Chi tiết xem tại: **[Bug_Report.md](Bug_Report.md)**.
