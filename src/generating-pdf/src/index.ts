import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { config } from './config'
import { EventRequestBody } from './interface'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const puppeteer = require('puppeteer-core')
const chromium = require('@sparticuz/chromium')

// Initialize the AWS S3 SDK
const s3Client = new S3Client({ region: config.aws.region })

export const handler = async (event: any) => {
  // Placeholder for S3 bucket name
  const bucketName = 'YOUR_S3_BUCKET_NAME'

  try {
    const requestBody: EventRequestBody = JSON.parse(event.body)

    // Validate request body
    if (!requestBody?.html?.length) {
      throw new Error('Invalid Request Body!')
    }

    // Launch a headless Chrome browser using puppeteer
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      // ignoreHTTPSErrors: true,
    })

    console.log('Chromium:', await browser.version())

    // Open a new tab in the browser
    const page = await browser.newPage()

    // Set the HTML content
    await page.setContent(requestBody.html)

    // Generate PDF
    const buffer = await page.pdf({
      format: 'A4',
      margin: { bottom: '50px', top: '50px', left: '50px', right: '50px' },
    })

    // Close the browser
    await page.close()
    await browser.close()

    // Upload the pdf files to the S3 bucket
    const s3Key = `${new Date().getTime()}-${(Math.random() + 1)
      .toString(36)
      .substring(7)}.pdf`

    const params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: buffer,
      ContentType: 'application/pdf',
    }

    await s3Client.send(new PutObjectCommand(params))

    // Get S3 URL to download
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      }),
      { expiresIn: 3600 }
    )

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ url }),
    }
  } catch (error: any) {
    console.log('🚀 >>>>>>> error:', error)

    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ message: error.message }),
    }
  }
}
