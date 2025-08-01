import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log('👀 Admin contact inquiries API called');
  
  // Set CORS headers
  const allowedOrigins = [
    'https://www.kristinmathilde.com',
    'https://kristinmathilde.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    if (req.method === 'GET') {
      // Get all contact inquiries with pagination
      const { page = 1, limit = 20, status = 'all' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let query = supabase
        .from('contact_inquiries')
        .select('*');
      
      // Filter by status if specified
      if (status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data: inquiries, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1);
      
      if (error) {
        console.error('❌ Error fetching inquiries:', error);
        throw error;
      }
      
      // Get total count for pagination
      const { count: totalCount } = await supabase
        .from('contact_inquiries')
        .select('*', { count: 'exact', head: true });
      
      return res.status(200).json({
        success: true,
        inquiries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      });
      
    } else if (req.method === 'POST') {
      // Update inquiry status
      const { id, status, admin_notes, responded_at } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: id and status'
        });
      }
      
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (admin_notes) updateData.admin_notes = admin_notes;
      if (responded_at) updateData.responded_at = responded_at;
      if (status === 'responded' && !updateData.responded_at) {
        updateData.responded_at = new Date().toISOString();
      }
      
      const { data: updatedInquiry, error } = await supabase
        .from('contact_inquiries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error updating inquiry:', error);
        throw error;
      }
      
      return res.status(200).json({
        success: true,
        inquiry: updatedInquiry
      });
      
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('❌ Admin contact inquiries error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}