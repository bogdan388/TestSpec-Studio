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
  const generators = {
    'playwright': generatePlaywrightSkeleton,
    'cypress': generateCypressSkeleton,
    'jest': generateJestSkeleton,
    'mocha': generateMochaSkeleton,
    'jasmine': generateJasmineSkeleton,
    'pytest': generatePytestSkeleton,
    'selenium-python': generateSeleniumPythonSkeleton,
    'selenium-java': generateSeleniumJavaSkeleton,
    'junit': generateJUnitSkeleton,
    'testng': generateTestNGSkeleton,
    'nunit': generateNUnitSkeleton,
    'xunit': generateXUnitSkeleton,
    'selenium-csharp': generateSeleniumCSharpSkeleton,
    'rspec': generateRSpecSkeleton,
    'capybara': generateCapybaraSkeleton,
    'rest-assured': generateRestAssuredSkeleton,
    'postman': generatePostmanSkeleton
  }

  const generator = generators[framework] || generatePlaywrightSkeleton
  return generator(testCases)
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

export function generateCucumber(testCases) {
  let feature = `Feature: Test Suite\n`
  feature += `  As a QA engineer\n`
  feature += `  I want to execute comprehensive test scenarios\n`
  feature += `  So that I can ensure the application works correctly\n\n`

  testCases.forEach((testCase) => {
    // Convert test title to scenario name
    feature += `  Scenario: ${testCase.title}\n`

    // Add steps with Gherkin keywords
    testCase.steps.forEach((step, index) => {
      let keyword = 'And'
      if (index === 0) {
        keyword = 'Given'
      } else if (index === testCase.steps.length - 1) {
        keyword = 'When'
      }
      feature += `    ${keyword} ${step}\n`
    })

    // Add expected result as Then statement
    feature += `    Then ${testCase.expected}\n\n`
  })

  return feature
}

// Additional framework generators

function generateCypressSkeleton(testCases) {
  let code = `describe('Test Suite', () => {\n\n`

  testCases.forEach((testCase) => {
    code += `  it('${testCase.title}', () => {\n`
    code += `    // Test ID: ${testCase.id}\n`
    testCase.steps.forEach((step, index) => {
      code += `    // Step ${index + 1}: ${step}\n`
    })
    code += `    // Expected: ${testCase.expected}\n\n`
    code += `    cy.visit('YOUR_URL_HERE');\n`
    code += `    // Add your test implementation here\n`
    code += `  });\n\n`
  })

  code += `});\n`
  return code
}

function generateMochaSkeleton(testCases) {
  let code = `const { expect } = require('chai');\n\n`
  code += `describe('Test Suite', function() {\n\n`

  testCases.forEach((testCase) => {
    code += `  it('${testCase.title}', function() {\n`
    code += `    // Test ID: ${testCase.id}\n`
    testCase.steps.forEach((step, index) => {
      code += `    // Step ${index + 1}: ${step}\n`
    })
    code += `    // Expected: ${testCase.expected}\n\n`
    code += `    // TODO: Implement test steps\n`
    code += `  });\n\n`
  })

  code += `});\n`
  return code
}

function generateJasmineSkeleton(testCases) {
  let code = `describe('Test Suite', () => {\n\n`

  testCases.forEach((testCase) => {
    code += `  it('${testCase.title}', () => {\n`
    code += `    // Test ID: ${testCase.id}\n`
    testCase.steps.forEach((step, index) => {
      code += `    // Step ${index + 1}: ${step}\n`
    })
    code += `    // Expected: ${testCase.expected}\n\n`
    code += `    // TODO: Implement test steps\n`
    code += `    // expect(result).toBe(expected);\n`
    code += `  });\n\n`
  })

  code += `});\n`
  return code
}

