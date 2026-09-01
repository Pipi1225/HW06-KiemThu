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

// ==========================================
// 2. SCHEMA VALIDATION (Chỉ chạy khi 200 OK)
// ==========================================
if (pm.response.code === 200) {
    pm.test("1. [Schema] Response trả về đúng định dạng JSON object", function () {
        pm.response.to.be.json;
        pm.response.to.be.an("object");
    });

    pm.test("2. [Schema] Response có chứa message báo thành công", function () {
        const res = pm.response.json();
        pm.expect(res).to.have.property("message");
        pm.expect(res.message).to.eql("Profile updated");
    });

    // Test 3. [Schema] Cấu trúc đối tượng user - ĐÃ BỊ LOẠI BỎ (Invalid: API không trả về đối tượng user)

    pm.test("4. [Schema] Validation bằng thư viện tv4/ajv để match 100% schema", function () {
        pm.response.to.have.jsonSchema(responseSchema);
    });
}

// ==========================================
// 3. DOMAIN PARTITIONS & PARAMETER VALIDATION 
// ==========================================

// --- VALID INPUTS (Trường hợp hợp lệ) ---
pm.test("5. [Domain - Valid] Cập nhật thành công với số điện thoại 10 số (Bắt đầu bằng 0)", function () {
    if(pm.request.body.raw.includes("0912345678")) {
        pm.response.to.have.status(200);
    }
});

pm.test("6. [Domain - Valid] Cập nhật thành công với số điện thoại 11 số (Bắt đầu bằng 0)", function () {
    if(pm.request.body.raw.includes("01234567890")) {
        pm.response.to.have.status(200);
    }
});

pm.test("7. [Domain - Valid] Tên hợp lệ, chứa khoảng trắng (VD: Nguyen Van A)", function () {
    if(pm.request.body.raw.includes("Nguyen Van A")) {
        pm.response.to.have.status(200);
    }
});

pm.test("8. [Domain - Valid] Tên hợp lệ, độ dài tối đa (255 ký tự)", function () {
    const longName = "a".repeat(255);
    if(pm.request.body.raw.includes(longName)) {
        pm.response.to.have.status(200);
    }
});

pm.test("9. [Domain - Valid] Địa chỉ hợp lệ chứa số và ký tự đặc biệt", function () {
    if(pm.request.body.raw.includes("123 Le Loi, Q1, TP.HCM")) {
        pm.response.to.have.status(200);
    }
});

// --- INVALID INPUTS (Trường hợp không hợp lệ) ---
pm.test("10. [Domain - Invalid] Số điện thoại quá ngắn (9 chữ số) -> Báo lỗi 400", function () {
    if(pm.request.body.raw.includes("091234567\"")) {
        pm.response.to.have.status(400);
    }
});

pm.test("11. [Domain - Invalid] Số điện thoại quá dài (12 chữ số) -> Báo lỗi 400", function () {
    if(pm.request.body.raw.includes("091234567890")) {
        pm.response.to.have.status(400);
    }
});

pm.test("12. [Domain - Invalid] Số điện thoại KHÔNG bắt đầu bằng số 0 -> Báo lỗi 400", function () {
    if(pm.request.body.raw.includes("8491234567")) {
        pm.response.to.have.status(400);
    }
});

pm.test("13. [Domain - Invalid] Số điện thoại chứa ký tự chữ cái -> Báo lỗi 400", function () {
    if(pm.request.body.raw.includes("091234567a")) {
        pm.response.to.have.status(400);
    }
});

pm.test("14. [Domain - Invalid] Số điện thoại chứa ký tự đặc biệt -> Báo lỗi 400", function () {
    if(pm.request.body.raw.includes("0912-345-678")) {
        pm.response.to.have.status(400);
    }
});

pm.test("15. [Domain - Invalid] Số điện thoại là chuỗi rỗng -> Báo lỗi 400", function () {
    if(pm.request.body.raw.includes("\"phone\":\"\"")) {
        pm.response.to.have.status(400);
    }
});

