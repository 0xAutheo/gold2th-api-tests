import fetch from 'node-fetch';

/**
 * Fetch content from a local IPFS node via its HTTP gateway
 * @param {string} cidStr - The CID to fetch
 * @returns {Promise<string>} - The content as a string
 */
export async function fetchFromIPFS(cidStr) {
    const gatewayUrl = `http://localhost:28081/ipfs/${cidStr}`;

    try {
        const response = await fetch(gatewayUrl);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.text();
    } catch (error) {
        console.error(`Failed to fetch from IPFS at ${gatewayUrl}`, error);
        throw error;
    }
}
