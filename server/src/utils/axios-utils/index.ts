const axios = require("axios");

export const _axios = async (options: any): Promise<any> => {
    try {
        const res = await axios.request(options);
        return { success: true, url: options.url, body: res.data }
    } catch (error) {
        return { success: false, url: options.url, body: error.response.data.error }
    }
}