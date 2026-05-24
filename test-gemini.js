const { GoogleGenerativeAI } = require("@google/generative-ai");
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY);
async function run() {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent("hello");
    console.log(result.response.text());
  } catch(e) {
    console.error(e);
  }
}
run();
