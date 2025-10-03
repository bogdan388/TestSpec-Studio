import { generateTestCases, generateAutomationSkeleton, generateMarkdown, generateCSV } from './utils/testGenerator.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { story, framework = 'playwright' } = JSON.parse(event.body)

    if (!story || !story.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Story is required' }),
      }
    }

    // Generate test cases using AI
    const manualTests = await generateTestCases(story)

    // Generate automation skeletons
    const automationSkeletons = generateAutomationSkeleton(manualTests, framework)

    // Generate export formats
    const markdown = generateMarkdown(manualTests)
    const csv = generateCSV(manualTests)

    const response = {
      manualTests,
      automationSkeletons,
      framework,
      exports: {
        markdown,
        csv,
        zipUrl: null, // Could be implemented with blob storage
      },
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
