import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event, context) {
    try {
        const userPrompt = JSON.parse(event.body);

        if (!userPrompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing prompt." }),
            };
        }

        const prompt = `Generate a list of flashcards based on the following topic: "${userPrompt}". 
            Each flashcard should be on its own line, formatted exactly as: 
            term, definition. 
            Do not include any introduction, explanation, or extra text.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 2000,
            temperature: 0,
        });

        const answer = response.choices[0].message.content.trim().toLowerCase();
        
        const lines = answer.split("\n").filter(Boolean);
        const flashcards = lines.map(line => {
            const [term, ...rest] = line.split(",");
            return {
                Term: term.trim(),
                Definition: rest.join(",").trim()
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ set: flashcards }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}