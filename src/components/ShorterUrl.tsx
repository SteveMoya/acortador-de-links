import { validarURL } from "@src/utils/utils"
import { useRef, useState } from "react"
import { toast } from "sonner"
export const ShorterUrl = ({ userID }:
    { userID?: number }
) => {
    const [url, setUrl] = useState<string>()
    const [nameURL, setNameURL] = useState<string>()
    
    const [error, setError] = useState<string>()
    const shortenedUrlRef = useRef<HTMLInputElement>(null)


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!url) {
            setError('Debes escribir una URL')
            toast.error('Debes escribir una URL')
            return
        }

        if (!validarURL(url)) {
            setError('Debes escribir una URL válida')
            toast.error('Debes escribir una URL válida')
            return
        }
        try {
            const res = await fetch('/api/shorter-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, userID, nameURL }),
            });
            const data = await res.json();
            const shortUrldata = data.shortUrl;
            if (!shortUrldata) {
                setError('Ocurrió un error al acortar la URL, intenta de nuevo más tarde');
                toast.error('Ocurrió un error al acortar la URL, intenta de nuevo más tarde')
                return;
            }
            if (shortenedUrlRef.current) {
                shortenedUrlRef.current.value = shortUrldata;
            }
            setError(undefined);
            toast.success('URL Acortada con éxito')
            return
        } catch (err) {
            const error = await err as Error;
            console.error(error.message);
            setError('Ocurrió un error al acortar la URL, intenta de nuevo más tarde');
            toast.error('Ocurrió un error al acortar la URL, intenta de nuevo más tarde')
        }
        finally {
            setUrl('');
            setNameURL('');
        }
    }
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shortenedUrlRef.current!.value);
            toast.success('URL Copiada con éxito')
        }
        catch (err) {
            const error = await err as Error;
            console.error(error.message);
            setError('Ocurrió un error al copiar la URL, intenta de nuevo más tarde');
            toast.error('Ocurrió un error al copiar la URL, intenta de nuevo más tarde')
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col max-w-screen-md my-10 mx-auto gap-4">
                <label className="flex flex-col"> <h3 className="text-3xl ">Nombre Personalizado de la URL</h3>
                    <input type="text"
                        placeholder="Link de Youtube, Facebook, etc."
                        className=" p-2 border border-gray-300 rounded-lg text-black"
                        value={nameURL} onChange={(e) => setNameURL(e.target.value)}
                    />
                </label>
                <label className="flex flex-col"> <h3 className="text-3xl ">URL a Acortar</h3>
                    <input type="url" required
                        placeholder="Escribe la Link que quieres Acortar"
                        className=" p-2 border border-gray-300 rounded-lg text-black"
                        value={url} onChange={(e) => setUrl(e.target.value)}
                    />
                </label>
                {error && <p className="text-red-500">{error}</p>}
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Acortar</button>
                <label className="flex flex-col"> <h3 className="text-3xl ">URL Acortada</h3>
                    <input type="url" ref={shortenedUrlRef} readOnly
                        disabled
                        className=" p-2 border border-gray-300 rounded-lg text-black"
                    />
                </label>
            </form>
            <div className="flex flex-col max-w-screen-md mx-auto">
                {shortenedUrlRef.current?.value && (
                    <>
                        <button onClick={handleCopy} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Copiar</button>
                        <a
                            href={shortenedUrlRef.current.value}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <button>
                                Ir a la URL Acortada: <span className="text-blue-500 underline">
                                    {shortenedUrlRef.current.value}
                                </span>
                            </button>
                        </a>
                    </>
                )}
            </div>
        </>
    )
}
