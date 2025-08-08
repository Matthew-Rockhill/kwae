# Portfolio Sync Instructions

## How It Works

The portfolio sync system automatically keeps your website in sync with ImageKit:

1. **ImageKit** = Source of Truth (where you manage files/folders)
2. **Database** = Cache (stores file info for fast website loading)  
3. **Website** = Display (shows what's in the database)

## Automatic Sync

The sync runs automatically every day at 5:00 AM UTC (7:00 AM SAST).

## Manual Sync

If you need to sync immediately after making changes in ImageKit:

### Option 1: Command Line (Technical)
```bash
curl -X POST "https://kristin-with-an-eye.vercel.app/api/sync-portfolio?action=sync" \
  -H "Authorization: Bearer prod_sync_secret_key_2024"
```

### Option 2: Via Browser (Easy)
1. Save this as a bookmark:
   ```
   javascript:fetch('https://kristin-with-an-eye.vercel.app/api/sync-portfolio?action=sync',{method:'POST',headers:{'Authorization':'Bearer prod_sync_secret_key_2024'}}).then(r=>r.json()).then(d=>alert('Sync complete! ' + JSON.stringify(d.syncReport)));
   ```
2. Click the bookmark when on your website to trigger a sync

## What Gets Synced

- **Categories**: Main folders under `/portfolio/` (e.g., Lifestyle, Family, Travel)
- **Subcategories**: Subfolders within categories (e.g., Events, Baby Showers, Traditional Wedding)
- **Images**: All image files with proper thumbnails and optimization

## Folder Structure in ImageKit

```
/portfolio/
  /Lifestyle/
    /Events/
      - Event photos...
    /Baby Showers/
      - Baby shower photos...
    /Traditional Wedding/
      - Wedding photos...
    /Rockpooling/
      - Rockpooling photos...
  /NGO Storytelling/
    /Sozo Foundation/
      - Sozo photos...
    /Hands & Feet/
      - H&F photos...
  /Family/
    - Family photos (no subfolders)
  /Travel/
    - Travel photos (no subfolders)
  /Branding/
    - Branding photos (no subfolders)
```

## Important Notes

1. **File names**: Keep them descriptive but simple (e.g., "Wedding_01.jpg")
2. **Folder names**: Use normal spacing (e.g., "Baby Showers" not "baby-showers")
3. **Moving files**: When you move files between folders in ImageKit, run a sync
4. **Deleting files**: Deleted files are marked inactive (not deleted from database)
5. **Cache**: The website has a 5-minute cache, so changes may take a few minutes to appear

## Troubleshooting

- **New folders not showing?** → Run manual sync, wait 5 minutes for cache
- **Images in wrong category?** → Check folder structure in ImageKit, run sync
- **Images not loading?** → Check ImageKit dashboard for any issues
- **Sync failing?** → Check API key is correct in environment variables