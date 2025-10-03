# TestSpec Studio

Transform user stories and acceptance criteria into comprehensive test suites with AI-powered automation.

## Features

- **Manual Test Cases**: Generate step-by-step manual test cases with expected results
- **Automation Skeletons**: Create Playwright or Jest test skeletons ready for automation
- **Multiple Export Formats**: Download test cases as CSV, Markdown, or complete ZIP bundles
- **AI-Powered**: Leverages Google Gemini AI (FREE tier) for intelligent test generation

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Netlify Functions (Node.js)
- **AI Integration**: Google Gemini 1.5 Flash (Free API)
- **Hosting**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Account (for free Gemini API key)
- Netlify account (optional, for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TestSpec-Studio
```

2. Install dependencies:
```bash
npm install
cd netlify/functions && npm install && cd ../..
```

3. Get your FREE Gemini API key:
   - Visit https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

4. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

**Free Tier Benefits:**
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day
- Completely FREE forever!

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:4000`

**Note**: The app works WITHOUT an API key using smart mock data. Add the Gemini API key for AI-powered test generation.

For local Netlify functions testing:
```bash
npm run netlify:dev
```

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage

1. Navigate to the Workspace page
2. Paste your user story or acceptance criteria
3. Select your preferred automation framework (Playwright or Jest)
4. Click "Generate Test Suite"
5. Review generated test cases in the tabs:
   - **Manual Test Cases**: View all generated test scenarios
   - **Automation Skeletons**: See code templates for automation
   - **Preview Bundle**: Preview Markdown and CSV exports
6. Export your test suite:
   - **CSV**: Structured data for import into test management tools
   - **Markdown**: Human-readable documentation
   - **ZIP Bundle**: Complete package with all formats

## Project Structure

```
TestSpec-Studio/
├── src/
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── StoryInput.jsx
│   │   ├── ResultsTabs.jsx
│   │   ├── ManualCaseCard.jsx
│   │   ├── CodeBlock.jsx
│   │   └── ExportButtons.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   └── WorkspacePage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── netlify/
│   └── functions/
│       ├── generate-tests.js
│       ├── download.js
│       └── utils/
│           └── testGenerator.js
├── index.html
├── vite.config.js
├── tailwind.config.js
├── netlify.toml
└── package.json
```

## API Endpoints

### POST /generate-tests

Generates test cases and automation skeletons from a user story.

**Request:**
```json
{
  "story": "As a user, I want to login...",
  "framework": "playwright"
}
```

**Response:**
```json
{
  "manualTests": [...],
  "automationSkeletons": "...",
  "framework": "playwright",
  "exports": {
    "markdown": "...",
    "csv": "...",
    "zipUrl": null
  }
}
```

## Deployment

### Deploy to Netlify

1. Push your code to GitHub

2. Connect to Netlify:
   - Log in to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure build settings (auto-detected from `netlify.toml`)

3. Set environment variables in Netlify:
   - Go to Site settings → Environment variables
   - Add: `GEMINI_API_KEY` with your free Gemini API key

4. Deploy!

## Configuration

### Working Modes

1. **Mock Mode (No API Key)**:
   - The app generates intelligent mock test cases based on keywords in your user story
   - Detects login, password reset, and other common scenarios
   - Perfect for demos and testing the UI

2. **AI Mode (With Free Gemini API)**:
   - Get your FREE API key from https://makersuite.google.com/app/apikey
   - Add it to your `.env` file: `GEMINI_API_KEY=your_key`
   - Generates comprehensive, context-aware test cases using AI
   - Completely free with generous limits

## Future Enhancements

- Multi-framework support (Cypress, Selenium)
- User authentication and saved test suites
- Collaborative features
- Test history and version control
- Integration with test management tools
- Custom test templates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
