import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const languageMap = {
  en: 'English',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  it: 'Italian',
  tr: 'Turkish',
  ru: 'Russian',
};

const callOpenAI = async (
  systemMessage,
  userMessage,
  temperature = 0.7,
  model = 'llama3-70b-8192',
) => {
  try {
    const response = await openai.chat.completions.create({
      model,
      temperature,
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API call error:', error);
    throw new Error('Failed to call OpenAI API.');
  }
};

export const translateText = async (text, targetLocale) => {
  try {
    const targetLanguage = languageMap[targetLocale] || 'English';

    const systemMessage = 'You are a skilled translator and copywriter.';
    const userMessage = `
      Translate the following text into ${targetLanguage} while preserving any Markdown formatting. Ensure that names, addresses, locations, and emails remain untranslated.
      Return only the translated text and nothing else like "Here is the translated text in Turkish, preserving Markdown formatting:") :

      ${text}
    `;

    const translatedText = await callOpenAI(systemMessage, userMessage);
    return translatedText.trim();
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text.');
  }
};

export const generateFarmDescription = async (
  description,
  pageContent,
  locale,
) => {
  try {
    const language = languageMap[locale] || 'English';

    const systemMessage =
      'You are a skilled translator and copywriter specializing in agritourism and farming.';
    const userMessage = `
      Read the original description and the website content in original language, then:
      1. Write a full long description of the farm in ${language} to be more engaging for potential agritourists and visitors who would like to visit the farm and buy products.
      The description should be longer than 3000 characters and should contain several paragraphs with engaging headlines.
      2. Extract valuable information from the webpage and format it as JSON.
      3. Create a short meta-description of no more than 150 characters.

      Use proper Markdown formatting for the full description, including:
      - Headline levels for different sections (e.g., # for main headings, ## for subheadings)
      - Bullet points or numbered lists where appropriate
      - Bold or italic text to emphasize important points
      - Links for any references or important websites

      Ensure the JSON contains the following fields:
      {
        "rewrittenDescription": "Markdown formatted full description",
        "metaDescription": "Short meta-description (max 150 characters)",
        "valuableData": {
          "name": "name",
          "phone": "phone",
          "email": "email",
          "address": "address"
        }
      }

      Ensure that description has to be in ${language} but the name/title of the farm, locations, address, names of people, and emails stay untranslated (as they are in the original text).
      Return only the JSON object without any additional text, comments, or characters.
      Newlines have to be replaced with '\\n' symbol.
      Do not include any explanations, notes, or comments like - // no email provided.
      All values should be properly quoted strings.
      Do not include any empty fields or fields with empty values.
      Ensure the JSON string is properly escaped.
      Example of a correctly escaped string:
      {"rewrittenDescription": "Example with a newline\\nAnother line"}

      Original description: ${description || 'N/A'}

      ${pageContent ? `Website content: ${pageContent}` : ''}
    `;

    const result = await callOpenAI(systemMessage, userMessage);

    // Extract JSON part only
    const jsonStartIndex = result.indexOf('{');
    const jsonEndIndex = result.lastIndexOf('}') + 1;
    const jsonString = result.substring(jsonStartIndex, jsonEndIndex);

    // Validate and parse the JSON output
    let jsonResult;
    try {
      jsonResult = JSON.parse(jsonString);
    } catch (e) {
      throw new Error('The response is not valid JSON: ' + jsonString);
    }

    return jsonResult;
  } catch (error) {
    console.error('Error generating farm description:', error);
    throw new Error('Failed to generate farm description.');
  }
};
