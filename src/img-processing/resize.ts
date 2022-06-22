import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

// Resize the image from inputPath and save it to outputPath, returns if the
// outputPath already exists
export default async (
    inputPath: string,
    outputPath: string,
    width: number,
    height: number
) => {
    try {
        // File exists
        await fs.access(outputPath);
    } catch (err) {
        // File doesn't exist
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await sharp(inputPath).resize(width, height).toFile(outputPath);
    }
};
