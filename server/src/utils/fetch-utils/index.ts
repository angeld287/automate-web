const fetch = require('node-fetch');	//npm install node-fetch

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<any> => {
    const res = await fetch(input, init)
    return await res.json()
}