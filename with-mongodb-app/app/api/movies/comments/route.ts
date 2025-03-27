import { NextResponse } from 'next/server';
import { Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies/{id}/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments for a specific movie
 *     description: Returns comments related to the movie ID in the path.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the movie
 *     responses:
 *       200:
 *         description: Successfully fetched comments
 *       400:
 *         description: Invalid movie ID format
 *       500:
 *         description: Internal Server Error
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid movie ID format',
      });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const comments = await db
      .collection('comments')
      .find({ movie_id: id }) // ou { movie_id: new ObjectId(id) }
      .limit(10)
      .toArray();

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
 *     summary: Create a new comment
 *     description: Adds a new comment to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               movie_id:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal Server Error
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    const { name, email, movie_id, text } = body;

    if (!name || !email || !movie_id || !text) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid request body',
        error: 'Missing one or more required fields: name, email, movie_id, text',
      });
    }

    if (!ObjectId.isValid(movie_id)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid movie_id format',
        error: 'movie_id must be a valid ObjectId',
      });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const result = await db.collection('comments').insertOne({
      name,
      email,
      movie_id: ObjectId.createFromHexString(body.movie_id),
      text,
      date: new Date()
    });

    return NextResponse.json({
      status: 201,
      message: 'Comment created successfully',
      data: { insertedId: result.insertedId },
    });
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