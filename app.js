import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';

import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

import connectToDatabase  from './database/mongodb.js'
import workflowRouter from './routes/workflow.routes.js';


const app = express();


connectToDatabase();

// handle json requests
app.use(express.json());

// helps us to process the form data sent in by html forms
app.use(express.urlencoded({extended: false}));

// reads cookies from incoming user requests so your app can store user data
app.use(cookieParser());

app.use(arcjetMiddleware);

app.get('/', (req,res) => {
    res.send('Hello from the other side')
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/workflows', workflowRouter);


app.use(errorMiddleware);



 

app.listen(PORT, (req,res) => {
    console.log(`Subscription tracker api is running on http://localhost:${PORT}`)
});

export default app; 