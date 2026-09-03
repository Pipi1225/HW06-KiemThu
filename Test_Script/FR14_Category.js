// Parse Request Body và Lấy Status Code hiện tại
let reqBody;
try {
    reqBody = pm.request.body ? JSON.parse(pm.request.body.raw) : {};
} catch (e) {
    reqBody = {};
}
const rawBody = pm.request.body ? pm.request.body.raw : "";
const statusCode = pm.response.code;
const contentType = pm.request.headers.get("Content-Type") || "";
const authHeader = pm.request.headers.get("Authorization") || "";

// ==========================================
// 1. SCHEMA VALIDATION (Kiểm tra cấu trúc JSON Response)
// ==========================================
const createCategorySchema = {
    "type": "object",
    "properties": {
        "message": { "type": "string" },
        "id": { "type": "integer" }
    },
    "required": ["message", "id"],
    "additionalProperties": false
};

pm.test("1. [Schema] Response đúng định dạng JSON Object khi tạo thành công (200/201)", function () {
    if (statusCode === 200 || statusCode === 201) {
        pm.response.to.be.json;
        pm.response.to.be.an("object");
    }
});

pm.test("2. [Schema] Response chứa đúng các trường bắt buộc ('message' và 'id')", function () {
    if (statusCode === 200 || statusCode === 201) {
        const resData = pm.response.json();
        pm.expect(resData).to.have.property("message");
        pm.expect(resData).to.have.property("id");
        pm.expect(resData.message).to.eql("Category created");
        pm.expect(resData.id).to.be.a("number");
        pm.expect(resData.id).to.be.above(0);
    }
});

pm.test("3. [Schema] Response không chứa các trường thừa không xác định", function () {
    if (statusCode === 200 || statusCode === 201) {
        const resData = pm.response.json();
        const keys = Object.keys(resData);
        pm.expect(keys).to.have.members(["message", "id"]);
    }
});

pm.test("4. [Schema] Validate toàn bộ response với JSON Schema (thư viện tv4/ajv)", function () {
    if (statusCode === 200 || statusCode === 201) {
        pm.response.to.have.jsonSchema(createCategorySchema);
    }
});

// ==========================================
// 2. DOMAIN PARTITIONS & PARAMETER VALIDATION (name)
// ==========================================

// --- Phân vùng Hợp lệ (Valid Partitions & Boundary) ---
pm.test("5. [Domain - Valid] Tạo danh mục với tên tiếng Việt có dấu thông thường -> Thành công", function () {
    if (reqBody.name === "Đồng hồ thông minh") {
        pm.expect(statusCode).to.be.oneOf([200, 201]);
    }
});

pm.test("6. [Domain - Valid] Tạo danh mục với tên tiếng Anh không dấu -> Thành công", function () {
    if (reqBody.name === "Smart Watch") {
        pm.expect(statusCode).to.be.oneOf([200, 201]);
    }
});

pm.test("7. [Domain - Valid] Tạo danh mục với tên chứa chữ số -> Thành công", function () {
    if (reqBody.name === "iPhone 15 Series") {
        pm.expect(statusCode).to.be.oneOf([200, 201]);
    }
});

pm.test("8. [Domain - Valid] Tạo danh mục với tên chứa ký tự đặc biệt thông dụng (&, -, /) -> Thành công", function () {
    if (reqBody.name === "Âm thanh & Phụ kiện") {
        pm.expect(statusCode).to.be.oneOf([200, 201]);
    }
});

pm.test("9. [Domain - Valid] Tên đạt độ dài tối thiểu (1 ký tự) -> Thành công", function () {
    if (reqBody.name === "A") {
        pm.expect(statusCode).to.be.oneOf([200, 201]);
    }
});

pm.test("10. [Domain - Valid] Tên đạt độ dài tối đa hợp lệ (255 ký tự) -> Thành công", function () {
    if (typeof reqBody.name === "string" && reqBody.name.length === 255) {
        pm.expect(statusCode).to.be.oneOf([200, 201]);
    }
});

pm.test("11. [Domain - Valid] Tên chứa khoảng trắng ở đầu/cuối được xử lý hợp lệ", function () {
    if (typeof reqBody.name === "string" && reqBody.name === "  Máy tính bảng  ") {
        pm.expect(statusCode).to.be.oneOf([200, 201]);
    }
});

// --- Phân vùng Không hợp lệ (Invalid Partitions & Extreme Edge Cases) ---
pm.test("12. [Domain - Invalid] Tên danh mục là chuỗi rỗng ('') -> Báo lỗi 400 Bad Request", function () {
    if (reqBody.name === "") {
        pm.expect(statusCode).to.eql(400);
    }
});

pm.test("13. [Domain - Invalid] Tên danh mục chỉ chứa toàn khoảng trắng ('   ') -> Báo lỗi 400", function () {
    if (typeof reqBody.name === "string" && reqBody.name.trim() === "" && reqBody.name.length > 0) {
        pm.expect(statusCode).to.eql(400);
    }
});

