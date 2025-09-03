// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Autheo Testnet RPC - eth_chainId', () => {
    const baseURL = 'https://testnet-rpc1.autheo.com/';

    const headers = {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Origin': 'http://localhost:5174',
        'Referer': 'http://localhost:5174/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'content-type': 'application/json',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
    };

    const payload = {
        method: 'eth_chainId',
        params: [],
        id: 42,
        jsonrpc: '2.0'
    };

    test('should return the chainId', async ({ request }) => {
        const response = await request.post(baseURL, {
            headers,
            data: payload
        });

        // Ensure success
        expect(response.status()).toBe(200);

        const json = await response.json();
        console.log('✅ eth_chainId Response:', json);

        // Validate JSON-RPC structure
        expect(json).toHaveProperty('jsonrpc', '2.0');
        expect(json).toHaveProperty('id', 42);
        expect(json).toHaveProperty('result');

        // Validate that result is a hex string (chainId)
        expect(typeof json.result).toBe('string');
        expect(json.result).toMatch(/^0x[0-9a-fA-F]+$/);
    });

    test('should fail with invalid method', async ({ request }) => {
        const badPayload = { ...payload, method: 'eth_invalidMethod' };
        const response = await request.post(baseURL, {
            headers,
            data: badPayload
        });

        // Should still return 200 (JSON-RPC error is inside response)
        expect(response.status()).toBe(200);

        const json = await response.json();
        console.log('❌ Invalid Method Response:', json);

        // Validate error object
        expect(json).toHaveProperty('error');
        expect(json.error).toHaveProperty('code');
        expect(json.error).toHaveProperty('message');
    });
});
