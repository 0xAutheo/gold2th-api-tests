// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Blockchain Authenticate Session API', () => {
    const baseURL = 'http://localhost:61872';
    const endpoint = '/api/blockchain/authenticate-session';

    const headers = {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174',
        'Referer': 'http://localhost:5174/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
    };

    const cookies = {
        'Idea-993a74bb': '3e9c8dc3-abf8-4f65-a02c-a601b0ecdbf3'
    };

    const payload = {
        privateKey: "0x84a197874157636ed8f7193abd3399149c6f1a7ebdbbf96730175e332fc9c2f6",
        signature: "0xd25dd58f6e7a5198547a07a61aff36ca3f6911724fd7c500ec90bb9ba5003d885528974694009e311921754783eb37748f99822ac3d42f40d41a2e4a17323e331b",
        metadata: "Autheo App Login - 2025-09-01T09:05:24.716Z",
        sigType: 0
    };

    test('should authenticate session successfully', async ({ request }) => {
        const response = await request.post(`${baseURL}${endpoint}`, {
            headers,
            data: payload
        });

        expect(response.status()).toBe(200);

        const json = await response.json();
        console.log('✅ Authenticate Session Response:', json);

        // Validate actual response structure
        expect(json).toHaveProperty('sessionId');
        expect(typeof json.sessionId).toBe('string');

        expect(json).toHaveProperty('transaction');
        expect(json.transaction).toHaveProperty('chainId');
        expect(typeof json.transaction.chainId).toBe('number');

        expect(json.transaction).toHaveProperty('hash');
        expect(json.transaction.hash).toMatch(/^0x[a-fA-F0-9]{64}$/);

        // Extra checks for Ethereum tx object
        expect(json.transaction).toHaveProperty('from');
        expect(json.transaction).toHaveProperty('to');
        expect(json.transaction).toHaveProperty('nonce');
    });


    test('should fail with invalid signature', async ({ request }) => {
        const invalidPayload = { ...payload, signature: "0xINVALIDSIGNATURE" };

        const response = await request.post(`${baseURL}${endpoint}`, {
            headers,
            data: invalidPayload
        });

        // Accept multiple possible error codes
        expect([500]).toContain(response.status());

        const json = await response.json();
        console.log('❌ Invalid Auth Response:', json);

        // Validate that response contains error info
        expect(json).toHaveProperty('error'); // if API returns structured error
        // OR if it's a message object:
        // expect(json).toHaveProperty('message');
    });

});
