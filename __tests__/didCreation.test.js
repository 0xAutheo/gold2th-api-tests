import {createDID} from "../utils/graphqlClient.js";
import {fetchFromIPFS} from "../utils/ipfsClient.js";
import {getDIDMetadata, getWalletDIDRelation} from "../utils/neo4jClient.js";

describe("DID Creation Flow", () => {
    const testWallet = "1234567890abcdef";
    const testPublicKey = "ABCD1234PUBLICKEY";
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
