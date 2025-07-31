import { httpGet, ApiResponse } from '../utils/http-utils';

interface MerchantDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  businessType: string;
  registrationDate: string;
  lastLoginAt: string;
  totalTransactions: number;
  totalRevenue: number;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
}

class MerchantDetailsService {
  private endpoint = '/merchants';

  /**
   * Fetch merchant details by ID
   */
  async getMerchantDetails(merchantId: string): Promise<ApiResponse<MerchantDetails>> {
    try {
      const response = await httpGet<MerchantDetails>(`${this.endpoint}/${merchantId}`);
      return response;
    } catch (error) {
      console.error('Error fetching merchant details:', error);
      return {
        data: {} as MerchantDetails,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export singleton instance
export const merchantDetailsService = new MerchantDetailsService();
export default MerchantDetailsService;
