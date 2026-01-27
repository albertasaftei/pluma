import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "";
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

// Validate encryption key length (must be 32 bytes for AES-256)
if (Buffer.from(ENCRYPTION_KEY, "hex").length !== 32) {
  throw new Error(
    "ENCRYPTION_KEY must be exactly 64 hexadecimal characters (32 bytes)",
  );
}

console.log("✓ Configuration loaded successfully");
