
import {  google } from "@/lib/auth/providers";
import { generateCodeVerifier, generateState } from "arctic";

import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const authorizationURL = google.createAuthorizationURL(state, codeVerifier, 
      ["openid", "profile", "email"]
    );
    context.cookies.set("google_oauth_state", state, {
      httpOnly: true,
      maxAge: 60 * 10,
      secure: import.meta.env.PROD,
      path: "/",
      sameSite: "lax"
    });
    context.cookies.set("google_code_verifier", codeVerifier, {
      httpOnly: true,
      maxAge: 60 * 10,
      secure: import.meta.env.PROD,
      path: "/",
      sameSite: "lax"
    });
  
    return context.redirect(authorizationURL.toString());
  } catch (error) {
    return new Response(null, {
      status: 500,
    });
  }
}

