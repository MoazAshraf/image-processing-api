import path from 'path';
import { promises as fs } from 'fs';
import { Router, Request, Response } from 'express';
import resize from '../img-processing/resize';
import fileExists from '../util';

const apiRouter = Router();

apiRouter.get('/', async (req: Request, res: Response): Promise<void> => {
    if (Object.keys(req.query).length === 0) {
        res.status(200);
        res.send(
            'Welcome to the API. Required params: filename, width, height.'
        );
    } else if (!('filename' in req.query)) {
        res.status(400);
        res.send('"filename" query param missing from URL.');
    } else if (!('width' in req.query)) {
        res.status(400);
        res.send('"width" query param missing from URL.');
    } else if (!('height' in req.query)) {
        res.status(400);
        res.send('"height" query param missing from URL.');
    } else {
        const filename = req.query.filename as unknown as string;
        const inputPath = path.join(__dirname, '..', 'full', filename);

        if (await fileExists(inputPath)) {
            const [filenameNoExt, ext] = filename.split('.');
            const widthStr = req.query.width as unknown as string;
            const width = parseInt(widthStr, 10);
            const heightStr = req.query.height as unknown as string;
            const height = parseInt(heightStr, 10);
            if (Number.isNaN(width) || width <= 0) {
                res.status(400);
                res.send(`Invalid "width" value "${widthStr}"`);
            } else if (Number.isNaN(height) || height <= 0) {
                res.status(400);
                res.send(`Invalid "height" value "${heightStr}"`);
            } else {
                const outputPath = path.join(
                    __dirname,
                    '..',
                    'thumb',
                    `${filenameNoExt}_${width}_${height}.${ext}`
                );

                // Resize image first if file doesn't exist
                if (!(await fileExists(outputPath))) {
                    // Create the output file's parent directory
                    await fs.mkdir(path.dirname(outputPath), {
                        recursive: true
                    });
                    // Resize the image
                    await resize(inputPath, outputPath, width, height);
                }
                // Send the resized image in the response
                res.status(200);
                res.sendFile(outputPath, (err) => {
                    if (err) {
                        res.status(400);
                        res.send(
                            `An error occurred while sending "${outputPath}".`
                        );
                    }
                });
            }
        } else {
            res.status(404);
            res.send(`File not found "${inputPath}".`);
        }
    }
});

export default apiRouter;
