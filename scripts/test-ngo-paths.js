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

async function testNGOPaths() {
  console.log('🔍 Testing NGO Storytelling paths...\n');
  
  try {
    // Get files from NGO Storytelling using the same query as sync script
    const allItems = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?limit=1000&searchQuery=path:"/portfolio/"`
    );
    
    // Filter for NGO Storytelling files
    const ngoFiles = allItems.filter(item => 
      item.type === 'file' && 
      item.filePath.includes('/portfolio/NGO Storytelling/')
    );
    
    console.log(`Found ${ngoFiles.length} NGO Storytelling files:`);
    
    ngoFiles.slice(0, 10).forEach(file => {
      const pathParts = file.filePath.split('/').filter(Boolean);
      console.log(`  Path: ${file.filePath}`);
      console.log(`  Parts: [${pathParts.join(', ')}]`);
      console.log(`  Length: ${pathParts.length}`);
      
      if (pathParts.length > 3) {
        console.log(`  → Subcategory would be: "${pathParts[2]}"`);
      } else {
        console.log(`  → No subcategory (root level)`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNGOPaths();