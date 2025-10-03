import { GoogleGenerativeAI } from '@google/generative-ai'

// AI Integration for generating test cases
export async function generateTestCases(story) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.log('No API key found, using mock data')
    return generateMockTestCases(story)
  }

  try {
    return await generateWithGemini(story, apiKey)
  } catch (error) {
    console.error('AI generation failed, using mock data:', error)
    return generateMockTestCases(story)
  }
}

async function generateWithGemini(story, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const prompt = `You are a QA engineer. Given the following user story or acceptance criteria, generate comprehensive test cases.

User Story:
${story}

Generate test cases in the following JSON format (respond ONLY with valid JSON, no markdown or other text):
[
  {
    "id": 1,
    "title": "Test case title",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "expected": "Expected result"
  }
]

Include both positive and negative test cases. Be comprehensive and cover edge cases. Return ONLY the JSON array, nothing else.`

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

function generateMockTestCases(story) {
  // Analyze story to create more relevant mock cases
  const storyLower = story.toLowerCase()

  if (storyLower.includes('login') || storyLower.includes('sign in')) {
    return [
      {
        id: 1,
        title: 'Successful login with valid credentials',
        steps: [
          'Navigate to the login page',
          'Enter valid username',
          'Enter valid password',
          'Click login button',
        ],
        expected: 'User is successfully logged in and redirected to dashboard',
      },
      {
        id: 2,
        title: 'Login failure with invalid credentials',
        steps: [
          'Navigate to the login page',
          'Enter invalid username or password',
          'Click login button',
        ],
        expected: 'Error message is displayed: "Invalid credentials"',
      },
      {
        id: 3,
        title: 'Login with empty fields',
        steps: [
          'Navigate to the login page',
          'Leave username and password fields empty',
          'Click login button',
        ],
        expected: 'Validation error messages are displayed for required fields',
      },
      {
        id: 4,
        title: 'Password visibility toggle',
        steps: [
          'Navigate to the login page',
          'Enter password',
          'Click show/hide password icon',
        ],
        expected: 'Password is toggled between visible and masked',
      },
    ]
  }

  if (storyLower.includes('reset') || storyLower.includes('password')) {
    return [
      {
        id: 1,
        title: 'Successful password reset with valid email',
        steps: [
          'Navigate to forgot password page',
          'Enter registered email address',
          'Click send reset link button',
        ],
        expected: 'Success message displayed and reset email sent',
      },
      {
        id: 2,
        title: 'Password reset with unregistered email',
        steps: [
          'Navigate to forgot password page',
          'Enter unregistered email address',
          'Click send reset link button',
        ],
        expected: 'Error message: "Email not found"',
      },
      {
        id: 3,
        title: 'Password reset with invalid email format',
        steps: [
          'Navigate to forgot password page',
          'Enter invalid email format',
          'Click send reset link button',
        ],
        expected: 'Validation error: "Please enter a valid email"',
      },
    ]
  }

  // Generic test cases for any other story
  return [
    {
      id: 1,
      title: 'Successful operation with valid inputs',
      steps: [
        'Navigate to the feature page',
        'Enter valid data in all required fields',
        'Submit the form',
      ],
      expected: 'Operation completes successfully with confirmation message',
    },
    {
      id: 2,
      title: 'Error handling with invalid inputs',
      steps: [
        'Navigate to the feature page',
        'Enter invalid data in required fields',
        'Attempt to submit the form',
      ],
      expected: 'Error message is displayed indicating invalid input',
    },
    {
      id: 3,
      title: 'Required field validation',
      steps: [
        'Navigate to the feature page',
        'Leave required fields empty',
        'Attempt to submit the form',
      ],
      expected: 'Validation errors displayed for all required fields',
    },
    {
      id: 4,
      title: 'Boundary condition test',
      steps: [
        'Navigate to the feature page',
        'Enter data at boundary limits (min/max values)',
        'Submit the form',
      ],
      expected: 'System handles boundary values correctly without errors',
    },
    {
      id: 5,
      title: 'Cancel/Back functionality',
      steps: [
        'Navigate to the feature page',
        'Enter some data',
        'Click cancel or back button',
      ],
      expected: 'User is returned to previous page without saving changes',
    },
  ]
}

export function generateAutomationSkeleton(testCases, framework) {
  if (framework === 'playwright') {
    return generatePlaywrightSkeleton(testCases)
  } else {
    return generateJestSkeleton(testCases)
  }
}

function generatePlaywrightSkeleton(testCases) {
  let code = `import { test, expect } from '@playwright/test';\n\n`

  testCases.forEach((testCase) => {
    const testName = testCase.title
    code += `test('${testName}', async ({ page }) => {\n`
    code += `  // Test ID: ${testCase.id}\n`
    testCase.steps.forEach((step, index) => {
      code += `  // Step ${index + 1}: ${step}\n`
    })
    code += `  // Expected: ${testCase.expected}\n\n`
    code += `  // TODO: Implement test steps\n`
    code += `  await page.goto('YOUR_URL_HERE');\n`
    code += `  // Add your test implementation here\n`
    code += `});\n\n`
  })

  return code
}

function generateJestSkeleton(testCases) {
  let code = `describe('Test Suite', () => {\n\n`

  testCases.forEach((testCase) => {
    const testName = testCase.title
    code += `  test('${testName}', () => {\n`
    code += `    // Test ID: ${testCase.id}\n`
    testCase.steps.forEach((step, index) => {
      code += `    // Step ${index + 1}: ${step}\n`
    })
    code += `    // Expected: ${testCase.expected}\n\n`
    code += `    // TODO: Implement test steps\n`
    code += `    // Add your test implementation here\n`
    code += `  });\n\n`
  })

  code += `});\n`

  return code
}

export function generateMarkdown(testCases) {
  let markdown = `# Test Cases\n\n`
  markdown += `Generated on: ${new Date().toISOString()}\n\n`

  testCases.forEach((testCase) => {
    markdown += `## ${testCase.id}. ${testCase.title}\n\n`
    markdown += `### Steps\n\n`
    testCase.steps.forEach((step, index) => {
      markdown += `${index + 1}. ${step}\n`
    })
    markdown += `\n### Expected Result\n\n`
    markdown += `${testCase.expected}\n\n`
    markdown += `---\n\n`
  })

  return markdown
}

export function generateCSV(testCases) {
  let csv = 'ID,Title,Steps,Expected Result\n'

  testCases.forEach((testCase) => {
    const steps = testCase.steps.join(' | ')
    const title = testCase.title.replace(/"/g, '""')
    const stepsEscaped = steps.replace(/"/g, '""')
    const expected = testCase.expected.replace(/"/g, '""')

    csv += `${testCase.id},"${title}","${stepsEscaped}","${expected}"\n`
  })

  return csv
}
