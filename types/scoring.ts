export interface Merchant {
  id: string;
  name: string;
  tier: number;
  merchantType: "VIP" | "High" | "Medium";
  signupDate: Date;
  currentGTV: number;
  previousGTV: number;
  historicalGTV: number[];
  transactionFrequency: number;
  revertedTransactions: number;
  employeeDropOffRate: number;
  lastUpdated: Date;
  score?: number;
  riskLevel?: "gtv-drop" | "payment-drop" | "stop-transacting";
  phoneNumber?: string;
  email?: string;
  lastActivity?: Date;
  assignedSalesPerson?: string;
  businessType?: string;
  signupEmployee?: string;
  numberOfEmployees?: number;
  numberOfLocations?: number;
  currentPlan?: string;
  paymentHistory?: PaymentHistoryItem[];
}

export interface PaymentHistoryItem {
  month: string;
  count: number;
  volume: number;
}

export interface ScoringConfig {
  gtvDropRate: {
    weight: number;
    enabled: boolean;
  };
  historicalStability: {
    weight: number;
    enabled: boolean;
  };
  merchantTier: {
    weight: number;
    enabled: boolean;
  };
  signupDate: {
    weight: number;
    enabled: boolean;
  };
  transactionFrequency: {
    weight: number;
    enabled: boolean;
  };
  transactionReverted: {
    weight: number;
    enabled: boolean;
  };
  employeeDropOffRate: {
    weight: number;
    enabled: boolean;
  };
}

export interface Alert {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantType: "VIP" | "High" | "Medium";
  type: "info" | "warning" | "critical";
  message: string;
  alertReason?: string;
  timestamp: Date;
  acknowledged: boolean;
  status?: AlertStatus;
  assignedTo?: string;
  nextActionDate?: Date;
  retryCount?: number;
  callRecordings?: CallRecording[];
  notes?: string;
  churnReason?: string;
  tags?: string[];
  cxoComments?: string;
}

export type AlertStatus =
  | "yet-to-be-called"
  | "re-engaged"
  | "not-interested"
  | "no-answer"
  | "needs-support"
  | "will-return-later";

export interface CallRecording {
  id: string;
  alertId: string;
  recordingUrl: string;
  duration: number;
  timestamp: Date;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  keyPoints: string[];
  nextAction: string;
}

export interface AlertAction {
  id: string;
  alertId: string;
  action: AlertStatus;
  timestamp: Date;
  performedBy: string;
  notes?: string;
  scheduledDate?: Date;
  churnReason?: string;
}

export interface AccountManagerPerformance {
  name: string;
  activeAlerts: number;
  resolvedThisMonth: number;
  successRate: number;
  avgResolutionTime: number;
  totalAssigned: number;
}
