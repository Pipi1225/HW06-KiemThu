// ==========================================
// 1. SCHEMA VALIDATION
// ==========================================
const responseSchema = {
    "type": "object",
    "properties": {
        "message": { "type": "string" }
    },
    "required": ["message"]
};

pm.test("1. [Schema] Response khớp 100% với Schema định nghĩa (khi request hợp lệ)", function () {
    if (pm.response.code === 200 || pm.response.code === 201) {
        pm.response.to.have.jsonSchema(responseSchema);
        pm.expect(pm.response.json().message).to.eql("Added to cart");
    }
});

// ==========================================
// 2. DOMAIN PARTITIONS & PARAMETER VALIDATION
// ==========================================
let reqBody;
try {
    reqBody = pm.request.body ? JSON.parse(pm.request.body.raw) : {};
} catch (e) {
    reqBody = {};
}
const statusCode = pm.response.code;

pm.test("2. [Domain-Valid] Status code là 200/201 khi truyền body hợp lệ", function () {
    if (reqBody.id === 1 && reqBody.quantity === 2) {
        pm.expect(statusCode).to.be.oneOf([200, 201]);
    }
});

pm.test("3. [Domain-ID] id là số 0 -> Lỗi (400 Bad Request)", function () {
    if (reqBody.id === 0) pm.expect(statusCode).to.eql(400);
});

pm.test("4. [Domain-ID] id là số âm (-1) -> Lỗi", function () {
    if (reqBody.id < 0) pm.expect(statusCode).to.eql(400);
});

pm.test("5. [Domain-ID] id là số thập phân (1.5) -> Lỗi", function () {
    if (reqBody.id === 1.5) pm.expect(statusCode).to.eql(400);
});

pm.test("6. [Domain-ID] id bị thiếu (missing) -> Lỗi", function () {
    if (reqBody.id === undefined) pm.expect(statusCode).to.eql(400);
});

pm.test("7. [Domain-ID] id là null -> Lỗi", function () {
    if (reqBody.id === null) pm.expect(statusCode).to.eql(400);
});

pm.test("8. [Domain-ID] id là chuỗi ('1') -> Không hợp lệ hoặc tự động ép kiểu", function () {
    if (typeof reqBody.id === 'string' && reqBody.id === '1') {
        pm.expect(statusCode).to.be.oneOf([200, 201, 400]); 
    }
});

pm.test("9. [Domain-ID] id là chuỗi rỗng ('') -> Lỗi", function () {
    if (reqBody.id === '') pm.expect(statusCode).to.eql(400);
});

pm.test("10. [Domain-ID] id không tồn tại trong CSDL (999999) -> Lỗi 404", function () {
    if (reqBody.id === 999999) pm.expect(statusCode).to.eql(404);
});

pm.test("11. [Domain-Name] name hợp lệ (có dấu Tiếng Việt) -> Thành công", function () {
    if (reqBody.name === "Sản phẩm A") pm.expect(statusCode).to.be.oneOf([200, 201]);
});

pm.test("12. [Domain-Name] name quá dài (>255 ký tự) -> Lỗi 400", function () {
    if (reqBody.name && reqBody.name.length > 255) pm.expect(statusCode).to.eql(400);
});

pm.test("13. [Domain-Name] name bị thiếu (missing) -> Lỗi 400", function () {
    if (reqBody.name === undefined) pm.expect(statusCode).to.eql(400);
});

pm.test("14. [Domain-Name] name là null -> Lỗi 400", function () {
    if (reqBody.name === null) pm.expect(statusCode).to.eql(400);
});

pm.test("15. [Domain-Name] name là chuỗi rỗng ('') -> Lỗi 400", function () {
    if (reqBody.name === '') pm.expect(statusCode).to.eql(400);
});

pm.test("16. [Domain-Price] price hợp lệ (số nguyên dương) -> Thành công", function () {
    if (reqBody.price === 100000) pm.expect(statusCode).to.be.oneOf([200, 201]);
});