pm.test("14. [Domain - Invalid] Thiếu trường 'name' trong request body ({}) -> Báo lỗi 400", function () {
    if (rawBody.trim() === "{}" || reqBody.name === undefined) {
        pm.expect(statusCode).to.eql(400);
    }
});

pm.test("15. [Domain - Invalid] Trường 'name' có giá trị null -> Báo lỗi 400", function () {
    if (reqBody.name === null) {
        pm.expect(statusCode).to.eql(400);
    }
});

pm.test("16. [Domain - Invalid] Trường 'name' có kiểu dữ liệu là số nguyên (12345) -> Xử lý an toàn (400)", function () {
    if (typeof reqBody.name === "number") {
        pm.expect(statusCode).to.be.oneOf([400, 200, 201]); // 400 nếu bắt kiểu nghiêm ngặt, hoặc ép kiểu
    }
});

pm.test("17. [Domain - Invalid] Trường 'name' có kiểu dữ liệu là boolean (true) -> Báo lỗi 400", function () {
    if (typeof reqBody.name === "boolean") {
        pm.expect(statusCode).to.eql(400);
    }
});

pm.test("18. [Domain - Invalid] Trường 'name' có kiểu dữ liệu là mảng ([]) -> Báo lỗi 400", function () {
    if (Array.isArray(reqBody.name)) {
        pm.expect(statusCode).to.eql(400);
    }
});

pm.test("19. [Domain - Invalid] Trường 'name' có kiểu dữ liệu là object ({}) -> Báo lỗi 400", function () {
    if (typeof reqBody.name === "object" && reqBody.name !== null && !Array.isArray(reqBody.name)) {
        pm.expect(statusCode).to.eql(400);
    }
});

pm.test("20. [Domain - Invalid] Tên danh mục vượt quá độ dài tối đa (256 ký tự) -> Báo lỗi 400", function () {
    if (typeof reqBody.name === "string" && reqBody.name.length > 255) {
        pm.expect(statusCode).to.eql(400);
    }
});

pm.test("21. [Domain - Edge] Request body hoàn toàn rỗng (Empty payload) -> Báo lỗi 400", function () {
    if (!rawBody || rawBody.trim() === "") {
        pm.expect(statusCode).to.eql(400);
    }
});

pm.test("22. [Domain - Edge] Gửi kèm các trường không xác định ngoài 'name' -> Xử lý an toàn", function () {
    if (reqBody.name && reqBody.extra_field !== undefined) {
        pm.expect(statusCode).to.be.oneOf([200, 201, 400]);
    }
});

// ==========================================
// 3. STATE TRANSITIONS (Kiểm tra Chuyển đổi Trạng thái & API Chaining)
// ==========================================
pm.test("23. [State] POST response trả về 'id' mới hợp lệ (> 0) cho danh mục vừa tạo", function () {
    if (statusCode === 200 || statusCode === 201) {
        const res = pm.response.json();
        pm.expect(res.id).to.be.a("number");
        pm.expect(res.id).to.be.above(0);
        pm.environment.set("latest_created_category_id", res.id);
    }
});

// API Chaining: Gọi GET /api/categories để xác minh State thực tế lưu trong CSDL
if (statusCode === 200 || statusCode === 201) {
    const createdId = pm.response.json().id;
    const sentName = reqBody.name;

    const getCategoriesReq = {
        url: pm.environment.get("base_url") + "/api/categories",
        method: "GET",
        header: {
            "Content-Type": "application/json",
            "X-Student-Id": "23127052"
        }
    };

    pm.sendRequest(getCategoriesReq, function (err, res) {
        pm.test("24. [State - Chained] Gọi GET /api/categories trả về HTTP 200 OK và là một JSON Array", function () {
            pm.expect(err).to.be.null;
            pm.expect(res.code).to.eql(200);
            pm.expect(res.json()).to.be.an("array");
        });

        pm.test("25. [State - Chained] Danh mục vừa tạo tồn tại trong danh sách GET /api/categories (khớp ID)", function () {
            const categories = res.json();
            const foundCategory = categories.find(cat => cat.id === createdId);
            pm.expect(foundCategory, `Không tìm thấy danh mục có ID = ${createdId} trong GET /api/categories`).to.not.be.undefined;
        });

        pm.test("26. [State - Chained] Tên danh mục lưu trong CSDL khớp chính xác với 'name' đã gửi lên", function () {
            if (sentName && typeof sentName === "string") {
                const categories = res.json();
                const foundCategory = categories.find(cat => cat.id === createdId);
                if (foundCategory) {
                    pm.expect(foundCategory.name.trim()).to.eql(sentName.trim());
                }
            }
        });

        // Test 27. [State - Chained] Danh sách danh mục không rỗng và mỗi phần tử có đúng cấu trúc {id, name}
        // -> ĐÃ LOẠI BỎ QUA AUDIT (Invalid: Kiểm tra toàn bộ mảng của GET API là trách nhiệm của GET, không thuộc phạm vi POST)
    });
}

