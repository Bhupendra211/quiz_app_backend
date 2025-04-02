import { Worker } from "bullmq";
import StudentAttempt from "../models/studentAttempt.model.js";
import { client } from "../config/redis.js";
import dbConnection from "./dbConnection.js";

const connection= async ()=>{
    await dbConnection();
}

const quizWorker = new Worker('quizQueue', async (job) => {
    try {

        await connection();
        const { student_id, quiz_id, answers } = job.data;


        await StudentAttempt.insertMany([{ student_id, quiz_id, answers }]);

    } catch (error) {
        console.error("Quiz submission processing failed:", error);
        throw error;
    }
}, {
    connection: client,
    concurrency: 10 // Process 10 quiz submissions at the same time
});


console.log("Quiz worker started...");

export default quizWorker;
