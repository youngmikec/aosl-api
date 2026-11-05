import { decodeToken } from "../../middleware/authorization.js";
import Users from "../users/model.js";
import { audienceOf, isAdminUser } from "./access.js";
import { createMessage, ensureSupportRoom, loadAccessibleRoom, markRoomRead } from "./services.js";
import { setIo, publish } from "./emitter.js";

const RATE_WINDOW_MS = 10_000;
const RATE_MAX_MESSAGES = 15;
const MAX_TIMEOUT_MS = 2_147_000_000;

const fail = (ack, code, message) => typeof ack === "function" && ack({ ok: false, code, error: message });

/**
 * Real-time chat. Clients connect with `io(origin, { auth: { token } })`.
 *
 * client -> server (all take an optional acknowledgement callback):
 *   message:send  { room, message }       -> ack { ok, message }
 *   message:read  { room }                -> ack { ok }
 *   typing        { room, isTyping }
 * server -> client:
 *   ready         { user }                 connection accepted
 *   message:new   <message>                a message in a room you can access
 *   message:read  { room, reader, at }     someone read a room
 *   typing        { room, user, isTyping }
 *   room:new / room:updated <room>, room:removed { id }
 *   auth:expired                           the session token ran out; reconnect after signing in again
 */
export function registerChatSocket(io) {
  setIo(io);

  // Authenticate every connection with the same JWT the REST API uses.
  io.use(async (socket, next) => {
    try {
      const token = (socket.handshake.auth && socket.handshake.auth.token) || socket.handshake.query.token;
      if (!token) return next(new Error("AUTH_REQUIRED"));
      const decoded = await decodeToken(token);
      const account = await Users.findById(decoded.id).exec();
      if (!account || account.deleted == 1 || account.accessLevel == 0 || account.isSuspended) {
        return next(new Error("AUTH_REJECTED"));
      }
      socket.data.user = {
        id: `${account.id}`,
        userType: account.userType,
        firstName: account.firstName,
        lastName: account.lastName,
      };
      socket.data.expiresAt = (decoded.exp || 0) * 1000;
      return next();
    } catch (err) {
      return next(new Error("AUTH_REJECTED"));
    }
  });

  io.on("connection", async (socket) => {
    const { user } = socket.data;
    socket.join(`user:${user.id}`);
    if (isAdminUser(user)) socket.join("admins");

    // Drop the connection when the token expires instead of letting it live on unauthenticated.
    const msLeft = socket.data.expiresAt - Date.now();
    const expiry = setTimeout(() => {
      socket.emit("auth:expired");
      socket.disconnect(true);
    }, Math.min(Math.max(msLeft, 0), MAX_TIMEOUT_MS));
    socket.on("disconnect", () => clearTimeout(expiry));

    const sent = [];
    const withinRateLimit = () => {
      const now = Date.now();
      while (sent.length && now - sent[0] > RATE_WINDOW_MS) sent.shift();
      if (sent.length >= RATE_MAX_MESSAGES) return false;
      sent.push(now);
      return true;
    };
    const live = (ack) => {
      if (socket.data.expiresAt && Date.now() >= socket.data.expiresAt) {
        fail(ack, "SESSION_EXPIRED", "Your session has expired. Please sign in again.");
        socket.emit("auth:expired");
        socket.disconnect(true);
        return false;
      }
      return true;
    };

    // Customers always have a support conversation to talk in.
    if (!isAdminUser(user)) {
      try {
        const account = await Users.findById(user.id).exec();
        if (account) await ensureSupportRoom(account);
      } catch (err) {
        // The client can still fetch rooms over REST; a failure here must not drop the connection.
      }
    }
    socket.emit("ready", { user: { id: user.id, userType: user.userType } });

    socket.on("message:send", async (payload, ack) => {
      if (!live(ack)) return;
      if (!withinRateLimit()) return fail(ack, "RATE_LIMITED", "You're sending messages too quickly. Please wait a moment.");
      try {
        const message = await createMessage(user, payload || {}, { exceptSocketId: socket.id });
        if (typeof ack === "function") ack({ ok: true, message });
      } catch (err) {
        fail(ack, "SEND_FAILED", err.message);
      }
    });

    socket.on("message:read", async (payload, ack) => {
      if (!live(ack)) return;
      try {
        const result = await markRoomRead(user, payload && payload.room, { exceptSocketId: socket.id });
        if (typeof ack === "function") ack({ ok: true, ...result });
      } catch (err) {
        fail(ack, "READ_FAILED", err.message);
      }
    });

    socket.on("typing", async (payload) => {
      if (!live()) return;
      try {
        const room = await loadAccessibleRoom(user, payload && payload.room);
        publish(
          audienceOf(room),
          "typing",
          { room: `${room.id}`, user: { id: user.id, name: `${user.firstName || ""} ${user.lastName || ""}`.trim() }, isTyping: !!(payload && payload.isTyping) },
          socket.id,
        );
      } catch (err) {
        // Typing hints are best-effort.
      }
    });
  });
}

