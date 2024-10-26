import type { APIRoute } from "astro"
import { eq } from "astro:db"
import { ShortenedUrl, db } from "astro:db"
import type { APIContext } from "astro";


export const POST: APIRoute = async (context: APIContext): Promise<Response> => {
    const request = context.request
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Método no permitido" }), {
            status: 405,
            headers: {
                "content-type": "application/json"
            }
        })
    }
    if (!request.body) {
        return new Response(JSON.stringify({ error: "No se ha enviado el cuerpo" }), {
            status: 400,
            headers: {
                "content-type": "application/json"
            }
        })
    }
    if (request.headers.get("content-type") !== "application/json") {
        return new Response(JSON.stringify({ error: "El tipo de contenido no es JSON" }), {
            status: 415,
            headers: {
                "content-type": "application/json"
            }
        })
    }
    const body = await request.json()
    if (!body.url) {
        return new Response(JSON.stringify({ error: "No se ha enviado la URL" }), {
            status: 400,
            headers: {
                "content-type": "application/json"
            }
        })
    }

    try {
        let idExists = true
        let id: string = ''
        do {
            // generar un id único
            const auxId = Math.random().toString(36).substring(2, 7)

            // comprobar si existe
            const idExistsReq = await db.select().from(ShortenedUrl).where(
                eq(ShortenedUrl.shortUrl, auxId)
            )

            if (idExistsReq.length === 0) {
                idExists = false
                id = auxId

                // guardar en la base de datos
                await db.insert(ShortenedUrl).values({
                    userID: body.userID,
                    url: body.url,
                    shortUrl: id,
                    createDate: new Date(),
                    nameURL: body.nameURL,
                })
            }
        } while (idExists)

        const newUrl = new URL(request.url)

        return new Response(JSON.stringify({
            shortUrl: `${newUrl.origin}/${id}`
        }), {
            status: 201
        })
    } catch (e) {
        const error = e as Error
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "content-type": "application/json"
            }
        })
    }


}