import { Hono } from "hono";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../config.js";
import { userQueries, sessionQueries } from "../db/index.js";
import crypto from "crypto";

const authRouter = new Hono();

const jwtSecretKey = new TextEncoder().encode(JWT_SECRET);

// Setup - Create initial user (only if no users exist)
authRouter.post("/setup", async (c) => {
  try {
    // Check if any users exist
    const existingUsers = userQueries.findById.get(1);
    if (existingUsers) {
      return c.json({ error: "Setup already completed" }, 400);
    }

    const { username, email, password } = await c.req.json();

    if (!username || !email || !password || password.length < 8) {
      return c.json(
        { error: "Invalid credentials (password min 8 characters)" },
        400,
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      userQueries.create.run(username, email, passwordHash);
      return c.json({ message: "Setup completed successfully" });
    } catch (error: any) {
      if (error.message.includes("UNIQUE")) {
        return c.json({ error: "Username or email already exists" }, 400);
      }
      throw error;
    }
  } catch (error) {
    console.error("Setup error:", error);
    return c.json({ error: "Setup failed" }, 500);
  }
});

// Login
authRouter.post("/login", async (c) => {
  try {
    const { username, password } = await c.req.json();

    const user = userQueries.findByUsername.get(username) as any;

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Create session
    const sessionId = crypto.randomUUID();
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(jwtSecretKey);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    sessionQueries.create.run(
      sessionId,
      user.id,
      token,
      expiresAt.toISOString(),
    );

    return c.json({ token, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Logout
authRouter.post("/logout", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      sessionQueries.deleteByToken.run(token);
    }
    return c.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({ error: "Logout failed" }, 500);
  }
});

// Verify token middleware
export async function verifyToken(token: string) {
  try {
    // Check if session exists and is valid
    const session = sessionQueries.findByToken.get(token) as any;
    if (!session) {
      return null;
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      sessionQueries.deleteByToken.run(token);
      return null;
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, jwtSecretKey);
    return payload;
  } catch {
    return null;
  }
}

// Check if setup is needed
authRouter.get("/check-setup", async (c) => {
  try {
    const user = userQueries.findById.get(1);
    return c.json({ needsSetup: !user });
  } catch (error) {
    console.error("Check setup error:", error);
    return c.json({ needsSetup: true });
  }
});

export { authRouter };
