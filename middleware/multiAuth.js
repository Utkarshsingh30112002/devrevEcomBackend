const jwt = require("jsonwebtoken");
const User = require("../models/users");

// Attempts to authenticate via:
// 1) JWT (cookie auth_token or Authorization: Bearer <jwt>)
// 2) DevRev agent PAT (Authorization: Bearer <DEVREV_AGENT_PAT> or X-DevRev-Agent-Token) + user_uuid in query/body

// Simple in-memory TTL cache for user lookups by user_uuid (for PAT flow)
const USER_CACHE_MAX = 1000; // entries
const USER_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const userUuidToAuthCache = new Map(); // key: user_uuid, value: { data, expiresAt }

function getCachedAuthForUserUuid(userUuid) {
  const entry = userUuidToAuthCache.get(userUuid);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    userUuidToAuthCache.delete(userUuid);
    return null;
  }
  return entry.data;
}

function setCachedAuthForUserUuid(userUuid, data) {
  // Evict oldest if over capacity
  if (userUuidToAuthCache.size >= USER_CACHE_MAX) {
    const oldestKey = userUuidToAuthCache.keys().next().value;
    if (oldestKey) userUuidToAuthCache.delete(oldestKey);
  }
  userUuidToAuthCache.set(userUuid, {
    data,
    expiresAt: Date.now() + USER_CACHE_TTL_MS,
  });
}

async function resolveAgentUserFromUuid(req) {
  const userUuid = req.query?.user_uuid || req.body?.user_uuid;
  if (!userUuid) return null;
  
  // Try cache first
  const cached = getCachedAuthForUserUuid(userUuid);
  if (cached) return cached;

  // Try to find user by the provided UUID
  let user = await User.findOne({ user_uuid: userUuid });
  
  // If no user found and this is an agent call, use fallback UUID
  if (!user && hasValidAgentPat(req)) {
    console.log(`🔄 Agent call: UUID ${userUuid} not found, using fallback UUID`);
    const fallbackUuid = "2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c77";
    user = await User.findOne({ user_uuid: fallbackUuid });
    
    if (user) {
      console.log(`✅ Fallback user found: ${user.email} (${fallbackUuid})`);
    } else {
      console.log(`⚠️ Fallback user not found either: ${fallbackUuid}`);
      return null;
    }
  }
  
  if (!user) return null;
  
  const authData = {
    sub: user._id.toString(),
    user_uuid: user.user_uuid,
    username: user.username,
    email: user.email,
    role: user.role,
    display_name: `${user.firstName} ${user.lastName}`.trim(),
    agent: true,
  };
  
  setCachedAuthForUserUuid(userUuid, authData);
  return authData;
}

function tryJwt(req) {
  try {
    const jwtSecret = process.env.JWT_SECRET || "dev-secret";
    const cookieToken = req.cookies?.auth_token;
    const header = req.headers.authorization || "";
    const headerToken = header.startsWith("Bearer ") ? header.slice(7) : null;
    const token = cookieToken || headerToken;
    if (!token) return null;
    const payload = jwt.verify(token, jwtSecret);
    return payload;
  } catch (err) {
    return null;
  }
}

function hasValidAgentPat(req) {
  const authHeader = req.headers.authorization || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const headerToken = req.headers["x-devrev-agent-token"]; // optional custom header support
  const pat = process.env.DEVREV_AGENT_PAT;
  if (!pat) return false;
  return bearer === pat || headerToken === pat;
}

// Optional auth: attaches req.auth if any method succeeds; proceeds otherwise
const authenticateMultiOptional = async (req, res, next) => {
  // Try JWT first
  const jwtPayload = tryJwt(req);
  if (jwtPayload) {
    req.auth = jwtPayload;
    return next();
  }

  // Try agent PAT + user_uuid
  if (hasValidAgentPat(req)) {
    const agentUser = await resolveAgentUserFromUuid(req);
    if (agentUser) {
      req.auth = agentUser;
    }
    return next();
  }

  return next();
};

// Required auth: at least one method must succeed
const authenticateMultiRequired = async (req, res, next) => {
  const jwtPayload = tryJwt(req);
  if (jwtPayload) {
    req.auth = jwtPayload;
    return next();
  }

  if (hasValidAgentPat(req)) {
    const agentUser = await resolveAgentUserFromUuid(req);
    if (agentUser) {
      req.auth = agentUser;
      return next();
    }
    return res.status(400).json({ message: "user_uuid required for agent calls" });
  }

  return res.status(401).json({ message: "Authentication required" });
};

module.exports = {
  authenticateMultiOptional,
  authenticateMultiRequired,
};


