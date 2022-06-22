import supertest from 'supertest';
import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import app from '../index';
import resizeOrCached from '../img-processing/resize';

describe('GET /api', () => {
    const request = supertest(app);

    it('Expect GET /api to return 400; missing filename', async () => {
        const response = await request.get('/api');
        expect(response.status).toBe(400);
        expect(
            response.text.startsWith('"filename" query param missing')
        ).toBeTrue();
    });

    it('Expect GET /api?filename=fjord.jpg to return 400; missing width', async () => {
        const response = await request.get('/api?filename=fjord.jpg');
        expect(response.status).toBe(400);
        expect(
            response.text.startsWith('"width" query param missing')
        ).toBeTrue();
    });

    it('Expect GET /api?filename=fjord.jpg&width=400 to return 400; missing height', async () => {
        const response = await request.get('/api?filename=fjord.jpg&width=400');
        expect(response.status).toBe(400);
        expect(
            response.text.startsWith('"height" query param missing')
        ).toBeTrue();
    });

    it('Expect GET /api?filename=fjord.jpg&width=400&height=400 to return 200', async () => {
        const response = await request.get(
            '/api?filename=fjord.jpg&width=400&height=400'
        );
        expect(response.status).toBe(200);
    });

    it('Expect GET /api?filename=invalid.jpg&width=400&height=400 to return 404', async () => {
        const response = await request.get(
            '/api?filename=invalid.jpg&width=400&height=400'
        );
        expect(response.status).toBe(404);
    });
});

describe('Resize image', async () => {
    const inputPath = path.join(__dirname, '..', 'full', 'fjord.jpg');
    const outputPath = path.join(
        __dirname,
        '..',
        'thumb',
        'fjord_test_out.jpg'
    );

    beforeEach(async () => {
        // Remove the file first if it exists
        try {
            await fs.unlink(outputPath);
        } catch (err) {
            // File already exists
        }
    });

    it('Resize full/fjord.jpg to 400x400', async () => {
        await resizeOrCached(inputPath, outputPath, 400, 400);
        await expectAsync(fs.access(outputPath)).toBeResolved();
        const metadata = await sharp(outputPath).metadata();
        expect(metadata.width).toBe(400);
        expect(metadata.height).toBe(400);
    });
});
