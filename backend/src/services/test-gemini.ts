// Temporary test file to check available models
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('No API key found');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try to list models
  try {
    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'models/gemini-pro',
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        console.log(`✅ ${modelName} works!`);
        console.log('Response:', result.response.text());
        break;
      } catch (error: any) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testModels();

