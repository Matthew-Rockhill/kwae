import { config } from 'dotenv';

// Load environment variables
config();

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const PORTFOLIO_ROOT = 'portfolio';

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

async function debugImageKitStructure() {
  console.log('🔍 Debugging ImageKit folder structure...\n');
  
  try {
    // 1. Check what's in the root portfolio folder
    console.log('📁 Checking /portfolio folder contents...');
    const portfolioContents = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=/${PORTFOLIO_ROOT}`
    );
    
    console.log(`Found ${portfolioContents.length} items in /portfolio:`);
    portfolioContents.forEach(item => {
      console.log(`  - ${item.type}: ${item.name} (path: ${item.filePath})`);
    });
    
    // 2. Check for folders specifically
    console.log('\n📂 Checking for folders only...');
    const folders = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=/${PORTFOLIO_ROOT}&type=folder`
    );
    
    console.log(`Found ${folders.length} folders:`);
    folders.forEach(folder => {
      console.log(`  - ${folder.name} (${folder.filePath})`);
    });
    
    // 3. Check if there are any items at the root level of ImageKit
    console.log('\n🔍 Checking ImageKit root directory...');
    const rootContents = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=/&limit=20`
    );
    
    console.log(`Found ${rootContents.length} items in root:`);
    rootContents.forEach(item => {
      console.log(`  - ${item.type}: ${item.name} (path: ${item.filePath})`);
      
      // If it's a folder that looks like it could contain portfolio content
      if (item.type === 'folder' && (
        item.name.toLowerCase().includes('portfolio') ||
        item.name.toLowerCase().includes('photo') ||
        item.name.toLowerCase().includes('image')
      )) {
        console.log(`    ⭐ This might be a portfolio folder!`);
      }
    });
    
    // 4. Search for any files with "portfolio" in the path
    console.log('\n🔎 Searching for all items with "portfolio" in path...');
    try {
      const searchResults = await fetchFromImageKit(
        `https://api.imagekit.io/v1/files?searchQuery=filePath:"portfolio"&limit=50`
      );
      
      console.log(`Search found ${searchResults.length} items:`);
      
      // Group by folder path to see the structure
      const folderStructure = {};
      searchResults.forEach(item => {
        const pathParts = item.filePath.split('/');
        const folderPath = pathParts.slice(0, -1).join('/') || '/';
        
        if (!folderStructure[folderPath]) {
          folderStructure[folderPath] = [];
        }
        folderStructure[folderPath].push(item.name);
      });
      
      console.log('\nFolder structure found:');
      Object.keys(folderStructure).sort().forEach(path => {
        console.log(`  📁 ${path}: ${folderStructure[path].length} items`);
        if (folderStructure[path].length <= 5) {
          console.log(`      Items: ${folderStructure[path].join(', ')}`);
        }
      });
      
    } catch (error) {
      console.log(`❌ Search failed: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run the debug
debugImageKitStructure();