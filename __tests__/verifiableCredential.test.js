// import {create} from "ipfs-http-client";
//
// describe("Verifiable Credential - IPFS Storage", () => {
//     const testVCID = "vc:test:12345";
//     const ipfs = create({url: "http://localhost:5001"});
//
//     test("VC_IPFS_Storage", async () => {
//         const vcDocument = {
//             "@context": [
//                 "https://www.w3.org/2018/credentials/v1",
//                 "https://www.w3.org/2018/credentials/examples/v1"
//             ],
//             id: testVCID,
//             type: ["VerifiableCredential", "UniversityDegreeCredential"],
//             issuer: {
//                 id: "did:sovereign:key:issuer123"
//             },
//             credentialSubject: {
//                 id: "did:sovereign:key:subject456",
//                 name: "John Doe",
//                 email: "john.doe@example.com",
//                 degree: "Bachelor of Science"
//             }
//         };
//
//         // Add to IPFS
//         const {cid} = await ipfs.add(JSON.stringify(vcDocument));
//         expect(cid).toBeDefined();
//         const cidStr = cid.toString();
//         console.log(`✓ VC stored in IPFS with CID: ${cidStr}`);
//
//         // Pin the CID
//         await ipfs.pin.add(cidStr);
//         console.log(`✓ VC pinned in IPFS with CID: ${cidStr}`);
//
//         // Verify it's pinned
//         const pinLs = ipfs.pin.ls();
//         let found = false;
//         for await (const pin of pinLs) {
//             if (pin.cid.toString() === cidStr) {
//                 found = true;
//                 break;
//             }
//         }
//         expect(found).toBe(true);
//         console.log(`✓ VC pin status verified for CID: ${cidStr}`);
//
//         // Retrieve from IPFS
//         const stream = ipfs.cat(cidStr);
//         const chunks = [];
//         for await (const chunk of stream) {
//             chunks.push(chunk);
//         }
//         const retrievedContent = Buffer.concat(chunks).toString();
//         const retrievedVC = JSON.parse(retrievedContent);
//
//         // Validate content
//         expect(retrievedVC.id).toBe(testVCID);
//         expect(retrievedVC.credentialSubject).toEqual(vcDocument.credentialSubject);
//         console.log(`✓ VC content verified after retrieval from IPFS CID: ${cidStr}`);
//     });
// });
