import {createDID, resolveDID} from "../utils/graphqlClient.js";

const testWallet = "0x150A959BbE87dE4da6C876b929638E97619106C3";
const testPublicKey = "0250863AD64A87AE8A2FE83C1AF1A8403CB5579B1B6B62DA8D1BCBB833FB6C4B4C";

describe("DID Resolution - IPFS and Redis", () => {
    let didID;

    beforeAll(async () => {
        const response = await createDID(testWallet, testPublicKey);
        expect(response).toHaveProperty("createDiD");
        didID = response.createDiD.id;
        expect(didID).toMatch(/^did:/);
    });

    test("First Resolution - should come from IPFS (slower)", async () => {
        const start = Date.now();
        const response = await resolveDID(didID);
        const duration = Date.now() - start;

        expect(response).toHaveProperty("resolveDID");
        expect(response.resolveDID.id).toBe(didID);

        console.log(`IPFS response took ${duration}ms`);
        expect(duration).toBeGreaterThan(10); // Adjust threshold per your infra
    });

    test("Second Resolution - should come from Redis cache (faster)", async () => {
        const start = Date.now();
        const response = await resolveDID(didID);
        const duration = Date.now() - start;

        expect(response).toHaveProperty("resolveDID");
        expect(response.resolveDID.id).toBe(didID);

        console.log(`Redis response took ${duration}ms`);
        expect(duration).toBeLessThan(10); // Adjust threshold per your infra
    });
});
