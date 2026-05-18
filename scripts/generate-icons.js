import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const inputIcon = path.join(__dirname, '../public/logo.png')
const outputDir = path.join(__dirname, '../public/icons')

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function generateIcons() {
  console.log('🎨 Generating app icons...\n')
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`)
    
    await sharp(inputIcon)
      .resize(size, size)
      .png()
      .toFile(outputPath)
    
    console.log(`✅ Generated ${size}x${size} icon`)
  }
  
  // Generate apple touch icon
  await sharp(inputIcon)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/apple-touch-icon.png'))
  
  console.log('✅ Generated apple-touch-icon.png')
  
  // Generate favicon
  await sharp(inputIcon)
    .resize(64, 64)
    .png()
    .toFile(path.join(__dirname, '../public/favicon.png'))
  
  console.log('✅ Generated favicon.png')
  console.log('\n🎉 All icons generated successfully!')
}

generateIcons().catch(console.error)