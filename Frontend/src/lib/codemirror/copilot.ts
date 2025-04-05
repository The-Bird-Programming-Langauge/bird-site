import { inlineCopilot } from "codemirror-copilot";
import { CohereClient } from "cohere-ai";

export const copilot = inlineCopilot(async (prefix, suffix) => {
  const cohere = new CohereClient({
    token: "YOUR_API_KEY",
  });

  const messages = [
    {
      role: 'system',
      content: `You are a programmer that replaces <FILL_ME> part with the right code. Only output the code that replaces <FILL_ME> part. Do not add any explanation or markdown.`,
    },
    {
      role: 'user',
      content: `${prefix}<FILL_ME>${suffix}`,
    }
  ];

  const response = await cohere.chat({
    model: "command",
    messages: messages,
  });

  const prediction = response.body.text;

  console.log('Prediction:', prediction);

  return prediction;
});