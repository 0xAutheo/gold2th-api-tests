// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:61872';
const ENDPOINT = '/api/blockchain/check-permission';

const HEADERS = {
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
    'Cookie': 'Idea-993a74bb=3e9c8dc3-abf8-4f65-a02c-a601b0ecdbf3'
};

// helper to normalize flag
const pickFlag = (obj) =>
    obj?.allowed ?? obj?.hasPermission ?? obj?.success;

test.describe('POST /api/blockchain/check-permission', () => {
    /* ✅ Positive test */
    test('positive: valid walletAddress + action', async ({ request }) => {
        const res = await request.post(`${BASE_URL}${ENDPOINT}`, {
            headers: HEADERS,
            data: {
                walletAddress: '0x398D49B6a3Adcf2D3E54CaF19ba300e777d9c300',
                action: 'data_access'
            }
        });

        expect([200, 201]).toContain(res.status());

        const body = await res.json();
        const flag = pickFlag(body);
        expect(typeof flag).toBe('boolean');
        console.log('✅ check-permission success:', body);
    });

    /* ❌ Negative test: missing walletAddress */
    test('negative: missing walletAddress', async ({ request }) => {
        const res = await request.post(`${BASE_URL}${ENDPOINT}`, {
            headers: HEADERS,
            data: { action: 'data_access' }
        });

        expect([200, 400, 401, 403, 422]).toContain(res.status());

        const body = await res.json().catch(() => ({}));
        if (res.status() === 200) {
            expect(pickFlag(body)).toBe(false);
        } else {
            expect(typeof body).toBe('object');
        }
        console.log('⚠️ missing walletAddress response:', body);
    });

    /* ❌ Negative test: invalid action */
    test('negative: invalid action', async ({ request }) => {
        const res = await request.post(`${BASE_URL}${ENDPOINT}`, {
            headers: HEADERS,
            data: {
                walletAddress: '0x398D49B6a3Adcf2D3E54CaF19ba300e777d9c300',
                action: 'INVALID_ACTION'
            }
        });

        expect([200, 400, 401, 403, 422]).toContain(res.status());

        const body = await res.json().catch(() => ({}));
        if (res.status() === 200) {
            expect(pickFlag(body)).toBe(false);
        } else {
            expect(typeof body).toBe('object');
        }
        console.log('⚠️ invalid action response:', body);
    });
});
