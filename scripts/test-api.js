#!/usr/bin/env node

async function testAPI() {
  try {
    console.log('🧪 Testing production API...');
    
    // Test categories
    console.log('\n📁 Testing categories API:');
    const categoriesUrl = 'https://kristinmathilde.com/api/portfolio?action=categories';
    console.log('URL:', categoriesUrl);
    
    const categoriesResponse = await fetch(categoriesUrl);
    console.log('Status:', categoriesResponse.status);
    console.log('Status Text:', categoriesResponse.statusText);
    console.log('Headers:', Object.fromEntries(categoriesResponse.headers.entries()));
    
    if (categoriesResponse.redirected) {
      console.log('⚠️ Response was redirected to:', categoriesResponse.url);
    }
    
    const categoriesText = await categoriesResponse.text();
    console.log('Response body (first 500 chars):', categoriesText.substring(0, 500));
    
    // Try to parse as JSON
    try {
      const categoriesData = JSON.parse(categoriesText);
      console.log('✅ Categories data:', categoriesData);
      
      if (categoriesData.categories && categoriesData.categories.length > 0) {
        const firstCategory = categoriesData.categories[0];
        console.log('\n🖼️ Testing images for category:', firstCategory.id);
        
        const imagesUrl = `https://kristinmathilde.com/api/portfolio?category=${firstCategory.id}&limit=3`;
        console.log('URL:', imagesUrl);
        
        const imagesResponse = await fetch(imagesUrl);
        console.log('Status:', imagesResponse.status);
        
        const imagesText = await imagesResponse.text();
        const imagesData = JSON.parse(imagesText);
        console.log('✅ Images data:', imagesData);
        
        if (imagesData.images && imagesData.images.length > 0) {
          console.log('\n🎯 Sample image URLs:');
          imagesData.images.slice(0, 2).forEach((img, i) => {
            console.log(`  ${i + 1}. Thumbnail: ${img.thumbnailUrl}`);
            console.log(`     Full: ${img.fullUrl}`);
          });
        }
      }
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError.message);
      console.log('Raw response:', categoriesText);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testAPI();