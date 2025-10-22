export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  // Construct the prompt with the provided ingredients
  const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;

  // Return the request configuration for Amazon Titan
  return {
    resourcePath: `/model/amazon.titan-text-express-v1/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputText: prompt,
        textGenerationConfig: {
          maxTokenCount: 1000,
          temperature: 0.7,
          topP: 0.9
        }
      }),
    },
  };
}

export function response(ctx) {
  // Parse the response body
  const parsedBody = JSON.parse(ctx.result.body);
  
  // Extract text from Amazon Titan response
  if (parsedBody.results && parsedBody.results.length > 0) {
    return {
      body: parsedBody.results[0].outputText,
    };
  } else {
    return {
      body: "No response content available",
      error: "Invalid response structure from Bedrock"
    };
  }
}