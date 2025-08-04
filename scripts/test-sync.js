import dotenv from 'dotenv';
import { config } from 'dotenv';

// Load environment variables
config();

const SYNC_SECRET = process.env.SYNC_SECRET;
// Use the live server
const API_URL = 'https://kristinmathilde.com/api/sync-portfolio';

async function runSync() {
  console.log('🔄 Starting portfolio sync...');
  console.log(`📡 API URL: ${API_URL}`);
  
  try {
    const response = await fetch(`${API_URL}?action=sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SYNC_SECRET}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Sync failed with status ${response.status}: ${errorText}`);
      return;
    }
    
    const result = await response.json();
    console.log('✅ Sync completed:', JSON.stringify(result, null, 2));
    
    if (result.syncReport) {
      console.log('\n📊 Sync Report:');
      console.log(`  - Categories added: ${result.syncReport.categoriesAdded}`);
      console.log(`  - Categories updated: ${result.syncReport.categoriesUpdated}`);
      console.log(`  - Items added: ${result.syncReport.itemsAdded}`);
      console.log(`  - Items removed: ${result.syncReport.itemsRemoved}`);
      
      if (result.syncReport.errors?.length > 0) {
        console.log('\n⚠️  Errors:');
        result.syncReport.errors.forEach(error => {
          console.log(`  - ${error}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Sync error:', error);
  }
}

// Run the sync
runSync();