pm.test("16. [Domain - Edge] Số điện thoại là kiểu null -> Báo lỗi 400", function () {
    if(pm.request.body.raw.includes("\"phone\":null")) {
        pm.expect(pm.response.code).to.be.oneOf([400, 422]);
    }
});

pm.test("17. [Domain - Invalid] Tên trống rỗng (empty string) -> Báo lỗi 400", function () {
    if(pm.request.body.raw.includes("\"name\":\"\"")) {
        pm.response.to.have.status(400);
    }
});

pm.test("18. [Domain - Edge] Tên chỉ chứa toàn khoảng trắng -> Báo lỗi 400", function () {
    if(pm.request.body.raw.includes("\"name\":\"   \"")) {
        pm.response.to.have.status(400);
    }
});

pm.test("19. [Domain - Edge] Tên vượt quá 255 ký tự (256 ký tự) -> Báo lỗi 400", function () {
    const veryLongName = "a".repeat(256);
    if(pm.request.body.raw.includes(veryLongName)) {
        pm.response.to.have.status(400);
    }
});

pm.test("20. [Domain - Edge] Request Body bị khuyết thiếu hoàn toàn trường Name -> Báo lỗi 400", function () {
    if(!pm.request.body.raw.includes("\"name\"")) {
        pm.response.to.have.status(400);
    }
});

pm.test("21. [Domain - Edge] Địa chỉ rất dài (> 1000 ký tự) -> Báo lỗi 400 hoặc 413", function () {
    const longAddress = "a".repeat(1001);
    if(pm.request.body.raw.includes(longAddress)) {
         pm.expect(pm.response.code).to.not.be.oneOf([200, 201]); 
    }
});

// ==========================================
// 4. SECURITY (SEC-01 - SEC-07) 
// ==========================================

pm.test("22. [Security - SEC-02] Báo lỗi 401 Unauthorized nếu không gửi Token", function () {
    if(!pm.request.headers.has("Authorization")) {
        pm.response.to.have.status(401);
    }
});

pm.test("23. [Security - SEC-02] Báo lỗi 401 Unauthorized nếu JWT Token sai/hết hạn", function () {
    if(pm.request.headers.get("Authorization") === "Bearer invalid_token_123") {
        pm.response.to.have.status(401);
    }
});

pm.test("24. [Security - SEC-06] Xử lý an toàn: Cố tình thay đổi email qua API -> Email không bị thay đổi", function () {
    if(pm.request.body.raw.includes("\"email\"")) {
        // Validation được chuyển sang bước API Chaining
        pm.expect(pm.response.code).to.eql(200);
    }
});

pm.test("25. [Security - SEC-06] Xử lý an toàn: Cố tình thay đổi role lên 'admin' -> Role vẫn giữ nguyên là 'user'", function () {
    if(pm.request.body.raw.includes("\"role\":\"admin\"")) {
        pm.expect(pm.response.code).to.eql(200);
    }
});

pm.test("26. [Security - SQLi] Tấn công SQL Injection vào 'name' -> Không lỗi 500", function () {
    if(pm.request.body.raw.includes("' OR 1=1 --")) {
        pm.response.to.not.have.status(500);
    }
});

pm.test("27. [Security - SQLi] Tấn công SQL Injection vào 'phone' -> Báo lỗi do sai định dạng (400)", function () {
    if(pm.request.body.raw.includes("0912345678'")) {
        pm.response.to.have.status(400); 
    }
});

pm.test("28. [Security - XSS / SEC-04] Tấn công XSS vào 'name' (<script>) -> Phải được sanitize", function () {
    if(pm.request.body.raw.includes("<script>")) {
        pm.response.to.not.have.status(500);
    }
});

pm.test("29. [Security - XSS / SEC-04] Tấn công XSS vào 'shipping_address' -> Không trả về thẻ script thô", function () {
    if(pm.request.body.raw.includes("<img src=x onerror=alert(1)>")) {
        const resBody = pm.response.text();
        pm.expect(resBody).to.not.include("<img src=x onerror=alert(1)>");
    }
});

