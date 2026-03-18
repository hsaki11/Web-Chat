const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;

// ─── 帳號資料庫（可自行新增）────────────────────────────
const USERS = {
  admin:  { password: "admin123", color: "#00ff41", role: "ROOT"  },
  ghost:  { password: "ghost999", color: "#ff0055", role: "GHOST" },
  cipher: { password: "cipher42", color: "#00cfff", role: "USER"  },
  neo:    { password: "matrix01", color: "#ffe600", role: "USER"  },
};

// ─── HTTP server（提供 index.html）──────────────────────
const httpServer = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "public", "index.html");
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(data);
  });
});

// ─── WebSocket server ────────────────────────────────────
const wss = new WebSocket.Server({ server: httpServer });

// sessions: Map<ws, { authenticated, username, color, role }>
const sessions = new Map();

function broadcast(json, exclude = null) {
  const str = JSON.stringify(json);
  for (const [client, sess] of sessions) {
    if (client === exclude) continue;
    if (sess.authenticated && client.readyState === WebSocket.OPEN) {
      client.send(str);
    }
  }
}

function broadcastAll(json) {
  broadcast(json, null);
}

function sendTo(ws, json) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(json));
}

function getUserList() {
  const users = [];
  for (const [, sess] of sessions) {
    if (sess.authenticated) {
      users.push({ name: sess.username, color: sess.color, role: sess.role });
    }
  }
  return users;
}

wss.on("connection", (ws) => {
  sessions.set(ws, { authenticated: false, username: null, color: null, role: null });
  console.log(`[WS] Client connected. Total: ${sessions.size}`);

  sendTo(ws, { type: "system", content: "SECURE_TERMINAL v0.9.1 — CONNECTED" });
  sendTo(ws, { type: "system", content: "Send login credentials to authenticate." });

  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch {
      sendTo(ws, { type: "system", content: "[ ERR ] Invalid JSON" });
      return;
    }

    const sess = sessions.get(ws);

    // ── 登入 ────────────────────────────────────────────
    if (msg.type === "login") {
      const uname = (msg.user || "").toLowerCase().trim();
      const pass  = msg.pass || "";
      const user  = USERS[uname];

      if (user && user.password === pass) {
        // 檢查是否已登入
        for (const [, s] of sessions) {
          if (s.authenticated && s.username === uname) {
            sendTo(ws, { type: "system", content: "[ ERR ] User already logged in" });
            return;
          }
        }
        sess.authenticated = true;
        sess.username = uname;
        sess.color    = user.color;
        sess.role     = user.role;

        sendTo(ws, { type: "auth_ok", user: uname, color: user.color, role: user.role });
        broadcastAll({ type: "userlist", users: getUserList() });
        broadcastAll({
          type: "message", user: "SYSTEM", color: "#00ff4155",
          content: `[ ONLINE ] ${uname.toUpperCase()} connected [${user.role}]`
        });
        console.log(`[AUTH] ${uname} logged in`);
      } else {
        sendTo(ws, { type: "system", content: "[ ERR ] ACCESS DENIED — invalid credentials" });
      }
      return;
    }

    // ── 必須登入才能做以下操作 ──────────────────────────
    if (!sess.authenticated) {
      sendTo(ws, { type: "system", content: "[ ERR ] Not authenticated" });
      return;
    }

    // ── 聊天 ────────────────────────────────────────────
    if (msg.type === "chat") {
      const content = (msg.content || "").slice(0, 400);
      if (!content) return;
      broadcastAll({ type: "message", user: sess.username, color: sess.color, content });
      console.log(`[CHAT] ${sess.username}: ${content}`);
      return;
    }

    // ── Ping ────────────────────────────────────────────
    if (msg.type === "ping") {
      sendTo(ws, { type: "pong" });
      return;
    }
  });

  ws.on("close", () => {
    const sess = sessions.get(ws);
    if (sess?.authenticated) {
      console.log(`[WS] ${sess.username} disconnected`);
      sessions.delete(ws);
      broadcastAll({ type: "userlist", users: getUserList() });
      broadcastAll({
        type: "message", user: "SYSTEM", color: "#00ff4155",
        content: `[ OFFLINE ] ${sess.username.toUpperCase()} disconnected`
      });
    } else {
      sessions.delete(ws);
    }
    console.log(`[WS] Client left. Total: ${sessions.size}`);
  });

  ws.on("error", (err) => console.error("[WS] Error:", err.message));
});

httpServer.listen(PORT, () => {
  console.log(`\n=== Web-Chat- SERVER ===`);
  console.log(`HTTP + WS listening on port ${PORT}`);
  console.log(`==============================\n`);
});
