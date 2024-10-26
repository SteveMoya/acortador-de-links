import type { APIContext } from "astro";

import { getLinkUrl } from "@utils/db";
export const GET = async ( context: APIContext): Promise<Response> => {
  const { shorturl } = context.params
  const request = context.request
  console.log("Esto es lo que trae la peticion",request)
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


  return context.redirect(url.data)
}