import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

async function fetchFromImageKit(url) {
  const auth = Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');
  
  console.log(`  Fetching: ${url}`);
  
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

async function testLifestyleSubfolders() {
  console.log('🔍 Testing direct access to Lifestyle subfolders...\n');

  try {
    // We know these paths exist from the previous test
    const knownSubfolderPaths = [
      '/portfolio/Lifestyle/Events',
      '/portfolio/Lifestyle/Traditional Wedding',
      '/portfolio/Lifestyle/Rockpooling' // Mentioned in the original request
    ];

    for (const path of knownSubfolderPaths) {
      console.log(`\n📁 Testing: ${path}`);
      console.log('─'.repeat(50));
      
      try {
        const contents = await fetchFromImageKit(
          `https://api.imagekit.io/v1/files?path=${encodeURIComponent(path)}`
        );
        
        console.log(`  ✅ Found ${contents.length} items`);
        
        if (contents.length > 0) {
          const files = contents.filter(item => item.type === 'file');
          const folders = contents.filter(item => item.type === 'folder');
          
          console.log(`     - ${files.length} files`);
          console.log(`     - ${folders.length} subfolders`);
          
          if (files.length > 0) {
            console.log(`     Sample files:`);
            files.slice(0, 5).forEach(file => {
              console.log(`       * ${file.name}`);
            });
          }
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }

    // Now let's try a different approach - get all files and group by path
    console.log('\n\n📊 Alternative approach: Get all files and analyze structure');
    console.log('─'.repeat(50));
    
    const allFiles = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?limit=500`
    );
    
    // Filter for Lifestyle files
    const lifestyleFiles = allFiles.filter(f => 
      f.filePath && f.filePath.includes('/portfolio/Lifestyle/')
    );
    
    console.log(`Found ${lifestyleFiles.length} files under /portfolio/Lifestyle/`);
    
    // Extract unique subfolder paths
    const subfolderPaths = new Set();
    lifestyleFiles.forEach(file => {
      const pathParts = file.filePath.split('/');
      // If path is like /portfolio/Lifestyle/Events/file.jpg
      // We want to extract /portfolio/Lifestyle/Events
      if (pathParts.length >= 4) {
        const subfolderPath = pathParts.slice(0, 4).join('/');
        subfolderPaths.add(subfolderPath);
      }
    });
    
    console.log(`\nUnique subfolder paths found:`);
    Array.from(subfolderPaths).sort().forEach(path => {
      const fileCount = lifestyleFiles.filter(f => f.filePath.startsWith(path + '/')).length;
      console.log(`  - ${path} (${fileCount} files)`);
    });

    // Test if we need to use includeFolder parameter
    console.log('\n\n🧪 Testing with includeFolder parameter');
    console.log('─'.repeat(50));
    
    try {
      const withIncludeFolder = await fetchFromImageKit(
        `https://api.imagekit.io/v1/files?path=/portfolio/Lifestyle&includeFolder=true`
      );
      console.log(`With includeFolder=true: ${withIncludeFolder.length} items`);
    } catch (error) {
      console.log(`includeFolder parameter test failed: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testLifestyleSubfolders();