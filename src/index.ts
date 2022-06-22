import express from 'express';
import logging from 'morgan';
import routes from './routes';

const port = 8086;
const host = 'localhost';
const app = express();

app.use(logging('dev'));
app.use('/', routes);

app.listen(port, host, (): void => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at http://${host}:${port}`);
});

export default app;
