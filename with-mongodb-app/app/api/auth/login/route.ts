import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoClient, Db, ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ status: 400, message: 'Missing credentials' });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db(process.env.MONGODB_AUTH_DB || 'auth_db');

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return NextResponse.json({ status: 401, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ status: 401, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    await db.collection('sessions').insertOne({
      userId: user._id,
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 jour
    });

    return NextResponse.json({
      status: 200,
      message: 'Login successful',
      token
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message });
  }
}