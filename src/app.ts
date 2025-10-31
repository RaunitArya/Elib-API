import express from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler.ts';
import userRouter from './users/userRouter.ts';

const app = express();

app.use(express.json());

// Routes 
app.get('/', (_req: express.Request, res: express.Response) => {
    res.json({message: "Welcome to API"})
});

app.use('/api/users', userRouter);

app.use(globalErrorHandler); 

export default app;