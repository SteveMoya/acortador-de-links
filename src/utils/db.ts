import { ShortenedUrl, User, db, eq, like, Analytics, gte, lte, } from "astro:db"

// Funciones de base de datos de ShortenedURL

export const getLinkUrl = async (shortUrl: string) => {
    try {
        const res = (await db.select().from(ShortenedUrl).where(
            like(ShortenedUrl.shortUrl, shortUrl)
        )).at(0)
        // Aqui hacemos un contador de visitas
        const analitics = (await db.select().from(Analytics).where(
            like(Analytics.shortUrl, shortUrl)
        )).at(0)
        if (analitics) {
            await db.update(Analytics).set({
                visits: analitics.visits + 1
            }).where(
                eq(Analytics.shortUrl, shortUrl)
            )
        } else {
            await db.insert(Analytics).values({
                shortUrl,
                visits: 1,
                date: new Date()
            })
        }

        return {
            success: true,
            data: res ? res.url : null
        }
    } catch (e) {
        const error = e as Error
        return {
            success: false,
            error: error.message
        }
    }
}
export const getShortUrl = async (shortUrl:string) => {
    try {
        const res = (await db.select().from(ShortenedUrl).where(
            like(ShortenedUrl.shortUrl, shortUrl)
        )).at(0)
        
        return {
            success: true,
            data: res
        }
    } catch (e) {
        const error = e as Error
        return {
            success: false,
            error: error.message
        }
    }

}
export const getUrlsFromUser = async (userID: string) => {
    try {
        const res = await db.select().from(ShortenedUrl).where(
            like(ShortenedUrl.userID, userID)
        )

        return {
            success: true,
            data: res
        }
    } catch (e) {
        const error = e as Error
        return {
            success: false,
            error: error.message
        }
    }
}

export const getCountUrlsFromUser = async (userID: string) => {
    try {
        const res = await db.select().from(ShortenedUrl).where(
            like(ShortenedUrl.userID, userID)
        )

        return {
            success: true,
            data: res.length
        }
    } catch (e) {
        const error = e as Error
        return {
            success: false,
            error: error.message
        }
    }
}

// Funciones de base de datos de USERS
export const ExistingAuthUser = async (userID: string) => {
    const res = (await db.select().from(User).where(eq(User.providerID, userID))).at(0)
    if (res) {
        return {
            success: true,
            data: res
        }
    }
    return {
        success: false,
        data: null
    }
}

export const CreateUser = async (userID: string, username: string, email: string, userimage: string, providerID: string,) => {
    try {
        await db.insert(User).values({
            id: userID,
            providerID,
            username,
            email,
            userimage,
        })
        return {
            success: true
        }
    } catch (e) {
        const error = e as Error
        return {
            success: false,
            error: error.message
        }
    }
}


// Funciones de base de datos de ANALYTICS

export const getAnalytics = async (shortUrl: string) => {
    try {
        const res = (await db.select().from(Analytics).where(
            like(Analytics.shortUrl, shortUrl)
        )).at(0)

        return {
            success: true,
            data: res
        }
    } catch (e) {
        const error = e as Error
        return {
            success: false,
            error: error.message
        }
    }
}

export const getTotalsVisits = async (userID: string) => {
    try {
        // Aqui hacemos un contador de todas las visitas de todas las url del usuario
        const res = await db.select().from(ShortenedUrl).where(
            like(ShortenedUrl.userID, userID)
        )
        let total = 0
        for (const url of res) {
            const analitics = (await db.select().from(Analytics).where(
                like(Analytics.shortUrl, url.shortUrl)
            )).at(0)
            total += analitics ? analitics.visits : 0
        }
        return {
            success: true,
            data: total
        }
        
    } catch (e) {
        const error = e as Error
        return {
            success: false,
            error: error.message
        }
    }
}