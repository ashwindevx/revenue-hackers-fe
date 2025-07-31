import { httpGet, httpPut, ApiResponse, ENDPOINTS } from '../utils/http-utils';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'acknowledged';
  merchantId: string;
  createdAt: string;
  updatedAt: string;
}

class AlertService {
  private endpoint = ENDPOINTS.ALERTS.GET_ALERTS;

  /**
   * Fetch all alerts for a merchant
   */
  async getAlerts(merchantId: string): Promise<ApiResponse<Alert[]>> {
    try {
      const response = await httpGet<Alert[]>(this.endpoint, { merchantId });
      return response;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Update an existing alert
   */
  async updateAlert(alertId: string, updates: Partial<Alert>): Promise<ApiResponse<Alert>> {
    try {
      const response = await httpPut<Alert>(`${this.endpoint}/${alertId}`, updates);
      return response;
    } catch (error) {
      console.error('Error updating alert:', error);
      return {
        data: {} as Alert,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update alert'
      };
    }
  }
}

// Export singleton instance
export const alertService = new AlertService();
export default AlertService;