function generatePytestSkeleton(testCases) {
  let code = `import pytest\n\n`
  code += `class TestSuite:\n`

  testCases.forEach((testCase) => {
    const methodName = testCase.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')
    code += `    def test_${methodName}(self):\n`
    code += `        """\n`
    code += `        Test ID: ${testCase.id}\n`
    code += `        ${testCase.title}\n\n`
    testCase.steps.forEach((step, index) => {
      code += `        Step ${index + 1}: ${step}\n`
    })
    code += `        Expected: ${testCase.expected}\n`
    code += `        """\n`
    code += `        # TODO: Implement test steps\n`
    code += `        pass\n\n`
  })

  return code
}

function generateSeleniumPythonSkeleton(testCases) {
  let code = `import pytest\n`
  code += `from selenium import webdriver\n`
  code += `from selenium.webdriver.common.by import By\n`
  code += `from selenium.webdriver.support.ui import WebDriverWait\n`
  code += `from selenium.webdriver.support import expected_conditions as EC\n\n`
  code += `class TestSuite:\n`
  code += `    @pytest.fixture(autouse=True)\n`
  code += `    def setup(self):\n`
  code += `        self.driver = webdriver.Chrome()\n`
  code += `        self.driver.implicitly_wait(10)\n`
  code += `        yield\n`
  code += `        self.driver.quit()\n\n`

  testCases.forEach((testCase) => {
    const methodName = testCase.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')
    code += `    def test_${methodName}(self):\n`
    code += `        """\n`
    code += `        Test ID: ${testCase.id}\n`
    code += `        ${testCase.title}\n`
    code += `        """\n`
    testCase.steps.forEach((step, index) => {
      code += `        # Step ${index + 1}: ${step}\n`
    })
    code += `        # Expected: ${testCase.expected}\n\n`
    code += `        self.driver.get("YOUR_URL_HERE")\n`
    code += `        # TODO: Implement test steps\n`
    code += `        pass\n\n`
  })

  return code
}

function generateSeleniumJavaSkeleton(testCases) {
  let code = `import org.junit.jupiter.api.*;\n`
  code += `import org.openqa.selenium.WebDriver;\n`
  code += `import org.openqa.selenium.chrome.ChromeDriver;\n`
  code += `import static org.junit.jupiter.api.Assertions.*;\n\n`
  code += `public class TestSuite {\n`
  code += `    private WebDriver driver;\n\n`
  code += `    @BeforeEach\n`
  code += `    public void setUp() {\n`
  code += `        driver = new ChromeDriver();\n`
  code += `        driver.manage().timeouts().implicitlyWait(10, java.util.concurrent.TimeUnit.SECONDS);\n`
  code += `    }\n\n`
  code += `    @AfterEach\n`
  code += `    public void tearDown() {\n`
  code += `        if (driver != null) {\n`
  code += `            driver.quit();\n`
  code += `        }\n`
  code += `    }\n\n`

  testCases.forEach((testCase) => {
    const methodName = testCase.title.replace(/[^a-zA-Z0-9]+/g, '')
    code += `    @Test\n`
    code += `    public void test${methodName}() {\n`
    code += `        // Test ID: ${testCase.id}\n`
    code += `        // ${testCase.title}\n`
    testCase.steps.forEach((step, index) => {
      code += `        // Step ${index + 1}: ${step}\n`
    })
    code += `        // Expected: ${testCase.expected}\n\n`
    code += `        driver.get("YOUR_URL_HERE");\n`
    code += `        // TODO: Implement test steps\n`
    code += `    }\n\n`
  })

  code += `}\n`
  return code
}

function generateJUnitSkeleton(testCases) {
  let code = `import org.junit.jupiter.api.*;\n`
  code += `import static org.junit.jupiter.api.Assertions.*;\n\n`
  code += `public class TestSuite {\n\n`

  testCases.forEach((testCase) => {
    const methodName = testCase.title.replace(/[^a-zA-Z0-9]+/g, '')
    code += `    @Test\n`
    code += `    @DisplayName("${testCase.title}")\n`
    code += `    public void test${methodName}() {\n`
    code += `        // Test ID: ${testCase.id}\n`
    testCase.steps.forEach((step, index) => {
      code += `        // Step ${index + 1}: ${step}\n`
    })
    code += `        // Expected: ${testCase.expected}\n\n`
    code += `        // TODO: Implement test steps\n`
    code += `    }\n\n`
  })

  code += `}\n`
  return code
}

