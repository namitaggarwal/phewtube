## phewtube

Minimal YouTube-like app: Node.js/Express + Prisma (SQLite) backend with HLS transcoding, and React + Vite frontend.

### Tech Stack
- Backend: Express, Prisma (SQLite), Multer, fluent-ffmpeg, JWT
- Frontend: React, Vite, React Router, hls.js

### Prerequisites
- Node.js 18+
- Windows PowerShell (commands below assume Windows)

### Project Structure
```
server/   # Express API, Prisma schema, video processing
web/      # React app (Vite)
```

### Setup
1) Install dependencies
```
cd server && npm i
cd ../web && npm i
```

2) Configure environment (backend)
Create `server/.env` with:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev"
PORT=4000
ASSETS_DIR="./assets"
```

3) Prepare database
```
cd server
npx prisma generate
npx prisma migrate dev --name init --skip-generate
```

4) Create runtime folders (first time)
```
mkdir server\uploads
mkdir server\assets
```

### Development
Run both apps in separate terminals:
```
cd server
npm run dev
```
```
cd web
npm run dev
```

- Backend: http://localhost:4000
- Health: http://localhost:4000/api/health
- Frontend: http://localhost:5173

### Usage
- Upload: open http://localhost:5173/upload, choose a video, set title/description, submit
- Home feed: http://localhost:5173 shows latest uploads
- Watch: clicking a video opens its page and streams HLS

### API (quick reference)
- `GET /api/videos` → list recent videos
- `GET /api/videos/:id` → video details
- `POST /api/videos/upload` → multipart upload
  - Form fields: `file` (video), `title`, `description`
  - Auth placeholder: header `x-user-id` (server will auto-upsert `dev-user` if none provided during development)
- `POST /api/auth/register` → `{ email, username, password }`
- `POST /api/auth/login` → `{ emailOrUsername, password }`

### HLS Output
- Transcodes to HLS `.m3u8` with `.ts` segments in `server/assets/hls/<videoId>`
- Thumbnails in `server/assets/thumbs`
- Served via `GET /static/...` from the `assets` dir

### Troubleshooting
- Ports busy: change `PORT` in `server/.env` or Vite port in `web/vite.config.ts`
- HLS not playing on some browsers: hls.js initializes automatically for `.m3u8` sources
- Upload fails immediately: ensure `server/uploads` and `server/assets` exist and that the backend is running
- Prisma errors: re-run `npx prisma generate` and `npx prisma migrate dev`

### Notes
- ffmpeg/ffprobe binaries are provided via `@ffmpeg-installer/ffmpeg` and `@ffprobe-installer/ffprobe` and configured in code
- This repo is intended for local development/demo use


