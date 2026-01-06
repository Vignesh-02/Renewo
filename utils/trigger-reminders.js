
const REMINDERS = [7, 5, 2, 1];

export const triggerReminderWorkflows = async (workflowClient, subscription) => {
  for (const daysBefore of REMINDERS) {
    await workflowClient.trigger({
      url: `${process.env.SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription._id.toString(),
        daysBefore,
      },
      headers: { 'content-type': 'application/json' },
      retries: 0,
    });
  }
};
