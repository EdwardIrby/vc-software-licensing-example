# Goal 
We have basic software license flow from a traditional server to a client. Then I'll try and switch it over to VC. The idea is that you shouldn't have to have a centralized server to verify a software license. 

- Create software did
- Create schema for right use our software
- We're going to manually issue a vc the did
- On the client the  you enter this  did and it sends a request to server to verify you're authorized by checking the DWN
- ....

## Requirements
- locally running DWN 
- Node >= 18 and Bun installed
- Docker
- (optional) Thunderbird or Postman or similar tool to run requests against DWN

## 1. DWN Setup

**Step 1: Clone the ssi-service repository**
`git clone git@github.com:TBD54566975/ssi-service.git`

**Step 2: Navigate into the cloned repository**
`cd ssi-service`

**Step 3: Checkout the this commit**
`git checkout 1aec0e9c8a23335b32757ef37ca428a4b2a6361d`

**step 4: Navigate into build directory**
`cd ssi-service/build`.

**step 5: Build and startup service**
`docker-compose up --build`.

**step 6: Check that services health**
`curl localhost:8080/health` 

## 2. vc-software-licensing-example repo setup
**Step 1: Clone the ssi-service repository**
```bash
cd ..
git clone git@github.com:EdwardIrby/vc-software-licensing-example.git
```
**Step 2: Navigate into the cloned repository**
`cd vc-software-licensing-example`

**Step 3: install dependencies**
`bun install`

## 3. Manually creating VC and DIDs

**Step 1: Generate software DID**
Run `curl -X PUT -d '{"keyType":"Ed25519"}' localhost:8080/v1/dids/key`

You'll receive a response like this:
```json
{
  "did": {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "id": "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC",
    "verificationMethod": [
      {
        "id": "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC#z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC",
        "type": "JsonWebKey2020",
        "controller": "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC",
        "publicKeyJwk": {
          "kty": "OKP",
          "crv": "Ed25519",
          "x": "rL0_XOkmyecUDV-F55vAnheBsRARvNs6D9GBgeFTErM",
          "alg": "EdDSA",
          "kid": "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC"
        }
      },
      {
        "id": "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC#z6LSrwmvtfkZrTzNUUqUYqnE9qedLR7tk56wmXV8aJJEnyLF",
        "type": "JsonWebKey2020",
        "controller": "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC",
        "publicKeyJwk": {
          "kty": "OKP",
          "crv": "X25519",
          "x": "4t5TLTw1UY5QDMFT-sprx3Pkdl-FFNvZaxtu74MjknQ",
          "alg": "X25519",
          "kid": "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC"
        }
      }
    ],
    "authentication": [
      "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC#z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC"
    ],
    "assertionMethod": [
      "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC#z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC"
    ],
    "keyAgreement": [
      "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC#z6LSrwmvtfkZrTzNUUqUYqnE9qedLR7tk56wmXV8aJJEnyLF"
    ],
    "capabilityInvocation": [
      "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC#z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC"
    ],
    "capabilityDelegation": [
      "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC#z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC"
    ]
  }
}
```

Copy response in full and update `softwareDID` in [packages/server/src/data.ts](packages/server/src/data.ts)

**Step 2: Generate customer DID**

Run `curl -X PUT -d '{"keyType":"Ed25519"}' localhost:8080/v1/dids/key` one more time.

Copy responses `did.id` value and update  `customerDID` in [packages/server/src/data.ts](packages/server/src/data.ts)

**Step 3: Create a credential schema**

Replacing the square brackets in the command below with the referenced values from [packages/server/src/data.ts](packages/server/src/data.ts) run:
```bash
curl -X PUT -d '{
  "issuer": "[softwareDID.did.id]",
  "issuerKid": "[softwareDID.did.verificationMethod[0].id]",
  "name": "Acme",
  "schema": {
    "appName": "string",
    "validUntil": "string",
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  }
}' localhost:8080/v1/schemas
```

You should receive a response like this:
```json
{
  "id": "c54c7c23-a54a-44de-85ca-5f6809b15f2a",
  "type": "CredentialSchema2023",
  "credentialSchema": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3I1WllMMjRabTlDWWZwTFZvYTd5ZHNFUU5hb2htc1hDaWtZeEppaTd0ZHFDI3o2TWtyNVpZTDI0Wm05Q1lmcExWb2E3eWRzRVFOYW9obXNYQ2lrWXhKaWk3dGRxQyIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODYxNzM1MTIsImlzcyI6ImRpZDprZXk6ejZNa3I1WllMMjRabTlDWWZwTFZvYTd5ZHNFUU5hb2htc1hDaWtZeEppaTd0ZHFDIiwianRpIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3YxL3NjaGVtYXMvYzU0YzdjMjMtYTU0YS00NGRlLTg1Y2EtNWY2ODA5YjE1ZjJhIiwibmJmIjoxNjg2MTczNTEyLCJub25jZSI6IjUzMzRlMGYzLWMxOWEtNGQxZC1iYjc5LTIwY2E2NzZhYmExYSIsInN1YiI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC92MS9zY2hlbWFzL2M1NGM3YzIzLWE1NGEtNDRkZS04NWNhLTVmNjgwOWIxNWYyYSIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiaXNzdWVyIjoiIiwiaXNzdWFuY2VEYXRlIjoiIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiJGlkIjoiYzU0YzdjMjMtYTU0YS00NGRlLTg1Y2EtNWY2ODA5YjE1ZjJhIiwiJHNjaGVtYSI6Imh0dHBzOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LzIwMjAtMTIvc2NoZW1hIiwiYXBwTmFtZSI6InN0cmluZyIsIm5hbWUiOiJBY21lIiwidmFsaWRVbnRpbCI6InN0cmluZyJ9fX0.Gtk2uhnYr-pSmjvaVNTXIktODtY31iEOP1VcaC6PwQUsJRuvsqryXb9Qz5F-RXgAZ7e2MrkxYE7h6f6oBzf4Bw"
}
```

