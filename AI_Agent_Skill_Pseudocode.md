# AI AGENT SKILL: POSTMAN TEST GENERATOR WORKFLOW & PSEUDOCODE

- **Student name:** Dương Gia Huy
- **Student ID:** 23127052
- **Agent Skill name:** `postman-test-generator`

---

### 1. AI Agent Skill Flow Diagram

![Screenshot Agent Skill Flow Diagram](images/flow_diagram_agent_skill.jpg)

### 2. Pseudocode Quy Trình Hoạt Động (Agent Skill Workflow Pseudocode)

```text
ALGORITHM PostmanTestGeneratorAgent(api_spec, security_rules, target_min_tests = 35)
    INPUT:
        api_spec: Tài liệu đặc tả OpenAPI hoặc Markdown (Endpoint, Method, Params, Body Schema, Response)
        security_rules: Các quy chuẩn an toàn thông tin bắt buộc (SEC-01 đến SEC-07)
        target_min_tests: Ngưỡng số lượng test case tối thiểu bắt buộc (Mặc định = 35)
    OUTPUT:
        postman_script: Khối mã JavaScript hoàn chỉnh chạy trong Tests tab của Postman (pm.test, pm.expect, tv4, pm.sendRequest)

    // =========================================================================
    // BƯỚC 1: TIẾP NHẬN VÀ PHÂN TÍCH ĐẶC TẢ (Specification Ingestion & Parsing)
    // =========================================================================
    endpoint, method   ← ParseEndpointAndMethod(api_spec)
    request_schema     ← ParseRequestBodySchema(api_spec)
    params             ← ParsePathAndQueryParams(api_spec)
    expected_responses ← ParseResponseSpecifications(api_spec)
    
    test_suite ← EmptyList()

    // =========================================================================
    // BƯỚC 2: LẬP KẾ HOẠCH PHÂN BỔ 4 KHÍA CẠNH (Dimension Quota Allocation)
    // =========================================================================
    quota_schema   ← Max(4,  Round(target_min_tests * 0.10))   // Schema: ~10% (>= 4 TCs)
    quota_domain   ← Max(18, Round(target_min_tests * 0.50))   // Domain: ~50% (>= 18 TCs)
    quota_state    ← Max(6,  Round(target_min_tests * 0.15))   // State:  ~15% (>= 6 TCs)
    quota_security ← Max(7,  Round(target_min_tests * 0.25))   // Security: ~25% (>= 7 TCs)

    // =========================================================================
    // BƯỚC 3: SINH CÁC TEST CASES THEO 4 TRỤ CỘT CHUYÊN MÔN
    // =========================================================================
    
    // --- 3.1. SCHEMA VALIDATION (Xác thực cấu trúc JSON phản hồi) ---
    json_schema ← BuildJsonSchema(expected_responses.success_body)
    test_suite.Append(CreateTest(
        title = "[Schema] Response đúng định dạng JSON object",
        assertion = "pm.expect(pm.response.json()).to.be.an('object');"
    ))
    test_suite.Append(CreateTest(
        title = "[Schema] Response khớp 100% với Schema định nghĩa",
        assertion = "pm.response.to.have.jsonSchema(" + JSON.Stringify(json_schema) + ");"
    ))
    test_suite.Append(CreateTest(
        title = "[Schema] Kiểm tra các trường bắt buộc (Required fields)",
        assertion = "json_schema.required.forEach(field => pm.expect(res[field]).to.not.be.undefined);"
    ))

    // --- 3.2. DOMAIN PARTITIONS & BOUNDARY VALUES (Phân vùng tương đương & Giá trị biên) ---
    FOREACH field IN request_schema.fields DO:
        // Phân vùng hợp lệ (Happy Path / Valid Class)
        test_suite.Append(CreateDomainTest(
            field, value = field.sample_valid_value, 
            expect_status = 200, desc = "Giá trị hợp lệ theo đặc tả"
        ))
        
        // Phân vùng biên & góc chết (Invalid Classes & Boundaries)
        test_suite.Append(CreateDomainTest(field, value = "", expect_status = 400, desc = "Chuỗi rỗng"))
        test_suite.Append(CreateDomainTest(field, value = "   ", expect_status = 400, desc = "Toàn khoảng trắng"))
        test_suite.Append(CreateDomainTest(field, value = NULL, expect_status = 400, desc = "Giá trị null"))
        test_suite.Append(CreateDomainTest(field, value = OmitField(), expect_status = 400, desc = "Thiếu trường bắt buộc"))
        
        IF field.type == STRING THEN:
            test_suite.Append(CreateDomainTest(field, value = GenerateString(field.max_len + 1), expect_status = 400, desc = "Vượt quá độ dài tối đa"))
        ELSE IF field.type == INTEGER THEN:
            test_suite.Append(CreateDomainTest(field, value = 0, expect_status = 400, desc = "Biên dưới không hợp lệ = 0"))
            test_suite.Append(CreateDomainTest(field, value = -1, expect_status = 400, desc = "Số âm"))
            test_suite.Append(CreateDomainTest(field, value = 1.5, expect_status = 400, desc = "Số thập phân vi phạm Integer"))
            test_suite.Append(CreateDomainTest(field, value = "123", expect_status = 400, desc = "Sai kiểu dữ liệu chuỗi"))
        END IF
    END FOREACH

    // --- 3.3. STATE TRANSITIONS & DATA INTEGRITY (Chuyển đổi trạng thái) ---
    IF method IN ["POST", "PUT", "DELETE"] THEN:
        read_endpoint ← IdentifyQueryEndpoint(endpoint)
        // Thiết lập API Chaining bằng pm.sendRequest
        test_suite.Append(CreateChainedStateTest(
            title = "[State] Xác minh dữ liệu đã thay đổi trên database",
            chain_target = read_endpoint,
            verify_logic = "pm.expect(remote_data[field]).to.eql(updated_value);"
        ))
        test_suite.Append(CreateChainedStateTest(
            title = "[State] Xác minh dữ liệu cũ không bị ghi đè thành null",
            chain_target = read_endpoint,
            verify_logic = "pm.expect(remote_data.untouched_field).to.eql(previous_value);"
        ))
    END IF

    // --- 3.4. SECURITY & VULNERABILITY TESTING (Kiểm thử an ninh - SEC-01 đến SEC-07) ---
    test_suite.Append(CreateSecurityTest(
        title = "[Security-Auth] Không truyền Header Authorization",
        headers = {"Authorization": None}, expect_status = 401
    ))
    test_suite.Append(CreateSecurityTest(
        title = "[Security-Auth] Truyền JWT token giả mạo hoặc hết hạn",
        headers = {"Authorization": "Bearer invalid_jwt_token_xyz"}, expect_status = 401
    ))
    test_suite.Append(CreateSecurityTest(
        title = "[Security-SQLi] Tấn công SQL Injection vào tham số",
        payload = {"id": "1 OR 1=1 --", "phone": "' OR 'a'='a"}, expect_status = 400
    ))
    test_suite.Append(CreateSecurityTest(
        title = "[Security-XSS] Tấn công Stored XSS bằng thẻ script",
        payload = {"name": "<script>alert(1)</script>"}, expect_status = "200_Sanitized/400"
    ))
    test_suite.Append(CreateSecurityTest(
        title = "[Security-Privilege] Mass Assignment nâng quyền role admin",
        payload = {"role": "admin"}, expect_status = "200_RoleUnchanged/403"
    ))
    test_suite.Append(CreateSecurityTest(
        title = "[Security-IDOR] Ghi đè khóa chính ID người dùng/tài nguyên",
        payload = {"id": 9999}, expect_status = "200_IDUnchanged/400"
    ))
    test_suite.Append(CreateSecurityTest(
        title = "[Security-ContentType] Gửi Content-Type XML thay vì JSON",
        headers = {"Content-Type": "application/xml"}, payload = "<xml>data</xml>", expect_status = "400/415"
    ))

    // =========================================================================
    // BƯỚC 4: TỰ KIỂM SOÁT CHẤT LƯỢNG (Quality Gate & Self-Correction Loop)
    // =========================================================================
    WHILE Length(test_suite) < target_min_tests DO:
        extra_case ← SynthesizeCornerCase(request_schema, endpoint)
        test_suite.Append(extra_case)
    END WHILE

    // Thẩm tra cú pháp Postman Sandbox & Bảo đảm Headers chuẩn
    FOREACH tc IN test_suite DO:
        ValidateJavascriptSyntax(tc.code)
        EnsureHeader(tc.chain_requests, header_name="X-Student-Id", header_val="23127052")
    END FOREACH

    // =========================================================================
    // BƯỚC 5: ĐÓNG GÓI VÀ XUẤT BẢN SCRIPT
    // =========================================================================
    formatted_script ← FormatOutputScript(test_suite, group_by_categories=TRUE)
    RETURN formatted_script
END ALGORITHM
```
