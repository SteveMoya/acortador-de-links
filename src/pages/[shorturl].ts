import type { APIRoute } from "astro";
import { getLinkUrl } from "@utils/db";
import { ShortenedUrl, db, eq } from "astro:db";
export const GET: APIRoute = async ({ params, redirect }) => {
  const { shorturl } = params

  if (!shorturl) {
    return new Response(null, {
      status: 400
    })
  }

  const url = await getLinkUrl(shorturl)

  if (!url.success) {
    return new Response(JSON.stringify({ error: "No se ha encontrado la URL" }), {
      status: 404,
      headers: {
        "content-type": "application/json"
      }
    })
  }

  if (!url.data) {
   return new Response(JSON.stringify({ error: "No se ha enviado la URL" }), {
            status: 400,
            headers: {
                "content-type": "application/json"
            }
        })
  }
  // aqui contamos las visitas a la url y la enviamos a la db
  await db.select().from(ShortenedUrl).where(
    eq(ShortenedUrl.shortUrl, shorturl)
  ).values({
    visits: + 1
  })


  return redirect(url.data)
}