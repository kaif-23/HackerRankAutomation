const OpenAIApi = require("openai");

async function openChatGPTAndInputText(page) {
    console.log('Opening ChatGPT API interaction...');

    // Read the copied text from the clipboard
    const copiedText = await page.evaluate(async () => {
        const text = await navigator.clipboard.readText();
        return text;
    }).catch((err) => {
        console.log('Error reading clipboard:', err);
        return '';
    });

    if (!copiedText) {
        console.log("No text copied to the clipboard.");
        return;
    }

    console.log('Copied text:', copiedText);

    // Initialize Configuration with API Key
   
    const client = new OpenAIApi.OpenAI({
        apiKey:'your-api-key', // Your OpenAI API key
    });

    // Initialize OpenAI API client with the configuration
    try {
        // Send a request to OpenAI API
        const response = await client.responses.create({
            model: "gpt-4", // or "gpt-4" if you want to use GPT-4
            input: copiedText,        // The text from the clipboard
            max_tokens: 100,           // Limit the response length
            temperature: 0.7,          // Control the creativity of the response
        });

        // Get the response text from OpenAI
        const gptResponse = response.data.choices[0].text.trim();
        console.log('GPT-3 Response:', gptResponse);

    } catch (error) {
        console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    }
}

module.exports = { openChatGPTAndInputText };
