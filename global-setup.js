import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // npm i node-fetch@2

export default async function globalSetup() {
    const generateURL = 'http://localhost:61872/api/wallet/generate';

    const response = await fetch(generateURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ silent: false }),
    });

    if (!response.ok) {
        throw new Error(`Failed to generate wallet. Status: ${response.status}`);
    }

    const wallet = await response.json();
    console.log('Wallet generated in global setup:', wallet);

    // Save to project root
    fs.writeFileSync(path.join(process.cwd(), 'wallet.json'), JSON.stringify(wallet, null, 2));
}
