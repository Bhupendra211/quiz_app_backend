import Problem from "../../models/problem.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { paginate } from "../../utils/paginate.js";
import { errorResponse, successResponse } from "../../utils/responseHandler.js";
import { validateFields } from "../../utils/validateFields.js";
import { client } from '../../config/redis.js';



// Create add new Coding Problem
export const addCodingProblem = asyncHandler(async (req, res) => {
    try {

        const requiredFields = [
            "title", "description", "testCases"];
        const errorMessage = validateFields(requiredFields, req.body);
        if (errorMessage) {
            return errorResponse(res, 400, errorMessage);
        }

        const { title, description, testCases } = req.body;

        const manager = new Problem({ title, description, testCases });
        await manager.save();

        return successResponse(res, 201, "Coding Problem Created Successfully.", Problem);

    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
});


// API to get problems
export const getAllProblems = asyncHandler(async (req, res) => {
    try {

        let problem = await client.get("problems");
        if (!problem || problem === null) {
            problem = await Problem.find();

            if (problem.length === 0) {
                return errorResponse(res, 404, "No Questions Found", null);
            }
            await client.set("problems", JSON.stringify(problem), "EX", 60 * 60 * 3);


        } else {
            problem = JSON.parse(problem);
        }

        const data = {
            "statusResponse": "200",
            "status": "success",
            "problem": problem,
        }

        return successResponse(res, 200, "Question Fetched Successfully", data);

    } catch (error) {
        res.status(500).json({ error: "Database Error", details: error.message });
    }
});