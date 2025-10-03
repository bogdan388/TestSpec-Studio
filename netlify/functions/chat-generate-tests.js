import { GoogleGenerativeAI } from '@google/generative-ai'
import { generateAutomationSkeleton, generateMarkdown, generateCSV, generateCucumber } from './utils/testGenerator.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { messages, framework = 'playwright' } = JSON.parse(event.body)

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Messages array is required' }),
      }
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'AI API key not configured' }),
      }
    }

    // Generate test cases using conversation context
    const manualTests = await generateTestCasesFromChat(messages, apiKey)

    // Generate automation skeletons
    const automationSkeletons = generateAutomationSkeleton(manualTests, framework)

    // Generate export formats
    const markdown = generateMarkdown(manualTests)
    const csv = generateCSV(manualTests)
    const cucumber = generateCucumber(manualTests)

    const response = {
      manualTests,
      automationSkeletons,
      cucumber,
      framework,
      exports: {
        markdown,
        csv,
        cucumber,
        zipUrl: null,
      },
      message: getAssistantMessage(manualTests)
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    }
  } catch (error) {
    console.error('Error generating tests:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate tests', details: error.message }),
    }
  }
}

async function generateTestCasesFromChat(messages, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  // Build conversation history
  const conversationHistory = messages.map(msg => {
    if (msg.role === 'user') {
      return `User: ${msg.content}`
    } else {
      return `Assistant: ${msg.content}`
    }
  }).join('\n\n')

  const prompt = `You are an expert QA engineer helping create comprehensive test cases.

Conversation history:
${conversationHistory}

Based on the entire conversation above, generate updated test cases that incorporate all requirements and changes discussed.

Generate test cases in the following JSON format (respond ONLY with valid JSON, no markdown or other text):
[
  {
    "id": 1,
    "title": "Test case title",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "expected": "Expected result"
  }
]

Important guidelines:
- Include both positive and negative test cases
- Cover edge cases and boundary conditions
- Be comprehensive and detailed
- Number test cases sequentially starting from 1
- Incorporate ALL feedback and changes from the conversation
- If the user asks to modify specific tests, update those while keeping others intact
- If the user asks to add tests, add them to the existing list
- Return ONLY the JSON array, nothing else`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/m)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }

  throw new Error('Failed to parse AI response')
}

function getAssistantMessage(testCases) {
  const count = testCases.length
  return `I've generated ${count} comprehensive test case${count !== 1 ? 's' : ''} for you. Feel free to ask me to:
• Add more test cases for specific scenarios
• Make tests more detailed or specific
• Add edge cases or negative tests
• Modify any existing test cases
• Focus on particular aspects of the functionality`
}
