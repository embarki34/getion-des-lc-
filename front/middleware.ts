import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const handleI18n = createMiddleware(routing);

const publicPages = ["/login", "/register", "/forgot-password"];
const authPages = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Normalize path to check for auth
  // Strip locale if present
  let cleanPath = pathname;
  const segments = pathname.split("/");
  const locale = segments[1];

  if (routing.locales.includes(locale as any)) {
    cleanPath = "/" + segments.slice(2).join("/");
  } else if (locale === "") {
    cleanPath = "/";
  }

  // Ensure cleanPath starts with /
  if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;

  const token = request.cookies.get("auth_token")?.value;
  const isAuthenticated = !!token;

  const isPublicRoute = publicPages.some((route) =>
    cleanPath.startsWith(route)
  );
  const isAuthRoute = authPages.some((route) => cleanPath.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    const targetLocale = routing.locales.includes(locale as any)
      ? locale
      : routing.defaultLocale;
    return NextResponse.redirect(
      new URL(`/${targetLocale}/dashboard`, request.url)
    );
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isPublicRoute && cleanPath !== "/") {
    const targetLocale = routing.locales.includes(locale as any)
      ? locale
      : routing.defaultLocale;
    const loginUrl = new URL(`/${targetLocale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return handleI18n(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
