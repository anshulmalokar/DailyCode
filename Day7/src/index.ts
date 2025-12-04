interface CodeSnippet{
    id: number,
    filename: string,
    code: string,
    mockProcessingTimeMs: number
}

interface CodeReviewResult{
    id: number;
    filename: string;
    status: 'Accepted' | 'NEEDS_REVISION' | 'ERROR';
    reviewComment: string
}

async function mockCodeReviewApi(snippet: CodeSnippet): Promise<CodeReviewResult>{
    const { id, filename, code, mockProcessingTimeMs } = snippet;
    if(code.length > 150){
        return Promise.resolve({
            id,
            filename,
            status: "ERROR",
            reviewComment: 'Code has exceeded the complexity limit for quick review' 
        });
    }
    return new Promise(resolve => setTimeout(() => {
        const isApproved = id % 3 !== 0; // Simple logic: every 3rd snippet needs revision
        const status = isApproved ? 'Accepted' : 'NEEDS_REVISION';
        const comment = isApproved 
            ? 'Clean and follows stylistic guidelines.' 
            : 'Consider optimizing the loop complexity for better performance.';
        resolve({
            id,
            filename,
            reviewComment: comment,
            status
        });
    }, mockProcessingTimeMs))
}

// Process a batch of code in paralle using promise all

async function runbatchReview(snippets: CodeSnippet[]): Promise<CodeReviewResult[]>{
    console.log("Starting the batch review request for the snippets length " + snippets.length);
    const startTime = Date.now();
    const reviewPromise = snippets.map(cs => mockCodeReviewApi(cs));
    const results = await Promise.all(reviewPromise);
    const totalTime = Date.now() - startTime;
    console.log("The process completed in " + totalTime);
    return results;
}