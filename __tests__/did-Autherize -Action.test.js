// @ts-check
import { test, expect } from '@playwright/test';

test.describe('DID Authorize Action API', () => {
    const baseURL = 'http://localhost:61872';             // <- adjust if different
    const endpoint = '/api/blockchain/authorize-action';   // <- put the exact path
    const headers = {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174',
        'Referer': 'http://localhost:5174/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
    };

    // TODO: put the real expected payload here
    const payload = {
        // e.g. did, action, signature, metadata, nonce...
        // did: 'did:autheo:...',
        // action: 'LOGIN',
        // signature: '0x...',
        // metadata: '...',
        // nonce: '...'
    };

    // 1) Diagnostic test: tolerate 200 or error, and log full body
    test('diagnostic: authorize-action returns 200 or structured error', async ({ request }) => {
        const res = await request.post(`${baseURL}${endpoint}`, { headers, data: payload });

        const status = res.status();
        const ct = res.headers()['content-type'] || '';
        const bodyText = await res.text();
        console.log('ℹ️ status=', status, 'content-type=', ct);
        console.log('↩ body:', bodyText);

        // Parse JSON if possible
        let json;
        try { json = JSON.parse(bodyText); } catch (_) { /* keep text */ }

        if (status === 200) {
            expect(json).toBeDefined();
            // Adjust these to your real success schema:
            expect(json).toHaveProperty('sessionId');
            // e.g. expect(json).toHaveProperty('authorized', true);
        } else {
            // Accept common error codes for validation/auth failures
            expect([400, 401, 403, 409, 422, 500]).toContain(status);

            // Check structured error if JSON
            if (json && typeof json === 'object') {
                // Many backends use one of these shapes:
                expect(
                    json.error || json.message || json.Message || json.reason
                ).toBeDefined();
            } else {
                // If not JSON, at least ensure some text is present
                expect(bodyText.length).toBeGreaterThan(0);
            }
        }
    });

    // // 2) Strict happy path (enable once your backend is wired / preconditions met)
    // test.skip('happy path: authorize-action succeeds with 200 and expected shape', async ({ request }) => {
    //     const res = await request.post(`${baseURL}${endpoint}`, { headers, data: payload });
    //     expect(res.status()).toBe(200);
    //
    //     const json = await res.json();
    //     // Replace with your exact schema:
    //     expect(json).toMatchObject({
    //         sessionId: expect.any(String),
    //         // authorized: true,
    //         // txHash: expect.stringMatching(/^0x[a-f0-9]{64}$/i),
    //     });
    // });

    // 3) Negative path: invalid signature (or required field missing)
    test('negative: invalid/empty signature should fail with auth/validation error', async ({ request }) => {
        const bad = { ...payload, signature: '0xINVALID' }; // or delete a required field
        const res = await request.post(`${baseURL}${endpoint}`, { headers, data: bad });

        expect([400, 401, 403, 422]).toContain(res.status());
        const body = await res.text();

        let json;
        try { json = JSON.parse(body); } catch (_) {}

        if (json) {
            expect(json.error || json.message || json.reason || json.Message).toBeDefined();
        } else {
            expect(body).toMatch(/error|invalid|unauthor/i);
        }
    });
});
