import express from 'express';
import routes from './routes/routes';

const port = 8086;
const host = 'localhost';
const app = express();

app.use('/', routes);

app.listen(port, host, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at http://${host}:${port}`);
});

export default app;
