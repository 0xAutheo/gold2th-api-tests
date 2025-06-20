import {GraphQLClient} from "graphql-request";

const endpoint = "http://localhost:9090/graphql";

export const client = new GraphQLClient(endpoint, {
    headers: {"Content-Type": "application/json"}
});

export async function createDID(wallet, publicKey) {
    const mutation = `
    mutation CreateDID($wallet: String!, $publicKey: String!) {
      createDiD(wallet: $wallet, publicKey: $publicKey) {
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
    const variables = {wallet, publicKey};
    return await client.request(mutation, variables);
}

export async function resolveDID(did) {
    const query = `
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
    const variables = {did};
    return await client.request(query, variables);
}
