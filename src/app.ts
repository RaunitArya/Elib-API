import express from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler.ts';

const app = express();

// Routes 
app.get('/', (_req: express.Request, res: express.Response) => {
    res.json({message: "Welcome to API"})
});

app.use(globalErrorHandler); 

export default app;