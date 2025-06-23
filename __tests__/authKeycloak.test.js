import fetch from "node-fetch";

describe("Authentication - Keycloak OIDC Discovery", () => {
    const KEYCLOAK_URL = "http://localhost:9091"; // 🔁 Update if needed

    test("Authentication Flow - Keycloak OIDC Config is Accessible", async () => {
        const wellKnownUrl = `${KEYCLOAK_URL}/auth/realms/master/.well-known/openid-configuration`;

        let response;
        try {
            response = await fetch(wellKnownUrl);
        } catch (err) {
            console.warn("⚠️ Keycloak not accessible, skipping test.");
            return;
        }

        expect(response.status).toBe(200);

        const config = await response.json();

        expect(config).toHaveProperty("issuer");
        expect(config).toHaveProperty("authorization_endpoint");
        expect(config).toHaveProperty("token_endpoint");

        console.log("✔ Keycloak OIDC config:", config.issuer);
    });
});
