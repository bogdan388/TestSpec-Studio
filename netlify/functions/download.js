import archiver from 'archiver'
import { Readable } from 'stream'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { csv, markdown, code, framework } = JSON.parse(
      event.queryStringParameters.data || '{}'
    )

    if (!csv || !markdown || !code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required data' }),
      }
    }

    // Create ZIP file
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })

    const chunks = []
    archive.on('data', (chunk) => chunks.push(chunk))

    // Add files to archive
    archive.append(csv, { name: 'test-cases.csv' })
    archive.append(markdown, { name: 'test-cases.md' })
    archive.append(code, { name: `test-automation.${framework === 'jest' ? 'test.js' : 'spec.js'}` })

    await archive.finalize()

    const buffer = Buffer.concat(chunks)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="test-suite.zip"',
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    }
  } catch (error) {
    console.error('Error creating ZIP:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create ZIP file', details: error.message }),
    }
  }
}
