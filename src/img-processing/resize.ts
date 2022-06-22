import sharp, { OutputInfo } from 'sharp';

// Resize the image from inputPath and save it to outputPath, returns if the
// outputPath already exists
const resize = async (
    inputPath: string,
    outputPath: string,
    width: number,
    height: number
): Promise<OutputInfo> =>
    sharp(inputPath).resize(width, height).toFile(outputPath);

export default resize;
