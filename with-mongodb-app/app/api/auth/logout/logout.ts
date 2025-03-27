import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ status: 200, message: 'Logged out successfully' });
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0)
  });
  return response;
}