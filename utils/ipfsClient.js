let ipfs;

export async function fetchFromIPFS(cid) {
    if (!ipfs) {
        const {create} = await import("ipfs-http-client");
        ipfs = create({url: "http://localhost:5001"});
    }

    try {
        const stream = ipfs.cat(cid);
        const chunks = [];

        for await (const chunk of stream) {
            chunks.push(chunk);
        }

        return Buffer.concat(chunks).toString();
    } catch (error) {
        console.error(`Failed to fetch IPFS content for CID: ${cid}`, error);
        throw error;
    }
}
