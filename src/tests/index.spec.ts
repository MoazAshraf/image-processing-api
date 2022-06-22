import supertest from 'supertest';
import app from '../index';

describe('suite', () => {
    it('test', () => {
        expect(true).toBeTruthy();
    });
});

const request = supertest(app);
describe('supertest suite', () => {
    it('GET / 404', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(404);
    });
});
