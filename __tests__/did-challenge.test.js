// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Auth Challenge API', () => {
    const apiURL = 'http://localhost:61872/api/auth/challenge';

    test('should request challenge for wallet address', async ({ request }) => {
        const response = await request.post(apiURL, {
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
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
            data: {
                address: '0x398D49B6a3Adcf2D3E54CaF19ba300e777d9c300',
            },
        });

        // Assertions
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const body = await response.json();
        console.log('Auth Challenge Response:', body);

        // Example validation (adjust to your API’s schema)
        expect(body).toHaveProperty('challenge');
        expect(typeof body.challenge).toBe('string');
    });
});
