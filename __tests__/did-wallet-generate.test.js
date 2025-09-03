import { test, expect } from '@playwright/test';

test.describe('Wallet API Flow', () => {
    const generateURL = 'http://localhost:61872/api/wallet/generate';
    const privateKeyURL = 'http://localhost:61872/api/wallet/get-private-key';
    const signURL = 'http://localhost:61872/api/blockchain/sign-message';

    let wallet;

    test.beforeAll(async ({ request }) => {
        test.setTimeout(180_000);

        const response = await request.post(generateURL, {

            headers: { 'Content-Type': 'application/json' },
            data: { silent: false }
        });
        expect(response.ok()).toBeTruthy();
        wallet = await response.json();
        console.log('Generated Wallet:', wallet);
    });

    test('should generate wallet', async () => {
        expect(wallet).toHaveProperty('address');
        expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });
});