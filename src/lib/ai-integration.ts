import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error('GROQ_API_KEY is required in environment variables');
}

const groq = new Groq({
  apiKey: apiKey,
});

export interface AIResponse {
  filename: string;
  htmlContent: string;
  aiResponse: any;
}

export async function generateHTMLWithFilename(userRequest: string): Promise<AIResponse> {
  try {
    const prompt = `Based on this request: "${userRequest}", you need to:
    1. Generate a creative and descriptive filename (without .html extension)
    2. Create a complete HTML file with proper HTML5 structure, CSS styling, and JavaScript if needed
    
    Respond with a JSON object in exactly this format:
    {
      "filename": "your-creative-filename",
      "htmlContent": "<!DOCTYPE html>\\n<html>\\n... your complete HTML code here ..."
    }
    
    Make the filename descriptive and relevant to the content. Make the HTML visually appealing and functional.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "moonshotai/kimi-k2-instruct",
      temperature: 0.7,
      max_completion_tokens: 4096,
      top_p: 1,
      stream: false,
      stop: null
    });
    
    const aiResponseContent = chatCompletion.choices[0]?.message?.content || '';
    
    try {
      const parsedResponse = JSON.parse(aiResponseContent);
      return {
        filename: parsedResponse.filename,
        htmlContent: parsedResponse.htmlContent,
        aiResponse: chatCompletion
      };
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('AI did not return valid JSON format');
    }
    
  } catch (error) {
    console.error('Error generating HTML with filename:', error);
    throw error;
  }
}

// Web-specific utility functions can be added here as needed