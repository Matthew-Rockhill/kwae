import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

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

async function testDirectFolders() {
  console.log('🔍 Testing direct folder access...\n');

  try {
    // Test each folder found at root level
    const foldersToTest = [
      'Lifestyle',
      'Family', 
      'NGO Storytelling',
      'Travel',
      'Branding',
      'Rockpooling',
      'Events'
    ];

    for (const folderName of foldersToTest) {
      console.log(`\n📁 Testing folder: ${folderName}`);
      console.log('─'.repeat(50));
      
      // Try with leading slash
      const pathWithSlash = `/${folderName}`;
      console.log(`  Trying path: "${pathWithSlash}"`);
      
      try {
        const contents = await fetchFromImageKit(
          `https://api.imagekit.io/v1/files?path=${encodeURIComponent(pathWithSlash)}`
        );
        
        console.log(`  ✅ Found ${contents.length} items`);
        
        if (contents.length > 0) {
          const files = contents.filter(item => item.type === 'file');
          const folders = contents.filter(item => item.type === 'folder');
          
          console.log(`     - ${files.length} files`);
          console.log(`     - ${folders.length} subfolders`);
          
          if (folders.length > 0) {
            console.log(`     Subfolders:`);
            folders.forEach(folder => {
              console.log(`       * ${folder.name} (${folder.filePath})`);
            });
            
            // Check first subfolder
            const firstSubfolder = folders[0];
            console.log(`\n     Checking subfolder: ${firstSubfolder.filePath}`);
            const subfolderContents = await fetchFromImageKit(
              `https://api.imagekit.io/v1/files?path=${encodeURIComponent(firstSubfolder.filePath)}`
            );
            console.log(`       Found ${subfolderContents.length} items in ${firstSubfolder.name}`);
          }
          
          if (files.length > 0) {
            console.log(`     Sample files:`);
            files.slice(0, 3).forEach(file => {
              console.log(`       * ${file.name}`);
            });
          }
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }

    // Also check if portfolio folder has any subfolders
    console.log(`\n\n📁 Checking portfolio folder structure`);
    console.log('─'.repeat(50));
    
    // First check subfolders of portfolio
    const portfolioSubfolders = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=/portfolio&type=folder`
    );
    
    console.log(`Found ${portfolioSubfolders.length} subfolders in /portfolio:`);
    portfolioSubfolders.forEach(folder => {
      console.log(`  - ${folder.name} (${folder.filePath})`);
    });
    
    // If portfolio has subfolders, check one
    if (portfolioSubfolders.length > 0) {
      const lifestyleInPortfolio = portfolioSubfolders.find(f => 
        f.name.toLowerCase() === 'lifestyle'
      );
      
      if (lifestyleInPortfolio) {
        console.log(`\nFound Lifestyle in portfolio at: ${lifestyleInPortfolio.filePath}`);
        const lifestyleContents = await fetchFromImageKit(
          `https://api.imagekit.io/v1/files?path=${encodeURIComponent(lifestyleInPortfolio.filePath)}`
        );
        console.log(`Contains ${lifestyleContents.length} items`);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testDirectFolders();