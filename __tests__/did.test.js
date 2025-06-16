import {createDID} from "../utils/graphqlClient.js";
import {fetchFromIPFS} from "../utils/ipfsClient.js";
import {getDIDMetadata, getWalletDIDRelation} from "../utils/neo4jClient.js";

describe("DID Creation Flow", () => {
    const testWallet = "0x1234567890123456789012345678901234567890";
    const testPublicKey = "5K1Xz8V2jVoGtrSRHvdp2rNvpFQy8JQFxA9rB3cD4eF6gH7iJ8k";
    let didID, cid;

    test("Create DID via GraphQL", async () => {
        const response = await createDID(testWallet, testPublicKey);
        expect(response.createDiD).toBeDefined();

        didID = response.createDiD.id;
        const expectedDID = `did:sovereign:key:${testPublicKey}`;
        expect(didID).toBe(expectedDID);
    });

    test("Verify IPFS Storage", async () => {
        cid = await getDIDMetadata(didID);
        expect(cid).toMatch(/^ipfs:\/\/.*/);

        const actualCID = cid.replace("ipfs://", "");
        const content = await fetchFromIPFS(actualCID);
        const json = JSON.parse(content);

        expect(json).toHaveProperty("encrypted");
        expect(json).toHaveProperty("iv");
        expect(json).toHaveProperty("authTag");
    });

    test("Verify Neo4j Metadata", async () => {
        const exists = await getWalletDIDRelation(testWallet, didID);
        expect(exists).toBe(true);
    });
});