Copy the `id` field value and update `schemaID` in [packages/server/src/data.ts](packages/server/src/data.ts)

**Step 4: Create a verifiable credential for customer**

Replacing the square brackets in the command below with the referenced values from [packages/server/src/data.ts](packages/server/src/data.ts) run:

```bash
curl -X PUT -d '{
  "data": {
    "appName": "Dummy",
    "validUntil": "2024-08-20T13:20:10.000+0000"
  },
   "issuer": "[softwareDID.did.id]",
  "issuerKid": "[softwareDID.did.verificationMethod[0].id]",
  "subject": "[customerDID]",
  "@context": "https://www.w3.org/2018/credentials/v1",
  "expiry": "2051-10-05T14:48:00.000Z",
  "schemaId": "[schemaId]"
}' http://localhost:8080/v1/credentials

```

You should receive a response like this:
```json
{
  "id": "aba6dc95-d9ac-43e2-ad6d-4e5120c15a2d",
  "issuerKid": "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC#z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC",
  "credential": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "id": "aba6dc95-d9ac-43e2-ad6d-4e5120c15a2d",
    "type": [
      "VerifiableCredential"
    ],
    "issuer": "did:key:z6Mkr5ZYL24Zm9CYfpLVoa7ydsEQNaohmsXCikYxJii7tdqC",
    "issuanceDate": "2023-06-07T21:40:35Z",
    "expirationDate": "2051-10-05T14:48:00.000Z",
    "credentialSubject": {
      "appName": "Dummy",
      "id": "did:key:z6MkiRTg8sAaS75c9SHbkr9mzuK1dh2W2fdNC1tRFDVWFD7Z",
      "validUntil": "2024-08-20T13:20:10.000+0000"
    },
    "credentialSchema": {
      "id": "c54c7c23-a54a-44de-85ca-5f6809b15f2a",
      "type": "CredentialSchema2023"
    }
  },
  "credentialJwt": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3I1WllMMjRabTlDWWZwTFZvYTd5ZHNFUU5hb2htc1hDaWtZeEppaTd0ZHFDI3o2TWtyNVpZTDI0Wm05Q1lmcExWb2E3eWRzRVFOYW9obXNYQ2lrWXhKaWk3dGRxQyIsInR5cCI6IkpXVCJ9.eyJleHAiOjI1ODAxMzAwODAsImlhdCI6MTY4NjE3NDAzNSwiaXNzIjoiZGlkOmtleTp6Nk1rcjVaWUwyNFptOUNZZnBMVm9hN3lkc0VRTmFvaG1zWENpa1l4SmlpN3RkcUMiLCJqdGkiOiJhYmE2ZGM5NS1kOWFjLTQzZTItYWQ2ZC00ZTUxMjBjMTVhMmQiLCJuYmYiOjE2ODYxNzQwMzUsIm5vbmNlIjoiMDdlOTYxNzctMTEyMC00MjQzLTk1OTYtNWM5NmM5YzVlMmRhIiwic3ViIjoiZGlkOmtleTp6Nk1raVJUZzhzQWFTNzVjOVNIYmtyOW16dUsxZGgyVzJmZE5DMXRSRkRWV0ZEN1oiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImlzc3VlciI6IiIsImlzc3VhbmNlRGF0ZSI6IiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImFwcE5hbWUiOiJEdW1teSIsInZhbGlkVW50aWwiOiIyMDI0LTA4LTIwVDEzOjIwOjEwLjAwMCswMDAwIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJjNTRjN2MyMy1hNTRhLTQ0ZGUtODVjYS01ZjY4MDliMTVmMmEiLCJ0eXBlIjoiQ3JlZGVudGlhbFNjaGVtYTIwMjMifX19.Vsu_P7JlfIG_Z9WFn5af596vOkPTzc86aCVZtoDl1mk5Xg28QJ7DZ2z0OXHORk59jVBtbBZ2hsO1Hh9QclzjDw"
}
```

Copy the `credentialJwt` field value and update credentialJwt in [packages/server/src/data.ts](packages/server/src/data.ts)

## 4. Start up vc-software-licensing-example server and client
**Step 1: Navigate into server package**
`cd packages/server`

**Step 2: Start client**
`bun run start`

**Step 3: Navigate into client package**
`cd packages/client`

**Step 4: Start client**
`bun run start`

**Step 5: Open network panel**
A new tab should of opened up in the browser at `http://localhost:3000/`. Open dev tools to network panel.

**Step 6: Copy customerDID**
Copy `customerDID` from [packages/server/src/data.ts](packages/server/src/data.ts)

**Step 7: Submit customerDID**
In the client UI in the browser paste `customerDID` value into text input and submit. You should get a status 200 returned from you action in the network panel.


