var _axios = require("axios").default;

export const axios = async (options: any): Promise<any> => {
    try {
        const res = await _axios.request(options);
        return { success: true, url: options.url, body: res.data }
    } catch (error) {
        return { success: false, url: options.url, body: error }
    }
}