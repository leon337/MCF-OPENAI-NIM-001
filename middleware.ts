import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const username = process.env.APP_BASIC_AUTH_USER;
  const password = process.env.APP_BASIC_AUTH_PASSWORD;

  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  // Fail closed: never publish an unprotected app when credentials are missing.
  if (!username || !password) {
    return new NextResponse("Application access is not configured.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const authorization = request.headers.get("authorization") || "";
  const expected = `Basic ${btoa(`${username}:${password}`)}`;
  if (authorization !== expected) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="MCF NIM workspace", charset="UTF-8"',
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
