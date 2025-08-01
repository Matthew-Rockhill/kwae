export interface VoucherData {
  packageType: string
  voucherType: 'gift' | 'sponsorship'
  purchaserName: string
  purchaserEmail: string
  recipientName?: string
  recipientEmail?: string
  organizationName?: string
  personalMessage?: string
}

export interface VoucherResponse {
  success: boolean
  message: string
  voucher?: {
    id: string
    voucherCode: string
    packageType: string
    voucherType: 'gift' | 'sponsorship'
    status: string
  }
}

class VoucherService {
  private apiBaseUrl: string

  constructor() {
    // Strict: require VITE_API_BASE_URL to be set
    if (!import.meta.env.VITE_API_BASE_URL) {
      throw new Error('VITE_API_BASE_URL environment variable must be set!');
    }
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // Debug logging
    console.log('🔧 Voucher Service API Base URL:', this.apiBaseUrl);
  }

  /**
   * Create a new voucher (gift or sponsorship)
   */
  async createVoucher(voucherData: VoucherData): Promise<VoucherResponse> {
    try {
      console.log('🎁 Creating voucher:', voucherData);
      
      const response = await fetch(`${this.apiBaseUrl}/vouchers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voucherData),
      })

      console.log('🎁 Voucher API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🎁 Voucher created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Voucher creation error:', error);
      return {
        success: false,
        message: error instanceof Error 
          ? error.message 
          : 'Failed to create voucher. Please try again or contact us directly.',
      }
    }
  }

  /**
   * Validate voucher code (for redemption)
   */
  async validateVoucher(voucherCode: string): Promise<{
    success: boolean
    message: string
    voucher?: {
      id: string
      voucherCode: string
      packageType: string
      voucherType: string
      status: string
      recipientName?: string
      organizationName?: string
    }
  }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/vouchers/${voucherCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Voucher not found' }));
        throw new Error(errorData.message || 'Invalid voucher code');
      }

      return await response.json();
    } catch (error) {
      console.error('Voucher validation error:', error);
      return {
        success: false,
        message: error instanceof Error 
          ? error.message 
          : 'Unable to validate voucher code.',
      }
    }
  }

  /**
   * Get all vouchers (for admin use)
   */
  async getVouchers(): Promise<VoucherData[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/vouchers`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching vouchers:', error)
      return []
    }
  }

  private getAuthToken(): string {
    // You would implement proper authentication here
    return localStorage.getItem('authToken') || ''
  }
}

// Export singleton instance
export const voucherService = new VoucherService()