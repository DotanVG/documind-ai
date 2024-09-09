// services/aiService.js
const OpenAI = require('openai');
const dotenv = require('dotenv');
const { getCachedValue, setCachedValue } = require('./cacheService');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Splits the document into very small chunks.
 * @param {string} text - The document text to split
 * @param {number} maxChars - Maximum number of characters per chunk
 * @returns {string[]} - Array of text chunks
 */
function splitIntoChunks(text, maxChars = 500) {
    const chunks = [];
  let currentChunk = "";
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChars) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
        }
    currentChunk += sentence + " ";
    }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
    }

    return chunks;
}

/**
 * Analyzes a small chunk of text using OpenAI's GPT model.
 * @param {string} chunk - The text chunk to analyze
 * @param {string} query - The user's query
 * @returns {Promise<string>} - The analysis result for the chunk
 */
async function analyzeChunk(chunk, query) {
    const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
        messages: [
      {role: "system", content: "Analyze this text snippet very briefly, focusing only on information relevant to the query."},
      {role: "user", content: `Text: ${chunk}\n\nQuery: ${query}`}
        ],
    max_tokens: 50
    });

    return completion.choices[0].message.content;
}

/**
 * Summarizes a set of chunk analyses.
 * @param {string[]} analyses - Array of chunk analyses
 * @param {string} query - The user's query
 * @returns {Promise<string>} - Summarized analysis
 */
async function summarizeAnalyses(analyses, query) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "Summarize these analysis snippets very concisely, focusing on the most relevant information to the query."},
      {role: "user", content: `Analyses:\n${analyses.join('\n')}\n\nQuery: ${query}`}
    ],
    max_tokens: 100
  });

  return completion.choices[0].message.content;
}

/**
 * Analyzes a document using OpenAI's GPT model with extreme chunking for very large documents.
 * @param {string} fileContent - The content of the uploaded document
 * @param {string} query - The user's query about the document
 * @returns {Promise<string>} - The AI-generated analysis result
 */
const analyzeDocument = async (fileContent, query) => {
  const cacheKey = `analysis:${Buffer.from(fileContent).toString('base64').slice(0, 20)}:${query}`;

    try {
        // Check cache first
        const cachedResult = await getCachedValue(cacheKey);
        if (cachedResult) {
            console.log('Returning cached result');
            return cachedResult;
        }

    const chunks = splitIntoChunks(fileContent);
    let chunkAnalyses = [];
    let finalSummaries = [];

        for (let i = 0; i < chunks.length; i++) {
      const chunkAnalysis = await analyzeChunk(chunks[i], query);
      chunkAnalyses.push(chunkAnalysis);

      // Summarize every 10 chunk analyses
      if (chunkAnalyses.length === 10 || i === chunks.length - 1) {
        const summary = await summarizeAnalyses(chunkAnalyses, query);
        finalSummaries.push(summary);
        chunkAnalyses = [];
            }
        }

    // Final summary of all summaries
    const result = await summarizeAnalyses(finalSummaries, query);

        await setCachedValue(cacheKey, result);

        return result;
    } catch (error) {
    console.error("Error in AI analysis:", error);
    throw new Error("Failed to analyze document: " + error.message);
    }
};

module.exports = { analyzeDocument };
