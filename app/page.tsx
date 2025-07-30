"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Shield } from "lucide-react";
import { ConfigurationPanel } from "@/components/configuration-panel";
import { AlertManagement } from "@/components/alert-management";
import { CxoDashboard } from "@/components/cxo-dashboard";
import { AccountManagerTable } from "@/components/account-manager-table";
import { ScoringEngine } from "@/lib/scoring-engine";
import type { Merchant, ScoringConfig, Alert } from "@/types/scoring";

// Mock data for demonstration with additional merchant information
const mockMerchants: Merchant[] = [
  {
    id: "1",
    name: "TechCorp Solutions",
    tier: 1,
    merchantType: "VIP",
    signupDate: new Date("2022-01-15"),
    currentGTV: 850000,
    previousGTV: 1000000,
    historicalGTV: [1200000, 1100000, 1050000, 1000000, 950000, 850000],
    transactionFrequency: 45,
    revertedTransactions: 12,
    employeeDropOffRate: 0.15,
    lastUpdated: new Date(),
    phoneNumber: "+1-555-0123",
    email: "contact@techcorp.com",
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignedSalesPerson: "Ivo",
    businessType: "Technology Services",
    signupEmployee: "Sarah Johnson",
    numberOfEmployees: 150,
    numberOfLocations: 3,
    currentPlan: "Pay as you go - 0.5%",
    paymentHistory: [
      { month: "Jan 2024", count: 245, volume: 850000 },
      { month: "Dec 2023", count: 280, volume: 1000000 },
      { month: "Nov 2023", count: 290, volume: 1050000 },
      { month: "Oct 2023", count: 275, volume: 1000000 },
      { month: "Sep 2023", count: 260, volume: 950000 },
      { month: "Aug 2023", count: 220, volume: 1200000 },
    ],
  },
  {
    id: "2",
    name: "RetailMax Inc",
    tier: 2,
    merchantType: "High",
    signupDate: new Date("2023-06-20"),
    currentGTV: 320000,
    previousGTV: 280000,
    historicalGTV: [250000, 260000, 270000, 280000, 300000, 320000],
    transactionFrequency: 78,
    revertedTransactions: 5,
    employeeDropOffRate: 0.05,
    lastUpdated: new Date(),
    phoneNumber: "+1-555-0456",
    email: "admin@retailmax.com",
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    assignedSalesPerson: "Saf",
    businessType: "Retail",
    signupEmployee: "Mike Chen",
    numberOfEmployees: 45,
    numberOfLocations: 2,
    currentPlan: "SaaS Fixed - £100/month",
    paymentHistory: [
      { month: "Jan 2024", count: 78, volume: 320000 },
      { month: "Dec 2023", count: 82, volume: 280000 },
      { month: "Nov 2023", count: 85, volume: 270000 },
      { month: "Oct 2023", count: 80, volume: 280000 },
      { month: "Sep 2023", count: 75, volume: 300000 },
      { month: "Aug 2023", count: 70, volume: 250000 },
    ],
  },
  {
    id: "3",
    name: "StartupVenture LLC",
    tier: 4,
    merchantType: "Medium",
    signupDate: new Date("2024-02-10"),
    currentGTV: 45000,
    previousGTV: 65000,
    historicalGTV: [30000, 40000, 55000, 65000, 50000, 45000],
    transactionFrequency: 25,
    revertedTransactions: 8,
    employeeDropOffRate: 0.25,
    lastUpdated: new Date(),
    phoneNumber: "+1-555-0789",
    email: "hello@startupventure.com",
    lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    assignedSalesPerson: "Conor",
    businessType: "Startup",
    signupEmployee: "Alex Rodriguez",
    numberOfEmployees: 12,
    numberOfLocations: 1,
    currentPlan: "Pay as you go - 0.8%",
    paymentHistory: [
      { month: "Jan 2024", count: 25, volume: 45000 },
      { month: "Dec 2023", count: 30, volume: 65000 },
      { month: "Nov 2023", count: 28, volume: 50000 },
      { month: "Oct 2023", count: 32, volume: 65000 },
      { month: "Sep 2023", count: 26, volume: 55000 },
      { month: "Aug 2023", count: 22, volume: 30000 },
    ],
  },
  {
    id: "4",
    name: "GlobalTech Industries",
    tier: 1,
    merchantType: "VIP",
    signupDate: new Date("2021-08-12"),
    currentGTV: 1200000,
    previousGTV: 1500000,
    historicalGTV: [1800000, 1600000, 1500000, 1400000, 1300000, 1200000],
    transactionFrequency: 120,
    revertedTransactions: 25,
    employeeDropOffRate: 0.18,
    lastUpdated: new Date(),
    phoneNumber: "+1-555-0321",
    email: "finance@globaltech.com",
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    assignedSalesPerson: "Ivo",
    businessType: "Technology",
    signupEmployee: "David Kim",
    numberOfEmployees: 250,
    numberOfLocations: 5,
    currentPlan: "Enterprise - 0.3%",
    paymentHistory: [
      { month: "Jan 2024", count: 120, volume: 1200000 },
      { month: "Dec 2023", count: 140, volume: 1500000 },
      { month: "Nov 2023", count: 135, volume: 1400000 },
      { month: "Oct 2023", count: 130, volume: 1500000 },
      { month: "Sep 2023", count: 125, volume: 1300000 },
      { month: "Aug 2023", count: 150, volume: 1800000 },
    ],
  },
  {
    id: "5",
    name: "Premium Services Ltd",
    tier: 2,
    merchantType: "High",
    signupDate: new Date("2023-03-15"),
    currentGTV: 180000,
    previousGTV: 250000,
    historicalGTV: [200000, 220000, 240000, 250000, 220000, 180000],
    transactionFrequency: 55,
    revertedTransactions: 12,
    employeeDropOffRate: 0.22,
    lastUpdated: new Date(),
    phoneNumber: "+1-555-0654",
    email: "accounts@premiumservices.com",
    lastActivity: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    assignedSalesPerson: "Saf",
    businessType: "Professional Services",
    signupEmployee: "Emma Wilson",
    numberOfEmployees: 35,
    numberOfLocations: 2,
    currentPlan: "SaaS Fixed - £150/month",
    paymentHistory: [
      { month: "Jan 2024", count: 55, volume: 180000 },
      { month: "Dec 2023", count: 65, volume: 250000 },
      { month: "Nov 2023", count: 62, volume: 220000 },
      { month: "Oct 2023", count: 68, volume: 250000 },
      { month: "Sep 2023", count: 60, volume: 240000 },
      { month: "Aug 2023", count: 58, volume: 200000 },
    ],
  },
];

