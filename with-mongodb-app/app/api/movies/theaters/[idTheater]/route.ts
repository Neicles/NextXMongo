import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/movies/theaters/{idTheater}:
 *   get:
 *     tags: [Theaters]
 *     summary: Get a theater by ID
 *     description: Retrieve a specific theater using its MongoDB ObjectId.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the theater to retrieve.
 *     responses:
 *       200:
 *         description: Theater retrieved successfully
 *       400:
 *         description: Invalid theater ID format
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal Server Error
 */
export async function GET(request: Request, { params }: { params: Promise<{ idTheater: string }> }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idTheater } = await params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }
    
    const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater) });
    
    if (!theater) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { theater } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/theaters/{idTheater}:
 *   post:
 *     tags: [Theaters]
 *     summary: Method not allowed
 *     description: POST is not supported on a specific theater ID route.
 *     responses:
 *       405:
 *         description: Method Not Allowed
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({
    status: 405,
    message: 'Method Not Allowed',
    error: 'POST method is not supported on this route',
  });
}

/**
 * @swagger
 * /api/movies/theaters/{idTheater}:
 *   put:
 *     tags: [Theaters]
 *     summary: Update a theater by ID
 *     description: Updates the data of a specific theater by ID.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the theater to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: object
 *               theaterId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Theater updated successfully
 *       400:
 *         description: Invalid theater ID or bad request
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal Server Error
 */
export async function PUT(request: Request, { params }: { params: Promise<{ idTheater: string }> }): Promise<NextResponse> {
  try {
    const { idTheater } = await params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('sample_mflix');

    const updateResult = await db.collection('theaters').updateOne(
      { _id: new ObjectId(idTheater) },
      { $set: body }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found' });
    }

    return NextResponse.json({ status: 200, message: 'Theater updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/theaters/{idTheater}:
 *   delete:
 *     tags: [Theaters]
 *     summary: Delete a theater by ID
 *     description: Deletes a specific theater from the database.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the theater to delete.
 *     responses:
 *       200:
 *         description: Theater deleted successfully
 *       400:
 *         description: Invalid theater ID format
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ idTheater: string }> }): Promise<NextResponse> {
  try {
    const { idTheater } = await params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }

    const client = await clientPromise;
    const db = client.db('sample_mflix');

    const deleteResult = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found' });
    }

    return NextResponse.json({ status: 200, message: 'Theater deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}