function generateTestNGSkeleton(testCases) {
  let code = `import org.testng.annotations.*;\n`
  code += `import static org.testng.Assert.*;\n\n`
  code += `public class TestSuite {\n\n`

  testCases.forEach((testCase) => {
    const methodName = testCase.title.replace(/[^a-zA-Z0-9]+/g, '')
    code += `    @Test(description = "${testCase.title}")\n`
    code += `    public void test${methodName}() {\n`
    code += `        // Test ID: ${testCase.id}\n`
    testCase.steps.forEach((step, index) => {
      code += `        // Step ${index + 1}: ${step}\n`
    })
    code += `        // Expected: ${testCase.expected}\n\n`
    code += `        // TODO: Implement test steps\n`
    code += `    }\n\n`
  })

  code += `}\n`
  return code
}

function generateNUnitSkeleton(testCases) {
  let code = `using NUnit.Framework;\n\n`
  code += `namespace TestSuite\n{\n`
  code += `    [TestFixture]\n`
  code += `    public class Tests\n    {\n\n`

  testCases.forEach((testCase) => {
    const methodName = testCase.title.replace(/[^a-zA-Z0-9]+/g, '')
    code += `        [Test]\n`
    code += `        [Description("${testCase.title}")]\n`
    code += `        public void Test${methodName}()\n        {\n`
    code += `            // Test ID: ${testCase.id}\n`
    testCase.steps.forEach((step, index) => {
      code += `            // Step ${index + 1}: ${step}\n`
    })
    code += `            // Expected: ${testCase.expected}\n\n`
    code += `            // TODO: Implement test steps\n`
    code += `        }\n\n`
  })

  code += `    }\n}\n`
  return code
}

function generateXUnitSkeleton(testCases) {
  let code = `using Xunit;\n\n`
  code += `namespace TestSuite\n{\n`
  code += `    public class Tests\n    {\n\n`

  testCases.forEach((testCase) => {
    const methodName = testCase.title.replace(/[^a-zA-Z0-9]+/g, '')
    code += `        [Fact]\n`
    code += `        public void Test${methodName}()\n        {\n`
    code += `            // Test ID: ${testCase.id}\n`
    code += `            // ${testCase.title}\n`
    testCase.steps.forEach((step, index) => {
      code += `            // Step ${index + 1}: ${step}\n`
    })
    code += `            // Expected: ${testCase.expected}\n\n`
    code += `            // TODO: Implement test steps\n`
    code += `        }\n\n`
  })

  code += `    }\n}\n`
  return code
}

function generateSeleniumCSharpSkeleton(testCases) {
  let code = `using OpenQA.Selenium;\n`
  code += `using OpenQA.Selenium.Chrome;\n`
  code += `using NUnit.Framework;\n\n`
  code += `namespace TestSuite\n{\n`
  code += `    [TestFixture]\n`
  code += `    public class Tests\n    {\n`
  code += `        private IWebDriver driver;\n\n`
  code += `        [SetUp]\n`
  code += `        public void Setup()\n        {\n`
  code += `            driver = new ChromeDriver();\n`
  code += `            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);\n`
  code += `        }\n\n`
  code += `        [TearDown]\n`
  code += `        public void Teardown()\n        {\n`
  code += `            driver?.Quit();\n`
  code += `        }\n\n`

  testCases.forEach((testCase) => {
    const methodName = testCase.title.replace(/[^a-zA-Z0-9]+/g, '')
    code += `        [Test]\n`
    code += `        public void Test${methodName}()\n        {\n`
    code += `            // Test ID: ${testCase.id}\n`
    code += `            // ${testCase.title}\n`
    testCase.steps.forEach((step, index) => {
      code += `            // Step ${index + 1}: ${step}\n`
    })
    code += `            // Expected: ${testCase.expected}\n\n`
    code += `            driver.Navigate().GoToUrl("YOUR_URL_HERE");\n`
    code += `            // TODO: Implement test steps\n`
    code += `        }\n\n`
  })

  code += `    }\n}\n`
  return code
}

