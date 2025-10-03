import { generateAutomationSkeleton, generateCucumber } from './utils/testGenerator.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { manualTests, framework } = JSON.parse(event.body)

    if (!manualTests || !Array.isArray(manualTests) || manualTests.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Manual tests array is required' }),
      }
    }

    if (!framework) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Framework is required' }),
      }
    }

    // Generate automation skeletons for the specified framework
    const automationSkeletons = generateAutomationSkeleton(manualTests, framework)
    const cucumber = generateCucumber(manualTests)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        automationSkeletons,
        cucumber,
        framework,
      }),
    }
  } catch (error) {
    console.error('Error regenerating automation:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to regenerate automation skeleton', details: error.message }),
    }
  }
}
