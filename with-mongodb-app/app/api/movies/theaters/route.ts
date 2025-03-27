import { NextResponse } from 'next/server';
import { Db, MongoClient } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies/theaters:
 *   get:
 *     tags: [Theaters]
 *     summary: Get all theaters
 *     description: Returns a list of 10 theaters from the database.
 *     responses:
 *       200:
 *         description: Successfully fetched theaters
 *       500:
 *         description: Internal Server Error
 */
export async function GET(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const theaters = await db.collection('theaters').find({}).limit(10).toArray();

    return NextResponse.json({ status: 200, data: theaters });
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
 * /api/movies/theaters:
 *   post:
 *     tags: [Theaters]
 *     summary: Create a new theater
 *     description: Adds a new theater document to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theaterId:
 *                 type: integer
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: object
 *                     properties:
 *                       street1:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       zipcode:
 *                         type: string
 *                   geo:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *     responses:
 *       201:
 *         description: Theater created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal Server Error
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (!body || !body.theaterId || !body.location) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid request body',
        error: 'Missing required fields: theaterId and location',
      });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const result = await db.collection('theaters').insertOne(body);

    return NextResponse.json({
      status: 201,
      message: 'Theater created successfully',
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
 * /api/movies/theaters:
 *   put:
 *     tags: [Theaters]
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
 * /api/movies/theaters:
 *   delete:
 *     tags: [Theaters]
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
