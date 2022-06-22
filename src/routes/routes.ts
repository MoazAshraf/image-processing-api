import { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const routes = Router();

routes.get('/', (req, res) => {
    if ('filename' in req.query) {
        const filepath = path.join(
            __dirname,
            '..',
            'full',
            req.query.filename as string
        );
        res.sendFile(filepath, (err) => {
            res.send(`File "${filepath}" not found.`);
            res.status(404);
        });
        res.status(200);
    } else {
        res.send('"filename" query param missing from URL.');
        res.status(400);
    }
});

export default routes;
