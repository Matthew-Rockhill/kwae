import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

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

async function testLifestyleFolder() {
  console.log('🔍 Testing ImageKit Lifestyle folder access...\n');

  try {
    // 1. First, get all folders in /portfolio
    console.log('📁 Fetching all folders in /portfolio...');
    const portfolioFolders = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=/${PORTFOLIO_ROOT}&type=folder`
    );
    
    console.log('Found folders:');
    portfolioFolders.forEach(folder => {
      console.log(`  - ${folder.name} (${folder.filePath})`);
    });
    console.log('');

    // 2. Try different path variations for Lifestyle
    const pathVariations = [
      '/portfolio/Lifestyle',
      '/portfolio/lifestyle',
      '/portfolio/LifeStyle',
      '/portfolio/life-style',
      'portfolio/Lifestyle',
      'Lifestyle'
    ];

    console.log('🔎 Testing path variations for Lifestyle folder...\n');
    
    for (const path of pathVariations) {
      console.log(`Testing path: "${path}"`);
      try {
        const contents = await fetchFromImageKit(
          `https://api.imagekit.io/v1/files?path=${path}`
        );
        
        if (contents.length > 0) {
          console.log(`  ✅ SUCCESS! Found ${contents.length} items`);
          
          // Count files and folders
          const files = contents.filter(item => item.type === 'file');
          const folders = contents.filter(item => item.type === 'folder');
          
          console.log(`     - ${files.length} files`);
          console.log(`     - ${folders.length} folders`);
          
          if (folders.length > 0) {
            console.log(`     Subfolders found:`);
            folders.forEach(folder => {
              console.log(`       * ${folder.name} (${folder.filePath})`);
            });
          }
          
          if (files.length > 0) {
            console.log(`     Sample files:`);
            files.slice(0, 3).forEach(file => {
              console.log(`       * ${file.name}`);
            });
          }
          
          // If we found subfolders, check one of them
          if (folders.length > 0) {
            const firstSubfolder = folders[0];
            console.log(`\n     Checking subfolder: ${firstSubfolder.name}`);
            const subfolderContents = await fetchFromImageKit(
              `https://api.imagekit.io/v1/files?path=${firstSubfolder.filePath}`
            );
            console.log(`     Found ${subfolderContents.length} items in ${firstSubfolder.name}`);
            
            const subfolderFiles = subfolderContents.filter(item => item.type === 'file');
            if (subfolderFiles.length > 0) {
              console.log(`     Sample files in ${firstSubfolder.name}:`);
              subfolderFiles.slice(0, 3).forEach(file => {
                console.log(`       * ${file.name}`);
              });
            }
          }
          
          console.log('');
          break; // Found it, no need to continue
        } else {
          console.log(`  ❌ Path exists but returned 0 items`);
        }
      } catch (error) {
        console.log(`  ❌ Failed: ${error.message}`);
      }
    }

    // 3. Search for any files/folders containing "lifestyle"
    console.log('\n🔍 Searching for anything containing "lifestyle" in /portfolio...');
    try {
      const allItems = await fetchFromImageKit(
        `https://api.imagekit.io/v1/files?path=/portfolio&searchQuery=lifestyle`
      );
      
      if (allItems.length > 0) {
        console.log(`Found ${allItems.length} items containing "lifestyle":`);
        allItems.slice(0, 10).forEach(item => {
          console.log(`  - ${item.type}: ${item.name} (${item.filePath})`);
        });
      } else {
        console.log('No items found containing "lifestyle"');
      }
    } catch (error) {
      console.log(`Search failed: ${error.message}`);
    }

    // 4. List ALL items in /portfolio to see what's actually there
    console.log('\n📄 Listing ALL items in /portfolio (first 20)...');
    try {
      const allPortfolioItems = await fetchFromImageKit(
        `https://api.imagekit.io/v1/files?path=/portfolio&limit=20`
      );
      console.log(`Found ${allPortfolioItems.length} items:`);
      allPortfolioItems.forEach(item => {
        console.log(`  - ${item.type}: ${item.name} (${item.filePath})`);
      });
    } catch (error) {
      console.log(`Failed to list /portfolio contents: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testLifestyleFolder();