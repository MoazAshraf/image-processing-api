import express from 'express';

const port = 8086;
const host = 'localhost';
const app = express();

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});

export default app;