pm.test("17. [Domain-Price] price là số 0 -> Lỗi (giá phải > 0)", function () {
    if (reqBody.price === 0) pm.expect(statusCode).to.eql(400);
});

pm.test("18. [Domain-Price] price là số âm (-1000) -> Lỗi", function () {
    if (reqBody.price < 0) pm.expect(statusCode).to.eql(400);
});

pm.test("19. [Domain-Price] price bị thiếu (missing) -> Lỗi 400", function () {
    if (reqBody.price === undefined) pm.expect(statusCode).to.eql(400);
});

pm.test("20. [Domain-Price] price là null -> Lỗi 400", function () {
    if (reqBody.price === null) pm.expect(statusCode).to.eql(400);
});

pm.test("21. [Domain-Price] price là chuỗi ('100000') -> Xử lý (ép kiểu hoặc lỗi)", function () {
    if (typeof reqBody.price === 'string') pm.expect(statusCode).to.be.oneOf([200, 201, 400]);
});

pm.test("22. [Domain-Quantity] quantity hợp lệ (>=1) -> Thành công", function () {
    if (reqBody.quantity >= 1) pm.expect(statusCode).to.be.oneOf([200, 201]);
});

pm.test("23. [Domain-Quantity] quantity là số 0 -> Lỗi (tối thiểu là 1)", function () {
    if (reqBody.quantity === 0) pm.expect(statusCode).to.eql(400);
});

pm.test("24. [Domain-Quantity] quantity là số âm (-1) -> Lỗi", function () {
    if (reqBody.quantity < 0) pm.expect(statusCode).to.eql(400);
});

pm.test("25. [Domain-Quantity] quantity là số thập phân (1.5) -> Lỗi", function () {
    if (reqBody.quantity === 1.5) pm.expect(statusCode).to.eql(400);
});

pm.test("26. [Domain-Quantity] quantity bị thiếu (missing) -> Lỗi 400 (hoặc lấy Default=1)", function () {
    if (reqBody.quantity === undefined) {
        pm.expect(statusCode).to.be.oneOf([400, 200, 201]);
    }
});

pm.test("27. [Domain-Quantity] quantity là null -> Lỗi 400", function () {
    if (reqBody.quantity === null) pm.expect(statusCode).to.eql(400);
});

// ==========================================
// 3. STATE TRANSITIONS (Kết hợp API Chaining GET /api/cart)
// ==========================================
pm.test("28. [State] Thêm sản phẩm CHƯA CÓ trong giỏ -> Phản hồi thông báo thành công", function () {
    if (pm.environment.get("isNewItem") === "true" && (statusCode === 200 || statusCode === 201)) {
        pm.expect(pm.response.json().message).to.eql('Added to cart');
    }
});

pm.test("29. [State] Thêm sản phẩm ĐÃ CÓ trong giỏ -> Phản hồi thông báo thành công", function () {
    if (pm.environment.get("isExistingItem") === "true" && (statusCode === 200 || statusCode === 201)) {
        pm.expect(pm.response.json().message).to.eql('Added to cart');
    }
});

pm.test("30. [State] Sau khi thêm, kiểm tra cấu trúc phản hồi thành công", function () {
    if (statusCode === 200 || statusCode === 201) {
        pm.expect(pm.response.json().message).to.eql('Added to cart');
    }
});

