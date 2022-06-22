import { Router } from 'express';
import apiRouter from './api/index';

const routes = Router();

routes.use('/api', apiRouter);

export default routes;
