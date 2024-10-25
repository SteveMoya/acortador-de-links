import { lucia } from "@/lib/auth/lucia";
import { generateCodeVerifier, OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import {  db, eq, User } from "astro:db";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import type { APIContext } from "astro";
import { google } from "@/lib/auth/providers";
import { ObjectParser } from "@pilcrowjs/object-parser";


export async function GET(context: APIContext): Promise<Response> {
    
    const storedState = context.cookies.get("google_oauth_state")?.value ?? null;
    const codeVerifier = context.cookies.get("google_code_verifier")?.value ?? null;
    const code = context.url.searchParams.get("code");
    const state = context.url.searchParams.get("state");
    if (storedState === null || codeVerifier === null || code === null || state === null) {
        return new Response("Please restart the process.", {
            status: 400
        });
    }
   
    if (storedState !== state) {
        return new Response("Please restart the process.", {
            status: 400
        });
    }

    try {
        const tokens = await google.validateAuthorizationCode(code, codeVerifier);
        
        const claims = decodeIdToken(tokens.idToken());
        const claimsParser = new ObjectParser(claims);

        const googleId = claimsParser.getString("sub");
        const name = claimsParser.getString("name");
        const picture = claimsParser.getString("picture");
        const email = claimsParser.getString("email");


        const existingUser = (
            await db.select().from(User).where(eq(User.providerID, googleId))
        ).at(0);
        if (existingUser) {
            const session = await lucia.createSession(existingUser.id, {
                expiresIn: 60 * 60 * 24 * 30,
            });
            console.log("Este es el usuario",session)
            const sessionCookie = lucia.createSessionCookie(session.id);
            context.cookies.set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
            console.log("Este es la cookie del usuario", sessionCookie)
            return context.redirect("/");
        }

        const userId = generateId(15);
        const user = await db.insert(User).values({
            id: userId,
            providerID: googleId,
            username: name,
            email: email,
            userimage: picture,
        });
        const session = await lucia.createSession(userId, {
            expiresIn: 60 * 60 * 24 * 30, // 30 días
        });
       
        const sessionCookie = lucia.createSessionCookie(session.id);
        context.cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
        return context.redirect("/");

    } catch (e) {
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return new Response("Codigo invalido", {
                status: 400,
            });
        }
        return new Response("No se pudo procesar el callback", {
            status: 500,
        });
    }
}

