import fetch from 'node-fetch';
import {create} from "ipfs-http-client";

/**
 * Fetch content from a local IPFS node via its HTTP gateway
 * @param {string} cidStr - The CID to fetch
 * @returns {Promise<string>} - The content as a string
 */
export async function fetchFromIPFS(cidStr) {
    const gatewayUrl = `http://localhost:28081/ipfs/${cidStr}`;


    try {
        //Approach#1 : Which is not working in my PC due to some issue
        // const response = await fetch(gatewayUrl);
        // if (!response.ok) {
        //     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        // }
        // return await response.text();


        //Approach#2 : Had to install 'ipfs-http-client' node package to make it work
        //Create ipfs client
        const client = create({ url: 'http://127.0.0.1:5001' });
        // Get content by hash
        const stream = client.cat(cidStr);
        const decoder = new TextDecoder();
        let data = '';

        for await (const chunk of stream) {
            data += decoder.decode(chunk);
        }
        console.log('Retrieved content:', data);

        return data;
        //return await '{"authTag":"hBs+kEFYip1NnJuiA6VJYw==","encrypted":"iM1VRReljAKcC+pRcuwx5bfgfyjQddxHda66u15TsF8LPplzmoDExzCOhYVpMiqD3VoUQsZBXWwiVQjGmy7Ij9mVWF07cixoGj1eTNF+IPZXBunQIZ9g4Pko2HbK/CoBhNba7IbLXfWL6ydiELkR6aitjg+8cyjzYjIW0Q3wHVRdmmZOWoBfquTxBkEJI18LU7+K+ZAoSTePb5WiS6ClYY/sVc/HMpo2ry13dZ+WH1TwWefn9vufO8F3cIH/MPJMF8dptj14VfrapVxmX8MxnQwAqSF46YzGcoJxcv32cUXqTMFoWH7/cNwyCtfCQMKWR16tUGFsWCkuuKymc8CnVWAMkFUnJ4klFcy26c4Nw0xZQnGOwznv1WQ1OKNsg+HWo4svc38KS4ww11ZZHXpqqTy7EvFegfwOnL80EfRl0iui5XB/ZE7GmtsrmQwm9OFornidfRtjyGAXpMNLU/iwWuS7+u+8/5C1O3xagL1ZFU0Y6gUtIYtY8iHQmfjZF3Oajlrx+uhNqSz1k7MVFB83IwAf7bi5jELHGTwRm8lT5JNczxe80W47O4aRLKrus31uzBPIZQPd0R5NGns0pPO34qdjr23lv0bviZPHBOViVsEPB5gR9ytEal4zfsB8yv8EUVAuV1KFvfmZ32inOSbTIu1jKv8+b25ukb81HSN17lFowg698oG7CbVZk+OmrXtEs+hypis4Anku9OrW1SyjeOCrrriu4z+QdbBugTxD0Pg4g4rZb7MJg88uRDLaBWFI/P5n+76R1X25pIDYglPriqrNNSFqnrU=","iv":"fqFARUiPM9TeKuTc"}';
    } catch (error) {
        console.error(`Failed to fetch from IPFS at ${gatewayUrl}`, error);
        throw error;
    }
}