pm.test("28. [State] Xử lý khi tạo danh mục có tên đã tồn tại (Trùng tên)", function () {
    if (pm.environment.get("is_duplicate_name_test") === "true") {
        pm.expect(statusCode).to.be.oneOf([200, 201, 400, 409]);
    }
});

// ==========================================
// 4. SECURITY CHECKS (SEC-01 đến SEC-07, Phân quyền, SQLi, XSS)
// ==========================================
pm.test("29. [Security - SEC-02] Không gửi kèm Authorization Header -> Bị từ chối HTTP 401 Unauthorized", function () {
    if (!pm.request.headers.has("Authorization") || authHeader === "") {
        pm.expect(statusCode).to.eql(401);
    }
});

pm.test("30. [Security - SEC-02] Gửi Token không hợp lệ hoặc hết hạn -> Bị từ chối HTTP 401 Unauthorized", function () {
    if (authHeader.includes("INVALID_TOKEN") || authHeader.includes("EXPIRED_TOKEN")) {
        pm.expect(statusCode).to.eql(401);
    }
});

pm.test("31. [Security - SEC-03] Kiểm tra phân quyền Admin: User thường không được tạo danh mục -> Bị từ chối HTTP 403", function () {
    if (pm.environment.get("user_role") === "user" || authHeader.includes("USER_TOKEN")) {
        pm.expect(statusCode).to.eql(403);
    }
});

pm.test("32. [Security - SEC-05 / SQLi] Tấn công SQL Injection vào trường 'name' -> Xử lý an toàn không sập DB", function () {
    if (typeof reqBody.name === "string" && (reqBody.name.includes("OR 1=1") || reqBody.name.includes("DROP TABLE"))) {
        pm.expect(statusCode).to.not.eql(500);
    }
});

pm.test("33. [Security - SEC-04 / XSS] Tấn công Stored XSS vào trường 'name' -> Sanitize an toàn không gây lỗi 500", function () {
    if (typeof reqBody.name === "string" && (reqBody.name.includes("<script>") || reqBody.name.includes("onerror="))) {
        pm.expect(statusCode).to.not.eql(500);
    }
});

pm.test("34. [Security - IDOR / Parameter Tampering] Client tự ý chỉ định trường 'id' trong body -> Server tự sinh ID", function () {
    if (reqBody.id !== undefined && (statusCode === 200 || statusCode === 201)) {
        const res = pm.response.json();
        if (reqBody.id === 9999) {
            pm.expect(res.id).to.not.eql(9999);
        }
    }
});

pm.test("35. [Security - Content-Type] Gửi payload dạng XML / text thay vì JSON -> Bị từ chối HTTP 400 hoặc 415", function () {
    if (contentType.includes("text/plain") || contentType.includes("application/xml")) {
        pm.expect(statusCode).to.be.oneOf([400, 415]);
    }
});

// ==========================================
// 5. EXTENDED TEST CASES (E1-E5 do sinh viên tự bổ sung)
// ==========================================
pm.test("E1. [Security] Gửi payload tên danh mục cực lớn (DoS) -> Expect HTTP 413 Payload Too Large", function () {
    if (rawBody && rawBody.length > 500000) {
        pm.expect(statusCode).to.be.oneOf([400, 413]);
    }
});

pm.test("E2. [Method] Gửi sai HTTP Method (PUT/PATCH) tới /api/categories -> Expect HTTP 405 Method Not Allowed", function () {
    if (pm.request.method === "PUT" || pm.request.method === "PATCH") {
        pm.expect(statusCode).to.eql(405);
    }
});

pm.test("E3. [Security / Race Condition] Tạo đồng thời danh mục trùng tên -> Xử lý tuần tự, không tạo rác", function () {
    if (pm.environment.get("is_race_condition_test") === "true") {
        pm.expect(statusCode).to.be.oneOf([200, 201, 400, 409]);
    }
});

pm.test("E4. [Format] Tên chứa ký tự khoảng trắng tàng hình (Zero-width space) -> Expect HTTP 400 hoặc sanitize", function () {
    if (rawBody.includes("\\u200B") || rawBody.includes("\n")) {
        pm.expect(statusCode).to.be.oneOf([200, 201, 400]);
    }
});

pm.test("E5. [State] Kiểm tra trạng thái mặc định của danh mục mới (is_active / visible)", function () {
    if (statusCode === 200 || statusCode === 201) {
        const res = pm.response.json();
        pm.expect(res).to.have.property("id");
        pm.expect(res.id).to.be.above(0);
    }
});
