import dayjs from 'dayjs';
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express')


const REMINDERS = [7,5,2,1]

export const sendReminders = serve(async(context)=>{
    console.log('reached reminder');

    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    console.log('fetched subscription', subscription);

    if(!subscription || subscription.status != "active") return;

    const renewalDate = dayjs(subscription.renewalDate);

    console.log('Renewal date', renewalDate)

    if(renewalDate.isBefore(dayjs())){
        console.log('if before');
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`);
        return;
    }


    // if there is an active subscription and the reminder date is in the future
    for (const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
         // renewal date = 22 feb, reminder date = 15 feb
        
         console.log('test1')
        //  if reminder is after the current date, sleep until the reminder date
         if(reminderDate.isAfter(dayjs())){
            console.log('test2')
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate)
         }

         
         if (dayjs().isSame(reminderDate, 'day')) {
            console.log('testing here');
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }


    }
 


});


const fetchSubscription = async(context, subscriptionId) => {
    return await context.run('get subscription',async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

const sleepUntilReminder = async(context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate())
}

const triggerReminder = async(context, label, subscription) => {
    console.log('testing again');
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`)
        //Send email, sms, push notification
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
  })
}