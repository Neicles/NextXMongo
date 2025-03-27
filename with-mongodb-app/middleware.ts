import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret')

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/register')||
    pathname.startsWith('/api-doc')
  ) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json(
      { status: 401, message: 'Missing token' },
      { status: 401 }
    )
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    console.log('✅ Token payload:', payload)

    return NextResponse.next()
  } catch (error) {
    return NextResponse.json(
      { status: 403, message: 'Invalid token' },
      { status: 403 }
    )
  }
}

export const config = {
  matcher: [
    '/api/movies/:path*',
    '/api/movies/comments/:path*',
    '/api/movies/theaters/:path*'
  ]
}
