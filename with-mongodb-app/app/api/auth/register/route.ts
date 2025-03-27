import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { MongoClient, Db } from 'mongodb';
import bcrypt from 'bcrypt';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ status: 400, message: 'Missing credentials' });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db(process.env.MONGODB_AUTH_DB || 'auth_db');

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ status: 409, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ status: 201, message: 'User registered', userId: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message });
  }
}
