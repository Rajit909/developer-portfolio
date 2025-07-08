import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/user';
import { compare } from 'bcryptjs';
import * as jose from 'jose';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);

    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Create JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const alg = 'HS256';

    const token = await new jose.SignJWT({ 
        id: user._id.toString(),
        email: user.email,
        name: user.name,
     })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .setIssuedAt()
      .setSubject(user._id.toString())
      .sign(secret);
      
    // Set cookie
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
