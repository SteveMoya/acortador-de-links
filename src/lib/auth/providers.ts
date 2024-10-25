import {  GitHub, Google, generateCodeVerifier, generateState } from "arctic";
import { APP_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@/const";



export const google = new Google(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    // Aqui colocamos que si esta en desarrollo utilice el local host y si no utilice el dominio
    APP_URL + 'api/auth/callback/google'
);

export const createGoogleAuthorizationURL = async () => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const authorizationURL = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["email", "profile"]
    });
    return { state, codeVerifier, authorizationURL };
}


export const github = new GitHub(
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    APP_URL + 'api/auth/callback/github'
)