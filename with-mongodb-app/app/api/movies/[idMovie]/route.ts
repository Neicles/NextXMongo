
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     tags: [Movies]
 *     summary: Get a movie by ID
 *     description: Retrieve a specific movie based on its MongoDB ObjectId.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to retrieve.
 *     responses:
 *       200:
 *         description: Movie retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid movie ID format
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request: Request, { params }: { params: { idMovie: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }
    
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });
    
    if (!movie) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { movie } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
  
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   post:
 *     tags: [Movies]
 *     summary: Method not allowed
 *     description: POST is not supported on a specific movie ID route.
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
 * /api/movies/{idMovie}:
 *   put:
 *     tags: [Movies]
 *     summary: Update a movie by ID
 *     description: Updates a movie's information based on its ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid movie ID format
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
export async function PUT(request: Request, { params }: { params: { idMovie: string } }): Promise<NextResponse> {
    try {
      const { idMovie } = params;
      if (!ObjectId.isValid(idMovie)) {
        return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
      }
  
      const body = await request.json();
      const client = await clientPromise;
      const db = client.db('sample_mflix');
  
      const updateResult = await db.collection('movies').updateOne(
        { _id: new ObjectId(idMovie) },
        { $set: body }
      );
  
      if (updateResult.matchedCount === 0) {
        return NextResponse.json({ status: 404, message: 'Movie not found' });
      }
  
      return NextResponse.json({ status: 200, message: 'Movie updated successfully' });
    } catch (error: any) {
      return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
  }

  /**
 * @swagger
 * /api/movies/{idMovie}:
 *   delete:
 *     tags: [Movies]
 *     summary: Delete a movie by ID
 *     description: Deletes a specific movie from the database.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to delete.
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       400:
 *         description: Invalid movie ID format
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(request: Request, { params }: { params: { idMovie: string } }): Promise<NextResponse> {
    try {
      const { idMovie } = params;
      if (!ObjectId.isValid(idMovie)) {
        return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
      }
  
      const client = await clientPromise;
      const db = client.db('sample_mflix');
  
      const deleteResult = await db.collection('movies').deleteOne({ _id: new ObjectId(idMovie) });
  
      if (deleteResult.deletedCount === 0) {
        return NextResponse.json({ status: 404, message: 'Movie not found' });
      }
  
      return NextResponse.json({ status: 200, message: 'Movie deleted successfully' });
    } catch (error: any) {
      return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
  }
  