function generateRestAssuredSkeleton(testCases) {
  let code = `import io.restassured.RestAssured;\n`
  code += `import io.restassured.response.Response;\n`
  code += `import org.junit.jupiter.api.Test;\n`
  code += `import static io.restassured.RestAssured.*;\n`
  code += `import static org.hamcrest.Matchers.*;\n\n`
  code += `public class APITestSuite {\n\n`
  code += `    static {\n`
  code += `        RestAssured.baseURI = "YOUR_API_BASE_URL";\n`
  code += `    }\n\n`

  testCases.forEach((testCase) => {
    const methodName = testCase.title.replace(/[^a-zA-Z0-9]+/g, '')
    code += `    @Test\n`
    code += `    public void test${methodName}() {\n`
    code += `        // Test ID: ${testCase.id}\n`
    code += `        // ${testCase.title}\n`
    testCase.steps.forEach((step, index) => {
      code += `        // Step ${index + 1}: ${step}\n`
    })
    code += `        // Expected: ${testCase.expected}\n\n`
    code += `        given()\n`
    code += `            .contentType("application/json")\n`
    code += `        .when()\n`
    code += `            .get("/endpoint")\n`
    code += `        .then()\n`
    code += `            .statusCode(200);\n`
    code += `        // TODO: Add assertions\n`
    code += `    }\n\n`
  })

  code += `}\n`
  return code
}

function generatePostmanSkeleton(testCases) {
  const collection = {
    info: {
      name: "Test Suite",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: testCases.map(testCase => ({
      name: testCase.title,
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/endpoint",
          host: ["{{baseUrl}}"],
          path: ["endpoint"]
        },
        description: `Test ID: ${testCase.id}\n\nSteps:\n${testCase.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nExpected: ${testCase.expected}`
      },
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "// Test ID: " + testCase.id,
              "pm.test(\"" + testCase.title + "\", function () {",
              "    pm.response.to.have.status(200);",
              "    // TODO: Add your test assertions here",
              "});"
            ],
            type: "text/javascript"
          }
        }
      ]
    }))
  }

  return JSON.stringify(collection, null, 2)
}

function generateRSpecSkeleton(testCases) {
  let code = `require 'spec_helper'\n\n`
  code += `RSpec.describe 'Test Suite' do\n\n`

  testCases.forEach((testCase) => {
    const testName = testCase.title
    code += `  it '${testName}' do\n`
    code += `    # Test ID: ${testCase.id}\n`
    testCase.steps.forEach((step, index) => {
      code += `    # Step ${index + 1}: ${step}\n`
    })
    code += `    # Expected: ${testCase.expected}\n\n`
    code += `    # TODO: Implement test steps\n`
    code += `  end\n\n`
  })

  code += `end\n`
  return code
}

function generateCapybaraSkeleton(testCases) {
  let code = `require 'spec_helper'\n`
  code += `require 'capybara/rspec'\n\n`
  code += `RSpec.describe 'Test Suite', type: :feature do\n\n`

  testCases.forEach((testCase) => {
    const testName = testCase.title
    code += `  scenario '${testName}' do\n`
    code += `    # Test ID: ${testCase.id}\n`
    testCase.steps.forEach((step, index) => {
      code += `    # Step ${index + 1}: ${step}\n`
    })
    code += `    # Expected: ${testCase.expected}\n\n`
    code += `    visit 'YOUR_URL_HERE'\n`
    code += `    # TODO: Implement test steps\n`
    code += `    # Example: fill_in 'Username', with: 'testuser'\n`
    code += `    # Example: click_button 'Submit'\n`
    code += `    # Example: expect(page).to have_content('Success')\n`
    code += `  end\n\n`
  })

  code += `end\n`
  return code
}
