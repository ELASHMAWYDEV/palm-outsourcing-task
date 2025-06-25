interface SuggestionRequest {
  energyLevel: number;
  mood: string;
}

interface OpenRouterResponse {
  id: string;
  choices: Array<{
    text: string;
    index: number;
    finish_reason: string;
  }>;
}

export async function getSuggestions({
  energyLevel,
  mood,
}: SuggestionRequest): Promise<string[]> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is required");
  }

  const prompt = `Based on an energy level of ${energyLevel}/10 and mood: "${mood}", provide 5 helpful suggestions for improving wellbeing. Return only a JSON array like this:
["suggestion 1","suggestion 2","suggestion 3","suggestion 4","suggestion 5"] no extra text or formatting`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-maverick:free",
        prompt,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenRouter API error: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as OpenRouterResponse;
    console.log({ data });

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No suggestions returned from OpenRouter");
    }

    const suggestionText = data.choices[0].text.trim();
    console.log({ suggestionText });

    try {
      const match = suggestionText.match(/\[(.*)\]/);
      const suggestions = match ? JSON.parse(`[${match[1]}]`) : [];

      console.log({ suggestions });
      if (!Array.isArray(suggestions)) {
        throw new Error("Response is not an array");
      }

      return suggestions.filter(
        (suggestion) => typeof suggestion === "string" && suggestion.length > 0
      );
    } catch (parseError) {
      console.error("Failed to parse JSON response:", suggestionText);
      throw new Error("Invalid JSON response from OpenRouter");
    }
  } catch (error) {
    console.error("Error getting suggestions from OpenRouter:", error);
    throw error;
  }
}
