import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(32),
  password: z.string().min(6)
});

router.post('/register', async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid body' });
    return;
  }
  const { email, username, password } = parse.data;
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, username, passwordHash } });
  res.json({ id: user.id, email: user.email, username: user.username });
});

const loginSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string()
});

router.post('/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid body' });
    return;
  }
  const { emailOrUsername, password } = parse.data;
  const user = await prisma.user.findFirst({ where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] } });
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
});

export default router;

