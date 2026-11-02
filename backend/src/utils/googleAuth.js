import { OAuth2Client } from 'google-auth-library';

let customVerifier = null;

/**
 * Allows test suites to mock Google token verification without external HTTP calls
 */
export function setGoogleVerifier(fn) {
  customVerifier = fn;
}

/**
 * Resets any custom verifier back to the default google-auth-library implementation
 */
export function resetGoogleVerifier() {
  customVerifier = null;
}

/**
 * Verifies a Google ID token with google-auth-library
 * @param {string} idToken - The JWT credential returned by Google Identity Services
 * @param {string} clientId - The Google Client ID configured for ProofBox
 * @returns {Promise<import('google-auth-library').TokenPayload>}
 */
export async function verifyGoogleToken(idToken, clientId) {
  if (customVerifier) {
    return customVerifier(idToken, clientId);
  }

  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: clientId
  });

  return ticket.getPayload();
}

