import { ShortenedUrl, User, db, eq, like } from "astro:db"

export const getUserByEmail = async (email: string) => {
    try {
        const res = await db.select().from(User).where(
            like(User.email, email)
        )

        if (res.length === 0) {
            return {
                success: true,
                data: null
            }
        }

        return {
            success: true,
            data: res[0]
        }
    } catch (e) {
        const error = e as Error
        return {
            success: false,
            error: error.message
        }
    }
}

export const getLinkUrl = async (shortUrl: string) => {
    try {
        const res = await db.select().from(ShortenedUrl).where(
            like(ShortenedUrl.shortUrl, shortUrl)
        )

        if (res.length === 0) {
            return {
                success: true,
                data: null
            }
        }

        return {
            success: true,
            data: res[0].url
        }
    } catch (e) {
        const error = e as Error
        return {
            success: false,
            error: error.message
        }
    }
}

export const getUrlsFromUser = async (userID: number) => {
    try {
        const res = await db.select({
            url: ShortenedUrl.url,
            shortUrl: ShortenedUrl.shortUrl
        }).from(ShortenedUrl).where(
            eq(ShortenedUrl.userID, userID)
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

export const getCountUrlsFromUser = async (userID:number) => {
    try {
        const res = await db.select().from(ShortenedUrl).where(
            eq(ShortenedUrl.userID, userID)
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

export const getVisitsFromUrl = async (shortUrl: string) => {
    try {
        const res = await db.select().from(ShortenedUrl).where(
            like(ShortenedUrl.shortUrl, shortUrl)
        )

        if (res.length === 0) {
            return {
                success: true,
                data: null
            }
        }

        return {
            success: true,
            data: res[0].visits
        }
    } catch (e) {
        const error = e as Error
        return {
            success: false,
            error: error.message
        }
    }
}

export const getAllVisitsFromUser = async (userID: number) => {
    try {
        const res = await db.select({
            shortUrl: ShortenedUrl.shortUrl,
            visits: ShortenedUrl.visits
        }).from(ShortenedUrl).where(
            eq(ShortenedUrl.userID, userID)
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
