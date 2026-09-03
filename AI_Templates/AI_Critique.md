# AI CRITIQUE

- **Student name**: Dương Gia Huy
- **Student ID**: 23127052

---

Trong bài tập HW06, mô hình AI hỗ trợ rất tốt việc sinh mã kiểm thử ban đầu nhưng bộc lộ nhiều hạn chế và thiên lệch. Điểm thiếu sót lớn nhất của AI nằm ở khâu thiết kế assertion cho các lỗ hổng bảo mật. Điển hình ở bài test Stored XSS và Mass Assignment, AI có xu hướng thiên lệch về các ca kiểm thử cơ bản (Happy Path), chỉ kiểm tra hời hợt rằng mã phản hồi không phải 500 mà bỏ quên việc kiểm tra dữ liệu thực tế có bị lây nhiễm mã độc trong CSDL hay không. Ngoài ra, AI bỏ qua các kịch bản chuyển đổi trạng thái phức tạp như việc Client thao túng giá tiền hoặc gọi sai HTTP Method.

Nguyên nhân AI bỏ sót các vấn đề trên là do đặc tính của mô hình ngôn ngữ lớn, AI hoạt động dựa trên xác suất từ ngữ phổ quát, thiếu tư duy phản biện và không hiểu rõ kiến trúc thực tế của hệ thống SUT. Nếu không có prompt định hướng chặt chẽ, AI sẽ mặc định sinh ra các kịch bản chung chung, mang tính hình thức bề mặt.

Bài học cốt lõi em rút ra khi làm việc cùng AI là nguyên tắc "Human-in-the-loop: Tin tưởng nhưng luôn phải kiểm chứng". AI là trợ lý giúp tăng tốc độ viết kịch bản, nhưng kỹ sư kiểm thử con người bắt buộc phải giữ vai trò quyết định: trực tiếp thẩm định (Audit), thiết kế các ca kiểm thử bảo mật chuyên sâu (Extend) và phân tích lỗi thực tế trên hệ thống.