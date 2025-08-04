import { config } from 'dotenv';

// Load environment variables  
config();

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

async function fetchFromImageKit(url) {
  const auth = Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');
  
  console.log(`🔗 Fetching: ${url}`);
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

async function testSearchQuery() {
  console.log('🔍 Testing ImageKit searchQuery...\n');
  
  try {
    // Test the search query that the sync script uses
    console.log('1. Testing searchQuery=path:"/portfolio/"');
    const searchResults = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?limit=20&searchQuery=path:"/portfolio/"`
    );
    
    console.log(`Found ${searchResults.length} results:`);
    searchResults.forEach((item, i) => {
      console.log(`  ${i+1}. ${item.type}: ${item.name} (${item.filePath})`);
    });
    
    console.log('\n2. Testing regular path listing for comparison');
    const pathResults = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=/portfolio&limit=20`
    );
    
    console.log(`Found ${pathResults.length} results with path=/portfolio:`);
    pathResults.forEach((item, i) => {
      console.log(`  ${i+1}. ${item.type}: ${item.name} (${item.filePath || 'undefined'})`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSearchQuery();