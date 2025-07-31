export default async function handler(req, res) {
  const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
  const IMAGEKIT_PUBLIC_URL = 'https://ik.imagekit.io/skbxxrf9vm/';
  const PORTFOLIO_ROOT = 'portfolio'; // Root folder for all portfolio content
  
  if (!IMAGEKIT_PRIVATE_KEY) {
    return res.status(500).json({ error: 'Missing IMAGEKIT_PRIVATE_KEY in environment variables.' });
  }

  const auth = Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');
  const { folder, action } = req.query;

  try {
    // If action is 'folders', return list of available portfolio categories
    if (action === 'folders') {
      const response = await fetch(`https://api.imagekit.io/v1/files?path=/${PORTFOLIO_ROOT}&type=folder`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }
      
      const folders = await response.json();
      
      // Transform folders into category structure
      const categories = folders
        .filter(item => item.type === 'folder')
        .map(folder => {
          // Extract folder name and create display name
          const folderName = folder.name;
          const displayName = folderName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          return {
            id: folderName.toLowerCase(),
            name: displayName,
            path: folder.filePath,
            folderName: folderName
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      
      return res.status(200).json({ categories });
    }

    // If folder is specified, return images from that folder
    if (folder) {
      const folderPath = `/${PORTFOLIO_ROOT}/${folder}`;
      
      // First, check if this folder has subfolders
      const folderCheckResponse = await fetch(`https://api.imagekit.io/v1/files?path=${folderPath}`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      
      if (!folderCheckResponse.ok) {
        const error = await folderCheckResponse.text();
        return res.status(folderCheckResponse.status).json({ error });
      }
      
      const folderContents = await folderCheckResponse.json();
      
      // Check if there are subfolders
      const subfolders = folderContents
        .filter(item => item.type === 'folder')
        .map(subfolder => ({
          id: subfolder.name.toLowerCase(),
          name: subfolder.name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          path: subfolder.filePath
        }));
      
      // Get images from current folder
      const images = folderContents
        .filter(file => file.type === 'file')
        .sort((a, b) => {
          // Extract numbers from filename for sorting
          const aNum = parseInt(a.name.match(/(\d+)/)?.[1] || '0');
          const bNum = parseInt(b.name.match(/(\d+)/)?.[1] || '0');
          return aNum - bNum;
        })
        .map(file => {
          const baseUrl = IMAGEKIT_PUBLIC_URL + file.filePath.replace(/^\//, '');
          // Generate optimized thumbnail
          const thumbnailUrl = baseUrl + '?tr=w-400,h-400,c-at_max,q-80,f-auto';
          return {
            thumbnailUrl,
            fullUrl: baseUrl + '?tr=q-90,f-auto',
            alt: `${folder} photo ${file.name}`,
            fileName: file.name,
            filePath: file.filePath
          };
        });
      
      return res.status(200).json({ 
        images,
        subfolders: subfolders.length > 0 ? subfolders : null,
        folder: folder
      });
    }

    // If subfolder is specified (folder/subfolder format)
    if (req.query.subfolder) {
      const { subfolder } = req.query;
      const subfolderPath = `/${PORTFOLIO_ROOT}/${folder}/${subfolder}`;
      
      const response = await fetch(`https://api.imagekit.io/v1/files?path=${subfolderPath}`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }
      
      const files = await response.json();
      
      const images = files
        .filter(file => file.type === 'file')
        .sort((a, b) => {
          const aNum = parseInt(a.name.match(/(\d+)/)?.[1] || '0');
          const bNum = parseInt(b.name.match(/(\d+)/)?.[1] || '0');
          return aNum - bNum;
        })
        .map(file => {
          const baseUrl = IMAGEKIT_PUBLIC_URL + file.filePath.replace(/^\//, '');
          const thumbnailUrl = baseUrl + '?tr=w-400,h-400,c-at_max,q-80,f-auto';
          return {
            thumbnailUrl,
            fullUrl: baseUrl + '?tr=q-90,f-auto',
            alt: `${subfolder} photo ${file.name}`,
            fileName: file.name,
            filePath: file.filePath
          };
        });
      
      return res.status(200).json({ 
        images,
        folder: folder,
        subfolder: subfolder
      });
    }

    // Default: return error if no valid parameters
    return res.status(400).json({ 
      error: 'Missing required parameters. Use action=folders to get categories, or folder=name to get images.' 
    });

  } catch (err) {
    console.error('ImageKit Portfolio API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}