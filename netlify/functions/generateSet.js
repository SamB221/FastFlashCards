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

        const prompt = `Generate flashcards based on the following prompt: "${userPrompt}". 
            Each flashcard should be on its own line, formatted exactly as:
            term, definition. 
            Do not add any introduction, explanation, or extra text before or after the flashcards. Only output the flashcards.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 2000,
            temperature: 0,
        });

        const answer = response.choices[0].message.content.trim();
        
        const lines = answer.split("\n").filter(Boolean);
        const flashcards = lines.map(line => {
            line = line.replace(/\t/g, ' ').trim(); // remove trailing tabs from definition
            line = line.replace(/[.]+$/, '').trim(); // remove trailing periods from definition

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