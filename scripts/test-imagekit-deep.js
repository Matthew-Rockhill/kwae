import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

async function fetchFromImageKit(url) {
  const auth = Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');
  
  console.log(`  Calling: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  
  console.log(`  Response status: ${response.status}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ImageKit API error: ${response.status} ${error}`);
  }
  
  return response.json();
}

async function testImageKitAccess() {
  console.log('🔍 Deep testing ImageKit access...\n');

  try {
    // 1. Test basic API access
    console.log('1️⃣ Testing basic API access...');
    try {
      const testResponse = await fetchFromImageKit(
        `https://api.imagekit.io/v1/files?limit=1`
      );
      console.log(`  ✅ API access working. Found ${testResponse.length} items\n`);
    } catch (error) {
      console.log(`  ❌ API access failed: ${error.message}\n`);
      return;
    }

    // 2. List files at root level
    console.log('2️⃣ Listing files at root level (no path specified)...');
    const rootFiles = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?limit=10`
    );
    console.log(`  Found ${rootFiles.length} items at root`);
    if (rootFiles.length > 0) {
      rootFiles.forEach(item => {
        console.log(`    - ${item.type}: ${item.name} (path: ${item.filePath})`);
      });
    }
    console.log('');

    // 3. Try without leading slash
    console.log('3️⃣ Testing portfolio folder without leading slash...');
    const portfolioNoSlash = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=portfolio`
    );
    console.log(`  Found ${portfolioNoSlash.length} items\n`);

    // 4. Try with leading slash
    console.log('4️⃣ Testing portfolio folder with leading slash...');
    const portfolioWithSlash = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=/portfolio`
    );
    console.log(`  Found ${portfolioWithSlash.length} items\n`);

    // 5. Get folder structure using folders endpoint
    console.log('5️⃣ Getting folder structure (type=folder)...');
    const folders = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?type=folder&limit=20`
    );
    console.log(`  Found ${folders.length} folders total:`);
    folders.forEach(folder => {
      console.log(`    - ${folder.name} (path: ${folder.filePath || 'undefined'})`);
    });
    console.log('');

    // 6. Check specific paths from the folder list
    const portfolioFolder = folders.find(f => f.name === 'portfolio' || f.name === 'Portfolio');
    if (portfolioFolder) {
      console.log(`6️⃣ Found portfolio folder: ${portfolioFolder.name} at ${portfolioFolder.filePath}`);
      console.log('  Testing access to this specific path...');
      
      const pathToTest = portfolioFolder.filePath || portfolioFolder.name;
      const portfolioContents = await fetchFromImageKit(
        `https://api.imagekit.io/v1/files?path=${pathToTest}`
      );
      console.log(`  Found ${portfolioContents.length} items in portfolio`);
      
      if (portfolioContents.length > 0) {
        const subfolders = portfolioContents.filter(item => item.type === 'folder');
        const files = portfolioContents.filter(item => item.type === 'file');
        
        console.log(`    - ${subfolders.length} subfolders`);
        console.log(`    - ${files.length} files`);
        
        if (subfolders.length > 0) {
          console.log('    Subfolders:');
          subfolders.forEach(folder => {
            console.log(`      * ${folder.name} (${folder.filePath})`);
          });
        }
      }
    }

    // 7. Try searching without path constraint
    console.log('\n7️⃣ Searching globally for "portfolio" (no path constraint)...');
    try {
      const searchUrl = `https://api.imagekit.io/v1/files?name=portfolio`;
      const searchResults = await fetchFromImageKit(searchUrl);
      console.log(`  Found ${searchResults.length} items with "portfolio" in name`);
      if (searchResults.length > 0) {
        searchResults.slice(0, 5).forEach(item => {
          console.log(`    - ${item.type}: ${item.name} (${item.filePath})`);
        });
      }
    } catch (error) {
      console.log(`  Search failed: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testImageKitAccess();