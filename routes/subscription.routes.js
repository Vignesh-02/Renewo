import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions, getSubscription, updateSubscription, deleteSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req,res) => res.send({title: 'Get all subscriptions'}));

subscriptionRouter.get('/:id', authorize, getSubscription);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, updateSubscription);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// subscriptionRouter.put('/:id/cancel', authorize, cancelUserSubscription);

// subscriptionRouter.get('/upcoming-renewals', authorize, checkUpcomingRenewals);



 

export default subscriptionRouter;