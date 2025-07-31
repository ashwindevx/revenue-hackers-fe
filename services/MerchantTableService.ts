import { httpGet, ApiResponse } from '../utils/http-utils';

interface Merchant {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

class MerchantTableService {
  private endpoint = '/merchants';

  /**
   * Fetch all merchants
   */
  async getMerchants(): Promise<ApiResponse<Merchant[]>> {
    try {
      const response = await httpGet<Merchant[]>(this.endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching merchants:', error);
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export singleton instance
export const merchantTableService = new MerchantTableService();
export default MerchantTableService;