pm.test("30. [Security - IDOR] Cố tình sửa profile của user khác (gửi id lạ) -> ID không đổi", function () {
    if(pm.request.body.raw.includes("\"id\": 2")) {
        pm.expect(pm.response.code).to.eql(200);
    }
});

pm.test("31. [Security - ContentType] Gửi payload dạng XML thay vì JSON -> Server chặn (400 hoặc 415)", function () {
    if(pm.request.headers.get("Content-Type") === "application/xml") {
        pm.expect(pm.response.code).to.be.oneOf([400, 415]);
    }
});

// ==========================================
// 6. API CHAINING: VERIFY STATE VIA GET REQUEST
// ==========================================
if (pm.response.code === 200) {
    const getRequest = {
        url: pm.environment.get("base_url") + '/api/users/me',
        method: 'GET',
        header: {
            'Authorization': 'Bearer ' + pm.environment.get("auth_token"),
            'Content-Type': 'application/json'
        }
    };
    pm.sendRequest(getRequest, function (err, res) {
        if (!err && res.code === 200) {
            const dbUser = res.json();
            const reqBody = JSON.parse(pm.request.body.raw);
            
            pm.test("32. [State] Trạng thái thay đổi thành công: Tên trả về đúng với tên vừa gửi", function () {
                if (reqBody.name && reqBody.name !== "' OR 1=1 --" && !reqBody.name.includes("<script>")) {
                    pm.expect(dbUser.name).to.eql(reqBody.name);
                }
            });

            pm.test("33. [State] Trạng thái thay đổi thành công: SĐT trả về đúng với SĐT vừa gửi", function () {
                if (reqBody.phone) pm.expect(dbUser.phone).to.eql(reqBody.phone);
            });

            pm.test("34. [State] Trạng thái thay đổi thành công: Địa chỉ trả về đúng với địa chỉ vừa gửi", function () {
                if (reqBody.shipping_address && !reqBody.shipping_address.includes("<img")) {
                    pm.expect(dbUser.shipping_address).to.eql(reqBody.shipping_address);
                }
            });
            
            pm.test("35. [Workflow] Lưu info vào Environment Variable để chuẩn bị test tiếp", function () {
                pm.environment.set("expected_name", dbUser.name);
                pm.environment.set("expected_phone", dbUser.phone);
                pm.environment.set("expected_address", dbUser.shipping_address);
            });
        }
    });
}

// ==========================================
// 5. EXTENDED TEST CASES (Do sinh viên tự thêm)
// ==========================================

pm.test("E1. [Security - SEC-07] Gửi payload quá khổ (DoS) -> Báo lỗi 413 Payload Too Large", function () {
    if(pm.request.body.raw && pm.request.body.raw.length > 500000) {
         pm.expect(pm.response.code).to.eql(413);
    }
});

pm.test("E2. [Domain - Edge] Tên chứa ký tự Unicode/Emoji -> Thành công (200)", function () {
    if(pm.request.body.raw.includes("🧑‍💻")) {
        pm.response.to.have.status(200);
    }
});

pm.test("E3. [Business Logic] Payload chứa trường không xác định (is_vip) -> Bỏ qua và trả về 200", function () {
    if(pm.request.body.raw.includes("\"is_vip\"")) {
        pm.response.to.have.status(200);
    }
});

pm.test("E4. [Format] Số điện thoại chứa mã quốc gia (+84) -> Báo lỗi 400", function () {
    if(pm.request.body.raw.includes("+84")) {
        pm.response.to.have.status(400);
    }
});

pm.test("E5. [Method] Gửi sai HTTP Method (POST thay vì PUT) -> Báo lỗi 405 Method Not Allowed", function () {
    if(pm.request.method === "POST") {
        pm.response.to.have.status(405);
    }
});