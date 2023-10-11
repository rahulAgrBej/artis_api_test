import express from 'express';
import supplementalRouter from './routers/supplemental'
import snetRouter from './routers/snet'

const app = express();

app.use(express.json());
app.use('/supplemental', supplementalRouter);
app.use('/snet', snetRouter);

export default app;