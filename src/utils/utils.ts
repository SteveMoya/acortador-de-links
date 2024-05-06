export function validarURL(url: string): boolean {

    const urlRegex = /^(ftp|http|https):\/\/[^ "]+\.[a-zA-Z]{2,}(\/\S*)?$/

    return urlRegex.test(url)
}