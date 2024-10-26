export function validarURL(url: string): boolean {

    const urlRegex = /^(ftp|http|https):\/\/[^ "]+\.[a-zA-Z]{2,}(\/\S*)?$/

    return urlRegex.test(url)
}

export function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return new Date(date).toLocaleDateString('es-ES', options);
}

export const validateURLName = (name: string): boolean => {
    if (name.length > 20 || name.length < 1 ) {
        return false
    }
    return true
}