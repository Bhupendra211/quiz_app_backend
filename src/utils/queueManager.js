import { client, Queue } from "../config/redis.js";

const quizQueue = new Queue('quizQueue', {
    connection: client,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 3000
        }
    }
});

export default quizQueue;