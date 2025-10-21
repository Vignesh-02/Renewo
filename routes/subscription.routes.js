import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req,res) => res.send({title: 'Get all subscriptions'}));

subscriptionRouter.get('/:id', (req,res) => res.send({title: 'Get subscription'}));

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req,res) => res.send({title: 'UPDATE subscription'}));

subscriptionRouter.delete('/:id', (req,res) => res.send({title: 'Delete the subscriptions'}));

subscriptionRouter.get('/user/:id', authorize, getUserSubscription);

subscriptionRouter.put('/:id/cancel', (req,res) => res.send({title: 'Get all subscriptions'}));

subscriptionRouter.get('/upcoming-renewals', (req,res) => res.send({title: 'Get upcoming renewals'}));



 

export default subscriptionRouter;