// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:61872';
const ENDPOINT = '/api/blockchain/is-authenticated';

const COMMON_HEADERS = {
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
};

// Helper to extract boolean flag across possible API response shapes
const pickAuthFlag = (obj) =>
    obj?.authenticated ?? obj?.isAuthenticated ?? obj?.success;

test.describe('POST /api/blockchain/is-authenticated', () => {
    /* ✅ Positive test */
    test('should return authenticated status with valid sessionId', async ({
                                                                               request,
                                                                           }) => {
        const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
            headers: { ...COMMON_HEADERS, Cookie: 'Idea-993a74bb=3e9c8dc3-abf8-4f65-a02c-a601b0ecdbf3' },
            data: { sessionId: '0' },
        });

        expect([200, 204]).toContain(response.status());

        if (response.status() !== 204) {
            const body = await response.json();
            const flag = pickAuthFlag(body);
            expect(typeof flag).toBe('boolean');
            console.log('✅ Authenticated response:', body);
        }
    });

    /* ❌ Negative test: wrong session */
    test('should return false or error for invalid sessionId', async ({ request }) => {
        const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
            headers: { ...COMMON_HEADERS, Cookie: 'Idea-993a74bb=3e9c8dc3-abf8-4f65-a02c-a601b0ecdbf3' },
            data: { sessionId: 'bogus' },
        });

        expect([200, 401, 403]).toContain(response.status());

        if (response.status() === 200) {
            const body = await response.json();
            const flag = pickAuthFlag(body);
            expect(flag).toBe(false);
            console.log('⚠️ Unauthenticated response (bad session):', body);
        }
    });

    /* ❌ Negative test: missing cookie */
    test('should fail or return false if cookie is missing', async ({ request }) => {
        const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
            headers: { ...COMMON_HEADERS }, // no Cookie
            data: { sessionId: '0' },
        });

        expect([200, 401, 403]).toContain(response.status());

        if (response.status() === 200) {
            const body = await response.json();
            const flag = pickAuthFlag(body);
            expect(flag).toBe(false);
            console.log('⚠️ Unauthenticated response (no cookie):', body);
        }
    });
});
