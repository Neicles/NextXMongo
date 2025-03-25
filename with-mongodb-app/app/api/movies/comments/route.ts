import { NextResponse } from 'next/server';
import { Db, MongoClient } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments
 *     description: Returns a list of 10 comments from the database.
 *     responses:
 *       200:
 *         description: Successfully fetched comments
 *       500:
 *         description: Internal Server Error
 */
export async function GET(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const comments = await db.collection('comments').find({}).limit(10).toArray();

    return NextResponse.json({ status: 200, data: comments });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}

/**
 * @swagger
 * /api/movies/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Method not allowed
 *     description: POST method is not supported on this route.
 *     responses:
 *       405:
 *         description: Method Not Allowed
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({
    status: 405,
    message: 'Method Not Allowed',
    error: 'POST method is not supported',
  });
}

/**
 * @swagger
 * /api/movies/comments:
 *   put:
 *     tags: [Comments]
 *     summary: Method not allowed
 *     description: PUT method is not supported on this route.
 *     responses:
 *       405:
 *         description: Method Not Allowed
 */
export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({
    status: 405,
    message: 'Method Not Allowed',
    error: 'PUT method is not supported',
  });
}

/**
 * @swagger
 * /api/movies/comments:
 *   delete:
 *     tags: [Comments]
 *     summary: Method not allowed
 *     description: DELETE method is not supported on this route.
 *     responses:
 *       405:
 *         description: Method Not Allowed
 */
export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({
    status: 405,
    message: 'Method Not Allowed',
    error: 'DELETE method is not supported',
  });
}