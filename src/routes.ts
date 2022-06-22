import { Router } from 'express';
import apiRouter from './api/apiRouter';

const routes = Router();

routes.use('/api', apiRouter);

export default routes;
