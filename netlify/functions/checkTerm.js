import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event, context) {
  try {
    const { term, definition } = JSON.parse(event.body);

    if (!term || !definition) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing term or definition." }),
      };
    }

    const prompt = `Check if the definition roughly matches the term. Answer with only "Yes" if it covers the main idea, even if incomplete.' +
    'Say "No" only if clearly wrong. Term: "${term}" Definition: "${definition}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 5,
      temperature: 0,
    });

    const answer = response.choices[0].message.content.trim().toLowerCase();

    return {
      statusCode: 200,
      body: JSON.stringify({ matches: answer === "yes" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}