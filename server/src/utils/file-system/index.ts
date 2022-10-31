const fs = require("fs");

export const _fs = async (path: string): Promise<any> => {
    try {
        const res = await fs.readFileSync(path)
        return { success: true, url: res, body: res.data }
    } catch (error) {
        return { success: false, url: '', body: 'Error in axios request', errorDetails: error }
    }
}