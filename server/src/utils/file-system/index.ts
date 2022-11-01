const fs = require("fs");

export const readFileSync = async (path: string): Promise<any> => {
    try {
        const res = await fs.readFileSync(path)
        return { success: true, response: res, body: res.data }
    } catch (error) {
        return { success: false, response: '', body: 'Error in readFileSync request', errorDetails: error }
    }
}

export const createWriteStream = async (fileName: string): Promise<any> => {
    try {
        const res = await fs.createWriteStream(fileName);
        return { success: true, response: res, body: res.data }
    } catch (error) {
        return { success: false, response: '', body: 'Error in createWriteStream request', errorDetails: error }
    }
}
