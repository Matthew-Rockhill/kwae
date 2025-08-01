import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const PORTFOLIO_ROOT = 'portfolio';

async function fetchFromImageKit(url) {
  const auth = Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');
  
  console.log(`    🔗 Fetching: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ImageKit API error: ${response.status} ${error}`);
  }
  
  const data = await response.json();
  console.log(`    📦 Response: ${data.length} items`);
  return data;
}

async function debugSyncProcess() {
  console.log('🔍 Debugging sync process for Lifestyle folder...\n');

  try {
    // Step 1: Get folders exactly like sync does
    console.log('STEP 1: Getting folders from /portfolio');
    const ikFolders = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=/${PORTFOLIO_ROOT}&type=folder`
    );
    
    console.log(`Found ${ikFolders.length} folders:`);
    ikFolders.forEach(folder => {
      console.log(`  - name: "${folder.name}"`);
      console.log(`    type: ${folder.type}`);
      console.log(`    filePath: ${folder.filePath || 'undefined'}`);
      console.log(`    folderPath: ${folder.folderPath || 'undefined'}`);
      console.log(`    path: ${folder.path || 'undefined'}`);
      console.log('');
    });

    // Step 2: Find Lifestyle folder
    const lifestyleFolder = ikFolders.find(f => 
      f.type === 'folder' && f.name === 'Lifestyle'
    );
    
    if (!lifestyleFolder) {
      console.log('❌ Lifestyle folder not found!');
      return;
    }

    console.log('\nSTEP 2: Processing Lifestyle folder');
    console.log(`  Folder object:`, JSON.stringify(lifestyleFolder, null, 2));
    
    // Step 3: Build path variations exactly like sync
    const folderName = lifestyleFolder.name;
    const dbFolderPath = lifestyleFolder.filePath || `/${PORTFOLIO_ROOT}/${folderName}`;
    
    const pathVariations = [
      dbFolderPath,
      `/${PORTFOLIO_ROOT}/${folderName}`,
      `/portfolio/${folderName}`,
      `portfolio/${folderName}`,
      folderName
    ];
    
    console.log('\nSTEP 3: Testing path variations');
    let successfulPath = null;
    let folderContents = [];
    
    for (const pathVariation of pathVariations) {
      console.log(`\n  Testing: "${pathVariation}"`);
      try {
        const contents = await fetchFromImageKit(
          `https://api.imagekit.io/v1/files?path=${pathVariation}`
        );
        if (contents.length > 0) {
          folderContents = contents;
          successfulPath = pathVariation;
          console.log(`    ✅ SUCCESS! Found ${contents.length} items`);
          
          // Show what we found
          const files = contents.filter(item => item.type === 'file');
          const folders = contents.filter(item => item.type === 'folder');
          console.log(`       - ${files.length} files`);
          console.log(`       - ${folders.length} folders`);
          
          if (folders.length > 0) {
            console.log(`       Subfolders:`);
            folders.forEach(f => {
              console.log(`         * ${f.name} (filePath: ${f.filePath || 'undefined'})`);
            });
          }
          
          break;
        } else {
          console.log(`    ❌ Returned 0 items`);
        }
      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
      }
    }

    if (!successfulPath) {
      console.log('\n❌ No successful path found for Lifestyle!');
      
      // Additional debugging
      console.log('\nADDITIONAL DEBUG: Trying paginated request');
      try {
        const paginatedUrl = `https://api.imagekit.io/v1/files?path=/${PORTFOLIO_ROOT}/${folderName}&limit=100&skip=0`;
        const paginatedContents = await fetchFromImageKit(paginatedUrl);
        console.log(`  Paginated request returned ${paginatedContents.length} items`);
      } catch (error) {
        console.log(`  Paginated request failed: ${error.message}`);
      }
      
      console.log('\nADDITIONAL DEBUG: Checking if files exist at root with "Lifestyle" in path');
      try {
        const allFiles = await fetchFromImageKit(
          `https://api.imagekit.io/v1/files?limit=100`
        );
        const lifestyleFiles = allFiles.filter(f => 
          f.filePath && f.filePath.toLowerCase().includes('lifestyle')
        );
        console.log(`  Found ${lifestyleFiles.length} files with "lifestyle" in path:`);
        lifestyleFiles.slice(0, 5).forEach(f => {
          console.log(`    - ${f.filePath}`);
        });
      } catch (error) {
        console.log(`  Root files check failed: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugSyncProcess();