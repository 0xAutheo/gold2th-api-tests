// @ts-check
import { test, expect } from '@playwright/test';

test.describe('DID Session API', () => {
    const apiURL = 'http://localhost:61872/api/did/session';

    test('should call DID Session API with headers and cookies', async ({ request }) => {
        const response = await request.get(apiURL, {
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'If-None-Match': 'W/"55-Z2Y1cLmLj8mBHV/X/GWAYcz16o0"',
                'Origin': 'http://localhost:5174',
                'Referer': 'http://localhost:5174/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
                'sec-ch-ua':
                    '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            },
            cookies: [
                {
                    name: 'Idea-993a74bb',
                    value: '3e9c8dc3-abf8-4f65-a02c-a601b0ecdbf3',
                    domain: 'localhost',
                    path: '/',
                },
            ],
        });

        // Assertions
        expect(response.ok()).toBeTruthy();
        console.log('Status:', response.status());

        const bodyText = await response.text();
        console.log('Response Body:', bodyText);

        // Example validation (adjust depending on actual API response)
        expect(response.status()).toBe(200);
    });
});