const defaultConfig: ScoringConfig = {
  gtvDropRate: { weight: 0.25, enabled: true },
  historicalStability: { weight: 0.2, enabled: true },
  merchantTier: { weight: 0.15, enabled: true },
  signupDate: { weight: 0.1, enabled: true },
  transactionFrequency: { weight: 0.15, enabled: true },
  transactionReverted: { weight: 0.1, enabled: true },
  employeeDropOffRate: { weight: 0.05, enabled: true },
};

export default function ChurnShieldSystem() {
  const [currentView, setCurrentView] = useState<
    "account-manager" | "admin" | "cxo"
  >("account-manager");
  const [config, setConfig] = useState<ScoringConfig>(defaultConfig);
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [scoringEngine] = useState(new ScoringEngine());

  // Calculate scores and generate alerts
  useEffect(() => {
    const updatedMerchants = merchants.map((merchant) => ({
      ...merchant,
      score: scoringEngine.calculateScore(merchant, config),
      riskLevel: scoringEngine.getRiskLevel(
        scoringEngine.calculateScore(merchant, config),
        merchant,
      ),
    }));

    setMerchants(updatedMerchants);

    // Generate alerts only for VIP and High value merchants with high/critical risk
    const newAlerts: Alert[] = updatedMerchants
      .filter(
        (merchant) =>
          (merchant.merchantType === "VIP" ||
            merchant.merchantType === "High") &&
          (merchant.riskLevel === "gtv-drop" ||
            merchant.riskLevel === "payment-drop" ||
            merchant.riskLevel === "stop-transacting"),
      )
      .map((merchant) => {
        // Generate alert reason based on merchant data
        let alertReason = "";
        const gtvDrop =
          ((merchant.previousGTV - merchant.currentGTV) /
            merchant.previousGTV) *
          100;

        if (merchant.riskLevel === "gtv-drop") {
          alertReason = `Merchant payment value dropped by ${gtvDrop.toFixed(1)}% compared to the previous period. This is due to their supervisor not accepting payments.`;
        } else if (merchant.riskLevel === "payment-drop") {
          alertReason = `Payment frequency has significantly decreased to ${merchant.transactionFrequency} transactions per month, indicating potential business issues.`;
        } else if (merchant.riskLevel === "stop-transacting") {
          alertReason = `Merchant has stopped transacting or shows no recent activity. Last activity was ${merchant.lastActivity?.toLocaleDateString() || "unknown"}.`;
        }

        return {
          id: `alert-${merchant.id}-${Date.now()}`,
          merchantId: merchant.id,
          merchantName: merchant.name,
          merchantType: merchant.merchantType,
          type:
            merchant.riskLevel === "stop-transacting" ? "critical" : "warning",
          message: `${merchant.name} (${merchant.merchantType}) has ${merchant.riskLevel?.replace("-", " ")} risk with score ${scoringEngine.calculateScore(merchant, config).toFixed(1)}`,
          alertReason,
          timestamp: new Date(),
          acknowledged: false,
          status: "yet-to-be-called",
          retryCount: 0,
          assignedTo: merchant.assignedSalesPerson,
        };
      });

    setAlerts((prev) => [...newAlerts, ...prev.slice(0, 10)]);
  }, [config, scoringEngine]);

  const activeAlerts = alerts.filter(
    (a) => !a.acknowledged && (a.status === "yet-to-be-called" || !a.status),
  ).length;

  if (currentView === "cxo") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                Churn Shield - CXO Dashboard
              </h1>
              <p className="text-muted-foreground">
                Executive overview of churn prevention and account management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={currentView}
                onValueChange={(value: "account-manager" | "admin" | "cxo") =>
                  setCurrentView(value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account-manager">
                    Account Manager View
                  </SelectItem>
                  <SelectItem value="admin">Admin View</SelectItem>
                  <SelectItem value="cxo">CXO Dashboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <CxoDashboard
            alerts={alerts}
            merchants={merchants}
            onUpdateAlert={(alertId, updates) => {
              setAlerts((prev) =>
                prev.map((alert) =>
                  alert.id === alertId ? { ...alert, ...updates } : alert,
                ),
              );
            }}
          />
        </div>
      </div>
    );
  }

  if (currentView === "admin") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                Churn Shield - Admin View
              </h1>
              <p className="text-muted-foreground">
                Administrative controls and system configuration
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={currentView}
                onValueChange={(value: "account-manager" | "admin" | "cxo") =>
                  setCurrentView(value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account-manager">
                    Account Manager View
                  </SelectItem>
                  <SelectItem value="admin">Admin View</SelectItem>
                  <SelectItem value="cxo">CXO Dashboard</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline">
                <Bell className="w-4 h-4 mr-1" />
                {activeAlerts} Active Alerts
              </Badge>
              <Badge variant="secondary">VIP & High Value Only</Badge>
            </div>
          </div>

          <AlertManagement
            alerts={alerts}
            merchants={merchants}
            config={config}
            onUpdateAlert={(alertId, updates) => {
              setAlerts((prev) =>
                prev.map((alert) =>
                  alert.id === alertId ? { ...alert, ...updates } : alert,
                ),
              );
            }}
          />

          <ConfigurationPanel config={config} onConfigChange={setConfig} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Churn Shield
            </h1>
            <p className="text-muted-foreground">
              Monitor merchant risk and prioritize account management
            </p>
          </div>
          {/* <div className="flex items-center gap-4">
            <Select
              value={currentView}
              onValueChange={(value: "account-manager" | "admin" | "cxo") => setCurrentView(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account-manager">Account Manager View</SelectItem>
                <SelectItem value="admin">Admin View</SelectItem>
                <SelectItem value="cxo">CXO Dashboard</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary">VIP & High Value Only</Badge>
            </div> */}
          {activeAlerts > 0 ? (
            <div className="w-50">
              <Badge variant="outline">
                <Bell className="w-4 h-4 mr-1" />
                {activeAlerts} Active Alerts
              </Badge>
            </div>
          ) : null}
        </div>

        <AccountManagerTable
          alerts={alerts}
          merchants={merchants}
          config={config}
          onUpdateAlert={(alertId, updates) => {
            setAlerts((prev) =>
              prev.map((alert) =>
                alert.id === alertId ? { ...alert, ...updates } : alert,
              ),
            );
          }}
        />
      </div>
    </div>
  );
}
