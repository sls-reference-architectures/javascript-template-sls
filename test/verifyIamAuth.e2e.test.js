import axios from 'axios';

// `axios.create()` gets its own interceptor stack, so this client does NOT
// pick up the SigV4 interceptor registered in signRequests.e2e.js — which is
// exactly what we want to assert the endpoint rejects unsigned callers.
const unsignedClient = axios.create();

describe('When calling the API without a SigV4 signature', () => {
  const requestOptions = { validateStatus: () => true };

  it('should reject GET /hello with a 403', async () => {
    // ARRANGE
    const url = `${process.env.API_URL}/hello`;

    // ACT
    const { status } = await unsignedClient.get(url, requestOptions);

    // ASSERT
    expect(status).toEqual(403);
  });
});
