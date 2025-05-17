
 
const secretKey = process.env.CRYPTO_SECRET_KEY; // 32 chars for AES-256

export async function encrypt(data: string): Promise<string> {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const key = await crypto.subtle.importKey("raw", enc.encode(secretKey), "AES-GCM", false, ["encrypt"]);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(data));
  return `${btoa(String.fromCharCode(...iv))}:${btoa(String.fromCharCode(...new Uint8Array(encrypted)))}`;
}

export async function decrypt(payload: string): Promise<string> {
  const [ivStr, dataStr] = payload.split(":");
  const enc = new TextEncoder();
  const iv = new Uint8Array(atob(ivStr).split("").map(c => c.charCodeAt(0)));
  const data = new Uint8Array(atob(dataStr).split("").map(c => c.charCodeAt(0)));
  const key = await crypto.subtle.importKey("raw", enc.encode(secretKey), "AES-GCM", false, ["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(decrypted);
}
