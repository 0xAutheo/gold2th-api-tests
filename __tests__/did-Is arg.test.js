// @ts-check
import { test, expect } from '@playwright/test';

test.describe('IPFS Files LS API', () => {
    const baseURL = 'http://localhost:5002';
    const endpoint = '/api/v0/files/ls';
    const query = '?arg=%2Fautheo-did%2F0x398D49B6a3Adcf2D3E54CaF19ba300e777d9c300&long=true';

    const headers = {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
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

    test('should list files for DID path', async ({ request }) => {
        const response = await request.post(`${baseURL}${endpoint}${query}`, {
            headers,
            data: '' // Content-Length: 0
        });

        const status = response.status();
        console.log('ℹ️ Response status:', status);

        const json = await response.json();
        console.log('✅ Files LS Response:', json);

        if (status === 200 && json.Entries) {
            // Success case
            expect(json).toHaveProperty('Entries');
            expect(Array.isArray(json.Entries)).toBe(true);

            if (json.Entries.length > 0) {
                const first = json.Entries[0];
                expect(first).toHaveProperty('Name');
                expect(first).toHaveProperty('Type');
                expect(first).toHaveProperty('Size');
                expect(first).toHaveProperty('Hash');
            }
        } else {
            // Error case (path not found)
            expect(json).toHaveProperty('Message', 'file does not exist');
            expect(json).toHaveProperty('Code');
            expect(json).toHaveProperty('Type', 'error');
            expect([404, 500]).toContain(status);
        }
    });
});
