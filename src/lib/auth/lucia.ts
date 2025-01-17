import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db, Session, User } from "astro:db";

const adapter = new DrizzleSQLiteAdapter(db as any, Session as any, User as any);


export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: import.meta.env.PROD,
        },
    },
    getUserAttributes: (attributes) => {
        return {
            // attributes has the type of DatabaseUserAttributes
            id: attributes.id,
            username: attributes.username,
            email: attributes.email,
            userimage: attributes.userimage,
            createdAt: attributes.createdAt,
            providerID: attributes.providerID,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}
interface DatabaseUserAttributes {
    id: string
    username: string;
    email: string;
    userimage: string;
    createdAt: Date;
    providerID: string;
}

