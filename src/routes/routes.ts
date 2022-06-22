import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import resizeOrCached from '../img-processing/resize';

const routes = Router();

routes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    if ('filename' in req.query) {
        const filename = req.query.filename as unknown as string;
        const inputPath = path.join(__dirname, '..', 'full', filename);
        const [filenameNoExt, ext] = filename.split('.');
        let width: number | null = null;
        let height: number | null = null;
        if ('width' in req.query) {
            const widthStr = req.query.width as unknown as string;
            width = parseInt(widthStr, 10);
        } else {
            res.send('"width" query param missing from URL.');
            res.status(400);
        }

        if ('height' in req.query) {
            const heightStr = req.query.height as unknown as string;
            height = parseInt(heightStr, 10);
        } else {
            res.send('"height" query param missing from URL.');
            res.status(400);
        }

        if (width != null && height != null) {
            const outputPath = path.join(
                __dirname,
                '..',
                'thumb',
                `${filenameNoExt}_${width}_${height}.${ext}`
            );
            await resizeOrCached(inputPath, outputPath, width, height);
            res.sendFile(outputPath, (err) => {
                if (err) {
                    res.send(`File "${outputPath}" not found.`);
                    res.status(404);
                    next(err);
                }
            });
            res.status(200);
        }
    } else {
        res.send('"filename" query param missing from URL.');
        res.status(400);
    }
});

export default routes;
