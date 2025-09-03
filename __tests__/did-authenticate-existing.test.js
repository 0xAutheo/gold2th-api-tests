import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const wallet = JSON.parse(
    fs.readFileSync(path.join('__tests__', '..', 'wallet.json'))
);

test.describe('TheoID Authenticate Existing API', () => {
    const baseURL = 'http://localhost:61872';
    const endpoint = '/api/theoid/authenticate-existing';

    test('should authenticate existing user successfully', async ({ request }) => {
        const response = await request.post(`${baseURL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5174',
                'Referer': 'http://localhost:5174/',
            },
            data: {
                address:' wallet.address',
                challenge: 'Sign this message to authenticate with Autheo: xyz123'
            }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log('Auth Response:', body);
    });
});
