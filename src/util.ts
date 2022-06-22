import { promises as fs } from 'fs';

const fileExists = async (filepath: string): Promise<boolean> => {
    try {
        await fs.access(filepath);
        return true;
    } catch (err) {
        return false;
    }
};

export default fileExists;
