
import { defineMiddleware, sequence } from "astro:middleware";


import { verifyRequestOrigin } from "lucia"
import { lucia } from "@/lib/auth/lucia";
import { TokenBucket } from "@/utils/rate-limit";


const bucket = new TokenBucket(100, 1);

const rateLimitMiddleware = defineMiddleware((context, next) => {
  const clientIP = context.request.headers.get("X-Forwarded-For");
  if (clientIP === null) {
    return next();
  }
  let cost: number;
  if (context.request.method === "GET" || context.request.method === "OPTIONS") {
    cost = 1;
  } else {
    cost = 3;
  }
  if (!bucket.consume(clientIP, cost)) {
    return new Response("Demasiadas Peticiones", {
      status: 429
    });
  }
  return next();
});
export const authMiddleware = defineMiddleware(async (context, next) => {

  if (context.request.method !== "GET") {
    const originHeader = context.request.headers.get("Origin");
    const hostHeader = context.request.headers.get("Host");
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return new Response(null, {
        status: 403,
      });
    }
  }
  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
  
  if (["/estadisticas", "/mis-links"].some(path => context.url.pathname.startsWith(path))) {
    if (!sessionId) {
      return context.redirect("/");
    }
  }
  if (!sessionId) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }
  context.locals.session = session;
  context.locals.user = user;
  
  return next();
});
export const onRequest = sequence(rateLimitMiddleware, authMiddleware);