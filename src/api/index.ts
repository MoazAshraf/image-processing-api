import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import resizeOrCached from '../img-processing/resize';

const apiRouter = Router();

apiRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    if (!('filename' in req.query)) {
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

        try {
            await fs.access(inputPath);
            const [filenameNoExt, ext] = filename.split('.');
            const widthStr = req.query.width as unknown as string;
            const width = parseInt(widthStr, 10);
            const heightStr = req.query.height as unknown as string;
            const height = parseInt(heightStr, 10);
            if (Number.isNaN(width) || width < 0) {
                res.status(400);
                res.send(`Invalid "width" value "${width}"`);
            } else if (Number.isNaN(height) || height < 0) {
                res.status(400);
                res.send(`Invalid "height" value "${height}"`);
            } else {
                const outputPath = path.join(
                    __dirname,
                    '..',
                    'thumb',
                    `${filenameNoExt}_${width}_${height}.${ext}`
                );

                await resizeOrCached(inputPath, outputPath, width, height);
                res.status(200);
                res.sendFile(outputPath, (err) => {
                    if (err) {
                        res.send(`Error occured when sending "${outputPath}".`);
                        res.status(400);
                        next(err);
                    }
                });
            }
        } catch (err) {
            res.status(404);
            res.send(`File not found "${inputPath}".`);
            next(err);
        }
    }
});

export default apiRouter;
