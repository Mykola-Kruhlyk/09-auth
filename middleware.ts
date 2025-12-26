import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');
  
  const { pathname } = request.nextUrl;

  const isPrivateRoute =
    pathname.startsWith('/profile') || pathname.startsWith('/notes');

  const isAuthRoute =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  // Якщо є accessToken, користувач авторизований
  if (accessToken) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Якщо accessToken відсутній, але є refreshToken - спробуємо оновити сесію
  if (refreshToken && isPrivateRoute) {
    try {
      // Викликаємо наш API endpoint для перевірки сесії
      const sessionUrl = new URL('/api/auth/session', request.url);
      const sessionResponse = await fetch(sessionUrl, {
        method: 'GET',
        headers: {
          Cookie: `refreshToken=${refreshToken.value}`,
        },
      });

      if (sessionResponse.ok) {
        const newResponse = NextResponse.next();
        
        // Отримуємо нові cookies з відповіді
        const setCookieHeaders = sessionResponse.headers.get('set-cookie');
        if (setCookieHeaders) {
          // Парсимо cookies з Set-Cookie заголовка
          const cookieStrings = setCookieHeaders.split(',').map(s => s.trim());
          
          cookieStrings.forEach((cookieString) => {
            const match = cookieString.match(/^(accessToken|refreshToken)=([^;]+)/);
            if (match) {
              const [, name, value] = match;
              newResponse.cookies.set(name, value, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
              });
            }
          });
        }
        
        return newResponse;
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    }
  }

  // Якщо неавторизований користувач намагається отримати доступ до приватного маршруту
  if (isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Якщо авторизований користувач (є refreshToken) намагається отримати доступ до auth маршрутів
  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};