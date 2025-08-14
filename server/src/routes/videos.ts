import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { v4 as uuid } from 'uuid';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const prisma = new PrismaClient();
const router = Router();

const upload = multer({ dest: path.join(process.cwd(), 'uploads') });

router.get('/', async (_req, res) => {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { uploader: { select: { id: true, username: true } } }
  });
  res.json(videos);
});

router.get('/:id', async (req, res) => {
  const video = await prisma.video.findUnique({ where: { id: req.params.id }, include: { uploader: { select: { id: true, username: true } } } });
  if (!video) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(video);
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const devUser = await prisma.user.upsert({
      where: { username: 'dev-user' },
      update: {},
      create: { email: 'dev@example.com', username: 'dev-user', passwordHash: 'dev' }
    });
    const uploaderId = (req.headers['x-user-id'] as string | undefined) || devUser.id;
    if (!uploaderId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'File required' });
      return;
    }
    const title = (req.body.title as string) || 'Untitled';
    const description = (req.body.description as string) || '';

    const assetsRoot = path.resolve(process.cwd(), process.env.ASSETS_DIR || './assets');
    const videoId = uuid();
    const hlsDir = path.join(assetsRoot, 'hls', videoId);
    const thumbDir = path.join(assetsRoot, 'thumbs');
    fs.mkdirSync(hlsDir, { recursive: true });
    fs.mkdirSync(thumbDir, { recursive: true });

    const inputPath = req.file.path;
    const playlistPath = path.join(hlsDir, 'index.m3u8');
    const thumbnailPath = path.join(thumbDir, `${videoId}.jpg`);

    const durationSec = await new Promise<number>((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, data) => {
        if (err) return reject(err);
        const duration = data.format.duration ?? 0;
        resolve(Math.round(duration));
      });
    });

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .addOptions([
          '-profile:v baseline',
          '-level 3.0',
          '-start_number 0',
          '-hls_time 6',
          '-hls_list_size 0',
          '-f hls'
        ])
        .output(playlistPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({ count: 1, folder: thumbDir, filename: `${videoId}.jpg`, size: '640x?' })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    fs.unlink(req.file.path, () => {});

    const created = await prisma.video.create({
      data: {
        id: videoId,
        title,
        description,
        uploaderId,
        durationSec,
        hlsPath: path.relative(assetsRoot, playlistPath).replace(/\\/g, '/'),
        thumbnailPath: path.relative(assetsRoot, thumbnailPath).replace(/\\/g, '/'),
        isPublic: true
      }
    });

    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;

