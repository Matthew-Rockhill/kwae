import { config } from 'dotenv';

config();

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

async function fetchFromImageKit(url) {
  const auth = Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ImageKit API error: ${response.status} ${error}`);
  }
  
  return response.json();
}

async function listAllFiles() {
  console.log('📋 Getting ALL files from ImageKit...\n');
  
  try {
    const allItems = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?limit=1000&searchQuery=path:"/portfolio/"`
    );
    
    const files = allItems.filter(item => item.type === 'file');
    
    console.log(`Found ${files.length} files in portfolio:`);
    console.log('='.repeat(80));
    
    files.forEach((file, i) => {
      console.log(`${i+1}. ${file.name}`);
      console.log(`   Path: ${file.filePath}`);
      console.log(`   ID: ${file.fileId}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

listAllFiles();