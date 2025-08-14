import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

import authRouter from './routes/auth';
import videosRouter from './routes/videos';

const app = express();
const prisma = new PrismaClient();

const PORT = Number(process.env.PORT || 4000);
const ASSETS_DIR = process.env.ASSETS_DIR || './assets';
const absoluteAssetsDir = path.resolve(process.cwd(), ASSETS_DIR);

fs.mkdirSync(absoluteAssetsDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/static', express.static(absoluteAssetsDir, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.m3u8')) {
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    }
    if (filePath.endsWith('.ts')) {
      res.setHeader('Content-Type', 'video/mp2t');
    }
  }
}));
app.use('/api/auth', authRouter);
app.use('/api/videos', videosRouter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`phewtube server listening on http://localhost:${PORT}`);
});

