
import { Client as WorkflowClient }  from '@upstash/workflow';

import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

// const client = new Client({
//   token: QSTAS_TOKEN
// });

// await client.trigger({
//   url: QSTASH_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

export const workflowClient = new WorkflowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN
})