import {GraphQLClient} from "graphql-request";

const client = new GraphQLClient("http://localhost:9090/graphql");

const testWallet = "0x2345678901234567890123456789012345678901";
const testPublicKey = "5K2Yz9W3kWpHusSRIveq3sOvqGRz9KRGxB0sC4dE5fG7hI8jK9l";

describe("DID Resolution - IPFS and Redis", () => {
    let didID;

    beforeAll(async () => {
        const mutation = `
      mutation CreateDID($wallet: String!, $publicKey: String!) {
        createDiD(wallet: $wallet, publicKey: $publicKey) {
          id
        }
      }
    `;

        const variables = {wallet: testWallet, publicKey: testPublicKey};
        const response = await client.request(mutation, variables);

        expect(response).toHaveProperty("createDiD");
        didID = response.createDiD.id;
        expect(didID).toMatch(/^did:/);
    });

    const resolveDIDQuery = `
    query ResolveDID($did: String!) {
      resolveDID(did: $did) {
        id
        publicKey {
          id
          type
          controller
          publicKeyBase58
        }
        authentication
        service {
          id
          type
          serviceEndpoint
        }
      }
    }
  `;

    test("First Resolution - should come from IPFS (slower)", async () => {
        const start = Date.now();

        const response = await client.request(resolveDIDQuery, {did: didID});
        const duration = Date.now() - start;

        expect(response).toHaveProperty("resolveDID");
        expect(response.resolveDID.id).toBe(didID);

        console.log(`IPFS response took ${duration}ms`);
        expect(duration).toBeGreaterThan(10); // Customize threshold if needed
    });

    test("Second Resolution - should come from Redis cache (faster)", async () => {
        const start = Date.now();

        const response = await client.request(resolveDIDQuery, {did: didID});
        const duration = Date.now() - start;

        expect(response).toHaveProperty("resolveDID");
        expect(response.resolveDID.id).toBe(didID);

        console.log(`Redis response took ${duration}ms`);
        expect(duration).toBeLessThan(10); // Customize threshold based on your infra
    });
});
