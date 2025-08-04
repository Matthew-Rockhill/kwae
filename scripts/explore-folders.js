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

async function exploreFolders() {
  console.log('🔍 Exploring folder structure...\n');
  
  try {
    // Get all folders with their proper paths
    console.log('1. Getting all files and folders recursively...');
    const allItems = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?includeFolder=true&limit=1000`
    );
    
    console.log(`Found ${allItems.length} total items`);
    
    // Filter for folders only
    const folders = allItems.filter(item => item.type === 'folder');
    console.log(`\n📁 Found ${folders.length} folders:`);
    
    folders.forEach(folder => {
      console.log(`  - ${folder.name}`);
      console.log(`    Path: ${folder.filePath || 'undefined'}`);
      console.log(`    Full path: ${folder.folderPath || 'undefined'}`);
      console.log('');
    });
    
    // Look for anything that looks like portfolio folders
    console.log('🎯 Looking for portfolio-related folders...');
    const portfolioFolders = folders.filter(folder => 
      folder.filePath && (
        folder.filePath.includes('portfolio') ||
        folder.filePath.includes('Portfolio') ||
        folder.name === 'Lifestyle' ||
        folder.name === 'Family' ||
        folder.name === 'Travel' ||
        folder.name === 'Branding' ||
        folder.name.includes('NGO')
      )
    );
    
    console.log(`Found ${portfolioFolders.length} potential portfolio folders:`);
    portfolioFolders.forEach(folder => {
      console.log(`  ✅ ${folder.name} → ${folder.filePath}`);
    });
    
    // Try to get contents of the main portfolio-looking folders
    console.log('\n🔍 Checking contents of main folders...');
    const mainFolders = ['Lifestyle', 'Family', 'Travel', 'Branding', 'NGO Storytelling'];
    
    for (const folderName of mainFolders) {
      console.log(`\n📂 Checking "${folderName}"...`);
      
      // Try different path variations
      const pathsToTry = [
        `/${folderName}`,
        `/portfolio/${folderName}`,
        `portfolio/${folderName}`,
        folderName
      ];
      
      for (const path of pathsToTry) {
        try {
          const contents = await fetchFromImageKit(
            `https://api.imagekit.io/v1/files?path=${path}&limit=10`
          );
          
          if (contents.length > 0) {
            console.log(`  ✅ Found ${contents.length} items at path: ${path}`);
            contents.slice(0, 3).forEach(item => {
              console.log(`    - ${item.type}: ${item.name}`);
            });
            break; // Found a working path, no need to try others
          }
        } catch (error) {
          // Silent fail, try next path
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Exploration failed:', error);
  }
}

// Run the exploration
exploreFolders();