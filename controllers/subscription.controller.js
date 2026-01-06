import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try{
        const subscriptionData = await Subscription.create({
            ...req.body,
            user: req.user._id,
            // req.user is coming from the auth middleware
        });

        console.log('subscription', subscriptionData);

        // const out = await triggerReminderWorkflows(workflowClient, subscription);

        const out = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscriptionData.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0
        })

        console.log('reminder api output', out);

        const workflowRunId = out.workflowRunId;

        res.status(201).json({ success: true, data: subscriptionData, workflowRunId})
    }catch(error){
        next(error);
    }
}


export const updateSubscription = async (req, res, next) => {
    try {


        const subscription = await Subscription.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        // the user trying to update is a differnet person
        if (req.user._id.toString() !== subscription.user.toString()){
            const error = new Error('You are trying to update the subscription details of another user, which is not permitted');
            error.statusCode = 404;
            throw error;
        }

        Object.assign(subscription, req.body);
        await subscription.save();

        // Trigger new workflow (old one will self-ignore)
        const out = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription._id,
                version: Date.now(), // forces new run
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        // new workflow run id
        const workflowRunId = out.workflowRunId;

        res.status(200).json({ success: true, data: subscription, workflowRunId });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOne({
            _id: req.params.id,
            user: req.user._id
        });



        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        // the user trying to delete is a differnet person
        if (req.user._id.toString() !== subscription.user.toString()){
            const error = new Error('You are trying to delete the subscription details of another user, which is not permitted');
            error.statusCode = 404;
            throw error;
        }

        // Soft delete
        subscription.status = 'cancelled';
        subscription.cancelledAt = new Date();
        await subscription.save();

        // await subscription.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};







export const getUserSubscription = async(req, res, next) => {
    try{


        // check if the usser is the same as the token
        if(req.user.id !== req.params.id){
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }
        
        const subscriptions = await Subscription.find({user: req.params.id});

        res.status(200).json({ success: true, data: subscriptions});
        
    }catch(e){
        next(e);
    }
}