import { jwtVerify } from "jose";
import { JWT_SECRET } from "../config.js";
import { sessionQueries } from "../db/index.js";
import { UserJWTPayload } from "./auth.types.js";
import { bearerAuth } from "hono/bearer-auth";

const jwtSecretKey = new TextEncoder().encode(JWT_SECRET);

// Verify token helper
export async function verifyToken(
  token: string,
): Promise<UserJWTPayload | null> {
  try {
    // Check if session exists and is valid
    const session = sessionQueries.findByToken.get(token);
    if (!session) {
      return null;
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      sessionQueries.deleteByToken.run(token);
      return null;
    }

    const { payload }: { payload: UserJWTPayload } = await jwtVerify(
      token,
      jwtSecretKey,
    );
    return payload;
  } catch {
    return null;
  }
}

export const authMiddleware = bearerAuth({
  verifyToken: async (token, c) => {
    const payload = await verifyToken(token);

    if (!payload) {
      return false;
    }

    c.set("user", payload);
    return true;
  },
});

export const adminMiddleware = bearerAuth({
  verifyToken: async (token, c) => {
    const payload = await verifyToken(token);

    if (!payload || !payload.isAdmin) {
      return false;
    }

    c.set("user", payload);
    return true;
  },
});
