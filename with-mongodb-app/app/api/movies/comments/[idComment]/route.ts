import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

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
        message: 'Invalid movie ID',
      });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const comments = await db
      .collection('comments')
      .find({ movie_id: id }) // ou new ObjectId(id) si movie_id est ObjectId
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
 * /api/movies/comments/{idComment}:
 *   post:
 *     tags: [Comments]
 *     summary: Method not allowed
 *     description: POST is not supported on a specific comment ID route.
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
 * /api/movies/comments/{idComment}:
 *   put:
 *     tags: [Comments]
 *     summary: Update a comment by ID
 *     description: Update the content of a comment using its MongoDB ObjectId.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The new text of the comment.
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid ID format or bad request
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 */
export async function PUT(request: Request, { params }: { params: Promise<{ idComment: string }> }): Promise<NextResponse> {
    try {
      const { idComment } = await params;
      if (!ObjectId.isValid(idComment)) {
        return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
      }
  
      const body = await request.json();
      if (!body?.text) {
        return NextResponse.json({ status: 400, message: 'Missing required field: text' });
      }
  
      const client = await clientPromise;
      const db = client.db('sample_mflix');
  
      const updateResult = await db.collection('comments').updateOne(
        { _id: new ObjectId(idComment) },
        { $set: { text: body.text } }
      );
  
      if (updateResult.matchedCount === 0) {
        return NextResponse.json({ status: 404, message: 'Comment not found' });
      }
  
      return NextResponse.json({ status: 200, message: 'Comment updated successfully' });
    } catch (error: any) {
      return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
  }

  /**
 * @swagger
 * /api/movies/comments/{idComment}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment by ID
 *     description: Delete a comment using its MongoDB ObjectId.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid comment ID format
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ idComment: string }> }): Promise<NextResponse> {
    try {
      const { idComment } = await params;
      if (!ObjectId.isValid(idComment)) {
        return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
      }
  
      const client = await clientPromise;
      const db = client.db('sample_mflix');
  
      const deleteResult = await db.collection('comments').deleteOne({ _id: new ObjectId(idComment) });
  
      if (deleteResult.deletedCount === 0) {
        return NextResponse.json({ status: 404, message: 'Comment not found' });
      }
  
      return NextResponse.json({ status: 200, message: 'Comment deleted successfully' });
    } catch (error: any) {
      return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
  }
  