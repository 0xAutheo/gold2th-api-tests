// @ts-check
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load wallet generated in global-setup.js
const wallet = JSON.parse(
    fs.readFileSync(path.join('__tests__', '..', 'wallet.json'))
);

test.describe('Wallet Get Private Key API', () => {
    const baseURL = 'http://localhost:61872';
    const endpoint = '/api/wallet/get-private-key';

    test('should return the same private key for generated wallet', async ({ request }) => {
        const response = await request.post(`${baseURL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5174',
                'Referer': 'http://localhost:5174/',
            },
            data: {
                address: wallet.address, // use the wallet generated once
            },
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        console.log('🔑 Private Key API Response:', body);

        // ✅ Validate private key matches what was generated initially
        expect(body).toHaveProperty('privateKey');
        expect(body.privateKey).toMatch(/^0x[0-9a-fA-F]{64}$/);
        expect(body.privateKey).toBe(wallet.privateKey);
    });
});
