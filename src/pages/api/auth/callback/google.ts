import { lucia, google } from "@/lib/auth/";
import { generateId } from "lucia";
import { decodeIdToken,  OAuth2RequestError } from "arctic";
import type { APIContext } from "astro";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { ExistingAuthUser, CreateUser } from "@/utils/"

export async function GET(context: APIContext): Promise<Response> {
    
    const storedState = context.cookies.get("google_oauth_state")?.value ?? null;
    const codeVerifier = context.cookies.get("google_code_verifier")?.value ?? null;
    const code = context.url.searchParams.get("code");
    const state = context.url.searchParams.get("state");
    if (storedState === null || codeVerifier === null || code === null || state === null) {
        return new Response("Por favor, reintentalo mas tarde.", {
            status: 400
        });
    }
   
    if (storedState !== state) {
        return new Response("Por favor, reintentalo mas tarde.", {
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

        
        const existingUser = await ExistingAuthUser(googleId);
        if (existingUser.success) {
            const session = await lucia.createSession(existingUser.data.id, {
                expiresIn: 60 * 60 * 24 * 30,
            });
            const sessionCookie = lucia.createSessionCookie(session.id);
            context.cookies.set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
            return context.redirect("/");
        }

        const userId = generateId(15);
        const user = await CreateUser(userId, name, email, picture, googleId);
        if (!user.success) {
            return new Response("No se pudo crear el usuario", {
                status: 500,
            });
        }
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

