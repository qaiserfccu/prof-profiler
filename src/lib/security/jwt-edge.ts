/**
 * Edge-compatible JWT utilities for middleware
 * Uses Web Crypto API instead of Node.js crypto
 */

interface JWTPayload {
  sub: string;
  email?: string;
  role?: string;
  iat: number;
  exp: number;
  type?: string;
  [key: string]: unknown;
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(data: string): string {
  let base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  
  while (base64.length % 4) {
    base64 += '=';
  }
  
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new TextDecoder().decode(bytes);
}

/**
 * Verify JWT signature using Web Crypto API
 */
async function verifySignature(
  token: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;

    // Import secret key
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode the signature
    const signatureBase64 = encodedSignature.replace(/-/g, '+').replace(/_/g, '/');
    let paddedSignature = signatureBase64;
    while (paddedSignature.length % 4) {
      paddedSignature += '=';
    }
    const signatureString = atob(paddedSignature);
    const signature = new Uint8Array(signatureString.length);
    for (let i = 0; i < signatureString.length; i++) {
      signature[i] = signatureString.charCodeAt(i);
    }

    // Verify signature
    const dataBuffer = encoder.encode(data);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      dataBuffer
    );

    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Verify and decode JWT token (Edge-compatible)
 */
export async function verifyJWTEdge(
  token: string,
  secret: string
): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [, encodedPayload] = parts;

    // Verify signature
    const isValid = await verifySignature(token, secret);
    if (!isValid) {
      return null;
    }

    // Decode payload
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Get access token payload (Edge-compatible)
 */
export async function getAccessTokenPayloadEdge(
  token: string,
  secret: string
): Promise<JWTPayload | null> {
  const payload = await verifyJWTEdge(token, secret);

  if (!payload || payload.type !== 'access') {
    return null;
  }

  return payload;
}
