import { config } from 'dotenv';

config();

// Test the sync script logic with actual ImageKit file paths
function testSyncLogic() {
  console.log('🧪 Testing sync script path parsing logic...\n');
  
  // Sample file paths from ImageKit output
  const testFiles = [
    '/portfolio/NGO Storytelling/Sozo Foundation/Sozo Foundation Case Study Images103.jpg',
    '/portfolio/NGO Storytelling/Hands & Feet/Hope People 107.jpg',
    '/portfolio/Lifestyle/Baby Showers/Esau Baby Shower155.jpg',
    '/portfolio/Lifestyle/Events/Bay Nourish Ladies Tea_10.jpg',
    '/portfolio/Lifestyle/Rockpooling/Rockpooling_18',
    '/portfolio/Lifestyle/Traditional Wedding/Wedding_17',
    '/portfolio/Branding/Branding portfolio_2',
    '/portfolio/Family/Portfolio_9',
    '/portfolio/Travel/Travel_18'
  ];
  
  console.log('Testing path parsing for each file:');
  console.log('='.repeat(80));
  
  testFiles.forEach((filePath, i) => {
    console.log(`\n${i+1}. File: ${filePath}`);
    
    // Replicate the sync script logic
    const pathParts = filePath.split('/').filter(Boolean);
    
    console.log(`   Path parts: [${pathParts.join(', ')}]`);
    console.log(`   Length: ${pathParts.length}`);
    
    // Skip if not in portfolio or malformed path
    if (pathParts.length < 3 || pathParts[0] !== 'portfolio') {
      console.log('   ❌ Would skip: malformed path');
      return;
    }
    
    const categoryName = pathParts[1]; // e.g., "Lifestyle", "NGO Storytelling"
    const subcategory = pathParts.length > 3 ? pathParts[2] : null; // e.g., "Events" or null
    
    console.log(`   ✅ Category: "${categoryName}"`);
    console.log(`   ✅ Subcategory: ${subcategory ? `"${subcategory}"` : 'null'}`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Logic test complete');
}

testSyncLogic();