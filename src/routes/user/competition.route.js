import express from "express";
import { getQuestions, submitQuiz, getAllQuiz } from "../../controllers/user/competition.controller.js";

const competitionRoutesManager = express.Router();

competitionRoutesManager.get('/all-quiz', getAllQuiz);
competitionRoutesManager.get('/question/:id', getQuestions);
competitionRoutesManager.post('/submit-quiz', submitQuiz);




export default competitionRoutesManager;
