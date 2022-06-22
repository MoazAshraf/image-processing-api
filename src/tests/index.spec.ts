import supertest from 'supertest';
import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import app from '../index';
import resize from '../img-processing/resize';
import fileExists from '../util';

describe('GET /api', (): void => {
    const request = supertest(app);

    it('Expect GET /api to return 200; Welcome', async () => {
        const response = await request.get('/api');
        expect(response.status).toBe(200);
        expect(response.text.startsWith('Welcome to the API.')).toBeTrue();
    });

    it('Expect GET /api?filename=fjord.jpg to return 400; missing width', async (): Promise<void> => {
        const response = await request.get('/api?filename=fjord.jpg');
        expect(response.status).toBe(400);
        expect(
            response.text.startsWith('"width" query param missing')
        ).toBeTrue();
    });

    it('Expect GET /api?filename=fjord.jpg&width=400 to return 400; missing height', async (): Promise<void> => {
        const response = await request.get('/api?filename=fjord.jpg&width=400');
        expect(response.status).toBe(400);
        expect(
            response.text.startsWith('"height" query param missing')
        ).toBeTrue();
    });

    it('Expect GET /api?filename=fjord.jpg&width=400&height=400 to return 200', async (): Promise<void> => {
        const response = await request.get(
            '/api?filename=fjord.jpg&width=400&height=400'
        );
        expect(response.status).toBe(200);
    });

    it('Expect GET /api?filename=invalid.jpg&width=400&height=400 to return 404', async (): Promise<void> => {
        const response = await request.get(
            '/api?filename=invalid.jpg&width=400&height=400'
        );
        expect(response.status).toBe(404);
    });
});

describe('Resize image', async (): Promise<void> => {
    const inputPath = path.join(__dirname, '..', 'full', 'fjord.jpg');
    const outputPath = path.join(
        __dirname,
        '..',
        'thumb',
        'fjord_test_out.jpg'
    );

    beforeEach(async (): Promise<void> => {
        // Remove the file first if it exists
        if (await fileExists(outputPath)) await fs.unlink(outputPath);
        else await fs.mkdir(path.dirname(outputPath), { recursive: true });
    });

    it('Resize full/fjord.jpg to 400x400', async (): Promise<void> => {
        await resize(inputPath, outputPath, 400, 400);
        await expectAsync(fs.access(outputPath)).toBeResolved();
        const metadata = await sharp(outputPath).metadata();
        expect(metadata.width).toBe(400);
        expect(metadata.height).toBe(400);
    });
});
