import {ethers} from "ethers";
import neo4j from "neo4j-driver";

describe("Consent Management - Smart Contract & Neo4j", () => {
    const AUTHEO_TESTNET_CHAIN_ID = 785n;

    const testWallet = "0x150A959BbE87dE4da6C876b929638E97619106C3";
    const testPurpose = "data-processing";
    const testAuthorizedParty = "0x4567890123456789012345678901234567890123";
    const testScope = "personal-data";
    const testDpNoise = 100;
    const testConsentTokenId = 12345;

    // Ethereum client setup
    const provider = new ethers.JsonRpcProvider("https://testnet-rpc1.autheo.com"); // Update as needed

    // Neo4j setup
    const driver = neo4j.driver(
        "bolt://localhost:7687",
        neo4j.auth.basic("neo4j", "password")
    );

    test("Grant Consent - Smart Contract Network Check", async () => {
        const chainId = await provider.getNetwork();

        expect(chainId).toHaveProperty("chainId");
        expect(chainId.chainId).toBe(AUTHEO_TESTNET_CHAIN_ID);

        console.log("Connected to Autheo testnet with Chain ID:", chainId.chainId);
    });

    test("Consent Metadata - Neo4j Graph Validation", async () => {
        const session = driver.session();

        // Create simulated consent node
        const timestamp = Math.floor(Date.now() / 1000);

        await session.executeWrite(async tx => {
            await tx.run(
                `
        MERGE (w:Wallet {address: $wallet})
        CREATE (c:Consent {
          id: $consentTokenId,
          purpose: $purpose,
          authorizedParty: $authorizedParty,
          timestamp: $timestamp,
          dpNoise: $dpNoise,
          isActive: true,
          scope: $scope
        })
        CREATE (w)-[:GRANTED]->(c)
        RETURN c.id as consentId
        `,
                {
                    wallet: testWallet,
                    consentTokenId: testConsentTokenId,
                    purpose: testPurpose,
                    authorizedParty: testAuthorizedParty,
                    timestamp: timestamp,
                    dpNoise: testDpNoise,
                    scope: testScope
                }
            );
        });

        // Read and verify
        const result = await session.executeRead(async tx => {
            return tx.run(
                `
        MATCH (w:Wallet {address: $wallet})-[:GRANTED]->(c:Consent)
        RETURN c.purpose as purpose, c.authorizedParty as authorizedParty, c.scope as scope
        `,
                {wallet: testWallet}
            );
        });

        const record = result.records[0];
        expect(record.get("purpose")).toBe(testPurpose);
        expect(record.get("authorizedParty")).toBe(testAuthorizedParty);
        expect(record.get("scope")).toBe(testScope);

        await session.close();
    });
});
