import express from 'express';

const app = express();

// Routes 
app.get('/', (_req: express.Request, res: express.Response) => {
    res.json({message: "Welcome to API"})
})

export default app;