import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@db';
import { users, registerUserSchema, loginUserSchema } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email)
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const [newUser] = await db.insert(users).values({
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name
    }).returning();

    // Generate JWT
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid input' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginUserSchema.parse(req.body);

    const user = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email)
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(validatedData.password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid input' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default router;