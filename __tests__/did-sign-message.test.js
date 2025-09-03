// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Blockchain Sign Message API', () => {
    const apiURL = 'http://localhost:61872/api/blockchain/sign-message';

    test('should sign a message using private key', async ({ request }) => {
        const response = await request.post(apiURL, {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
            data: {
                privateKey:
                    '0xd0e7c64fe857b57f7c4a515c99fc053472e0d1ccf75dba0e9ed6dcc3e42987d5',
                message: 'Autheo App Login - 2025-09-01T09:05:24.716Z',
            },
        });

        // Assertions on response status
        //expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        // ✅ Parse JSON (not text)
        const signature = await response.json();
        console.log('Sign Message Response:', signature);

        // ✅ Validations
        expect(signature).toMatch(/^0x[0-9a-fA-F]+$/); // hex string
        expect(signature.length).toBeGreaterThan(0);
    });
});
