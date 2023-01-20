const fetch = require("node-fetch");

export const _fetch = async (url: string, options?: any): Promise<any> => {
    try {
        const response = await fetch(url, options);
        const res = await response.json();
        return { success: true, url: url, body: res }
    } catch (error) {
        return { success: false, url: url, body: 'Error in fetch request', errorDetails: error }
    }
}