import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "password")
);

export async function getDIDMetadata(did) {
    const session = driver.session();
    const result = await session.run(
        "MATCH (d:DID {id: $did}) RETURN d.documentCid as cid",
        {did}
    );
    await session.close();
    return result.records[0]?.get("cid");
}

export async function getWalletDIDRelation(wallet, did) {
    const session = driver.session();
    const result = await session.run(
        `
    MATCH (w:Wallet {address: $wallet})-[:OWNS]->(d:DID {id: $did})
    RETURN w.address as wallet, d.id as did
    `,
        {wallet, did}
    );
    await session.close();
    return result.records.length > 0;
}
