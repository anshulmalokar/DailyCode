interface ProjectWorkflow{
    projectTitle: string,
    summary: string,
    phases: ProjectPhase[]
}

interface ProjectPhase{
    phaseName: string,
    steps: WorkflowSteps[]
}

interface WorkflowSteps{
    stepId: number,
    description: string,
    toolsRequired: string
}

const apiKey = "";
const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";
const model = "gemini-2.5-flash-preview-09-2025";

const responseSchema = {
    type: "OBJECT",
    properties: {
        "projectTitle": { "type": "STRING" },
          "summary": { "type": "STRING" },
        "phases": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "phaseName": { "type": "STRING" },
                    "steps": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "stepId": { "type": "NUMBER" },
                                "description": { "type": "STRING" },
                                "toolRequired": { "type": "STRING" }
                            }
                        }
                    }
                }
            }
        },
    },
    propertyOrdering: ["projectTitle", "summary", "phases"]
};

async function generateWorkflow(goal: string, maxRetires: number = 3): Promise<ProjectWorkflow | null>{
    console.log("Generating the workflow for goal " + goal);
    try{
        const systemPrompt = `You are a world-class Project Manager and Solution Architect. Your task is to break down the user's high-level goal into a structured, step-by-step workflow with clear phases and required tools. Be professional and detailed.`;
        const userQuery = `Generate a comprehensive project workflow for the following goal: ${goal}. Divide it into 3 major phases, with 3 to 5 steps per phase. Identify the primary tool required for each step (e.g., 'Terminal', 'VS Code', 'Browser', 'Database', 'Figma').`;
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        };
        
        for(let attempt = 0; attempt< maxRetires; attempt++){
            try{
                
                console.log(`Attempt ${attempt} of ${maxRetires} to fetch workflow...`);

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if(!response.ok){
                    throw new Error(`HTTP Error status: ${response.status}`);
                }

                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    const jsonText = candidate.content.parts[0].text;
                    const parsedWorkflow: ProjectWorkflow = JSON.parse(jsonText);
                    console.log(`Successfully generated workflow on attempt ${attempt}.`);
                    return parsedWorkflow;
                } else {
                    throw new Error("AI response was received but contained no text content.");
                }
                
            }catch(e){
                console.log("Attempt failed " + attempt + + " " + e);
                if(attempt < maxRetires){
                    const delay = attempt * 2000;
                    console.log(`Waiting ${delay/1000} seconds before retrying`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
    }catch(e){
        console.error(`Failed to generate workflow after ${maxRetires} attempts.`);
    }
    return null;
}

async function main() {
    const projectGoal = "Design and implement a full-stack, real-time stock price tracking application using React and Firebase Firestore.";
    const workflow: ProjectWorkflow | null = await generateWorkflow(projectGoal, 3);
    if(workflow){
        console.log("Name of the workflow is " + workflow.projectTitle.toUpperCase());
        workflow.phases.map(e => {
            console.log("Phase " + e.phaseName);
            e.steps.map(s => {
                console.log(s.stepId)
                console.log(s.description);
                console.log(s.toolsRequired);
            });
        })
    }else{
        console.log("\nCould not generate a structured project workflow after multiple attempts.");
    }
}


main();