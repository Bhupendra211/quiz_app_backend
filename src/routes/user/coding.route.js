import express from "express";
import { exec } from "child_process";
import fs from "fs";

const compilerRouteManager = express.Router();
const testCases = JSON.parse(fs.readFileSync("./testcases.json", "utf-8"));

compilerRouteManager.post('/execute', async (req, res) => {
    try {
        // Write the C++ code to a file
        fs.writeFileSync("code.cpp", req.body.code);

        // Compile and execute the code

        const command = process.platform === "win32" ?
            "g++ code.cpp -o output.exe && output.exe" :
            "g++ code.cpp -o output && ./output";

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("Error:", stderr || error);
                return;
            }
            console.log("Output:", stdout);
        });


        // exec("g++ code.cpp -o output.exe && output.exe", (error, stdout, stderr) => {
        //     if (error) {
        //         console.log(error)
        //         return res.status(400).json({ error: stderr });
        //     }

        //     // Compare with expected output
        //     const testCase = testCases.find(tc => tc.input.trim() === "5");
        //     const result = stdout.trim() === testCase.expected_output.trim();

        //     return res.json({ output: stdout.trim(), passed: result });
        // });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

export default compilerRouteManager;