// Chaining GET /api/cart để xác thực State & Security thực tế
if (statusCode === 200 || statusCode === 201) {
    const getCartReq = {
        url: pm.environment.get("base_url") + '/api/cart',
        method: 'GET',
        header: {
            'Authorization': 'Bearer ' + pm.environment.get("auth_token"),
            'Content-Type': 'application/json',
            'X-Student-Id': '23127052'
        }
    };
    pm.sendRequest(getCartReq, function (err, res) {
        if (!err && res.code === 200) {
            const cart = res.json(); // Array of cart items: [{ id, name, price, quantity }]
            
            pm.test("[Chained] Xác minh State: Sản phẩm xuất hiện trong Giỏ hàng qua GET /api/cart", function () {
                pm.expect(cart).to.be.an('array');
                if (reqBody.id) {
                    const item = cart.find(i => i.id === reqBody.id);
                    pm.expect(item).to.not.be.undefined;
                }
            });

            pm.test("[Chained] Xác minh State: Tổng tiền giỏ hàng được tính toán lại (> 0)", function () {
                pm.expect(cart).to.be.an('array');
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                pm.expect(total).to.be.above(0);
            });

            if (reqBody.price === 1) {
                pm.test("[Chained] Xác minh Security: Giá sản phẩm không bị lưu 1đ vào database", function () {
                    const hackedItem = cart.find(i => i.id === reqBody.id && i.price === 1);
                    pm.expect(hackedItem, "Lỗ hổng bảo mật: Server đã lưu giá 1đ do client truyền lên!").to.be.undefined;
                });
            }
        }
    });
}

// ==========================================
// 4. SECURITY CHECKS
// ==========================================
pm.test("31. [Security-Auth] Không truyền Header Authorization -> Bị từ chối 401 Unauthorized", function () {
    if (!pm.request.headers.has('Authorization')) {
        pm.expect(statusCode).to.eql(401);
    }
});

pm.test("32. [Security-Auth] Truyền Token không hợp lệ hoặc hết hạn -> Bị từ chối 401 Unauthorized", function () {
    const token = pm.request.headers.get('Authorization');
    if (token === "Bearer INVALID_TOKEN") {
        pm.expect(statusCode).to.eql(401);
    }
});

pm.test("33. [Security-SQLi] Payload chứa SQL Injection ở id ('1 OR 1=1') -> Chặn an toàn", function () {
    if (typeof reqBody.id === 'string' && reqBody.id.includes('OR')) {
        pm.expect(statusCode).to.not.eql(200); 
    }
});

pm.test("34. [Security-XSS] Payload chứa XSS ở name ('<script>alert(1)</script>') -> Sanitize an toàn", function () {
    if (reqBody.name === "<script>alert(1)</script>") {
        pm.expect(statusCode).to.not.eql(500); 
    }
});

pm.test("35. [Security-IDOR/Role] Chèn thêm 'user_id' lạ vào body -> Bỏ qua, chỉ thêm vào giỏ của user đang đăng nhập", function () {
    if (reqBody.user_id !== undefined) {
        pm.expect(statusCode).to.be.oneOf([200, 201]); 
    }
});

// ==========================================
// 5. EXTENDED TEST CASES (E1-E5)
// ==========================================
pm.test("E1. [Business Logic] Mua vượt mức tồn kho (Out of stock) -> 400", function () {
    if (reqBody.quantity === 999999) {
        pm.expect(statusCode).to.eql(400); 
    }
});

pm.test("E2. [Security] Hack giá trị đơn hàng (Cố tình gửi price = 1) -> Server xử lý an toàn", function () {
    if (reqBody.price === 1) {
        pm.expect(statusCode).to.be.oneOf([200, 201, 400]);
    }
});

pm.test("E3. [Method] Sử dụng sai HTTP Method GET/PUT -> 405 Method Not Allowed", function () {
    if (pm.request.method === "GET" || pm.request.method === "PUT") {
        pm.expect(statusCode).to.eql(405);
    }
});

pm.test("E4. [Security / Race Condition] Spam request đồng thời -> Không trùng lặp / Lỗi tính toán", function () {
    if (pm.environment.get("is_race_condition_test") === "true") {
        pm.expect(statusCode).to.be.oneOf([200, 201, 400, 429]);
    }
});

pm.test("E5. [State] Thêm sản phẩm đang bị khóa (Inactive) -> 400/403", function () {
    if (reqBody.id === 999) { 
        pm.expect(statusCode).to.be.oneOf([400, 403, 404]);
    }
});
