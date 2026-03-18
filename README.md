# 💀 Web-Chat-

> 駭客風格的即時聊天室，基於 WebSocket 構建，支援多人連線與帳號驗證。  
> A hacker-aesthetic real-time chat room built on WebSocket, with multi-user support and authentication.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-ws%208.x-010101?style=flat-square)
![Deploy](https://img.shields.io/badge/Deploy-Railway-7B2CF7?style=flat-square&logo=railway&logoColor=white)
![License](https://img.shields.io/badge/License-GPL--3.0-00ff41?style=flat-square)

---
▓▒░ B U F F E R  O V E R F L O W ░▒▓

      B O C  //  N E T W O R K

      H u s z u k i S a k i
      K A T O
      $ T E A K q w q
      R E T 2 L ! B C
      D r . G G

:::::: SIGNAL DETECTED ::::::
:::::: MEMORY FRAGMENT ::::::

wired::connected
self::undefined
---


## 📸 Preview

\`\`\`
BIOS v2.31.4 — initializing...
[ OK ] AES-256 encryption layer active
[ OK ] Connection established

login: admin
> ********
[ OK ] AUTHENTICATED
[ OK ] Welcome, ADMIN [ROOT]

admin@SECURE:~$ 你好
[22:14:05] ADMIN ▶ 你好
[22:14:08] GHOST ▶ copy that.
\`\`\`

---

## ✨ Features 功能特色

- **終端 UI** — 掃描線、暈邊、隨機 Glitch 特效，完整模擬 CRT 終端體驗
- **帳號驗證** — 使用者名稱 + 密碼登入，拒絕重複登入同一帳號
- **即時廣播** — 所有訊息透過 WebSocket 即時同步給所有在線用戶
- **在線用戶列表** — 側欄即時顯示當前連線用戶與角色
- **指令系統** — 支援 `/help`、`/users`、`/ping`、`/clear`、`/whoami`、`/logout`
- **零設定前端** — 網頁自動偵測 WebSocket 網址，部署後不需修改任何程式碼
- **單檔前端** — 整個 UI 為一個 `index.html`，無框架依賴

---

- **Terminal UI** — Scanlines, vignette, random glitch effects simulating a CRT terminal
- **Authentication** — Username + password login, prevents duplicate sessions
- **Real-time broadcast** — All messages synced instantly via WebSocket
- **Online user sidebar** — Live display of connected users and their roles
- **Command system** — `/help` `/users` `/ping` `/clear` `/whoami` `/logout`
- **Zero-config frontend** — Auto-detects WebSocket URL, no code changes needed after deploy
- **Single-file UI** — Entire interface in one `index.html`, no framework required

---

## 🗂 Project Structure 專案結構

\`\`\`
hacker-chat/
├── server.js          # Node.js HTTP + WebSocket server
├── package.json       # Dependencies & scripts
└── public/
    └── index.html     # Frontend — single file, no build step
\`\`\`

---

## 🚀 Deploy to Railway 部署到 Railway

Railway 提供免費方案，部署後取得永久公開網址，朋友無需同網路即可連線。  
Railway's free tier gives you a permanent public URL — no shared network required.

**1. 上傳至 GitHub / Push to GitHub**

建立新 repository，將專案檔案上傳。  
Create a new repository and upload the project files.

**2. 連結 Railway / Connect Railway**

前往 [railway.app](https://railway.app)，以 GitHub 帳號登入後：  
Go to [railway.app](https://railway.app), sign in with GitHub, then:

\`\`\`
New Project → Deploy from GitHub repo → 選擇 hacker-chat
\`\`\`

**3. 取得網址 / Get your URL**

\`\`\`
Settings → Domains → Generate Domain
→ https://hacker-chat-xxx.up.railway.app
\`\`\`

將網址分享給朋友，直接用瀏覽器開啟即可。  
Share the URL with friends — open in any browser, no installation needed.

---


## 👤 Default Accounts 預設帳號

| Username | Password  | Role  | Color    |
|----------|-----------|-------|----------|
| admin    | admin123  | ROOT  | 🟢 Green |
| ghost    | ghost999  | GHOST | 🔴 Red   |
| cipher   | cipher42  | USER  | 🔵 Blue  |
| neo      | matrix01  | USER  | 🟡 Yellow|

新增帳號請編輯 `server.js` 中的 `USERS` 物件。  
To add accounts, edit the `USERS` object in `server.js`.

---

## 🔌 WebSocket Protocol

所有訊息以 JSON 格式傳輸。All messages are transmitted as JSON.

**Client → Server**

\`\`\`jsonc
{ "type": "login", "user": "admin", "pass": "admin123" }  // 登入
{ "type": "chat",  "content": "Hello" }                   // 發送訊息
{ "type": "ping" }                                         // Ping
\`\`\`

**Server → Client**

\`\`\`jsonc
{ "type": "auth_ok",  "user": "admin", "color": "#00ff41", "role": "ROOT" }
{ "type": "message",  "user": "ghost", "color": "#ff0055", "content": "copy that." }
{ "type": "userlist", "users": [{ "name": "admin", "color": "#00ff41", "role": "ROOT" }] }
{ "type": "system",   "content": "[ OK ] Connection established" }
\`\`\`

---

## 📄 License

GPL-3.0 © 2024

This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).  
本專案採用 GNU 通用公共授權條款 v3.0。
