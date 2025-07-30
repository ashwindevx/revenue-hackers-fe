"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ScoringEngine } from "@/lib/scoring-engine";
import type { Merchant, ScoringConfig } from "@/types/scoring";
import { TrendingUp, AlertTriangle, Building, X } from "lucide-react";

interface MerchantDetailsModalProps {
  merchant: Merchant;
  config: ScoringConfig;
  onClose: () => void;
  embedded?: boolean;
}

// Mock historical alert data
const mockAlertHistory = [
  {
    id: "alert-1",
    date: new Date("2024-01-15"),
    type: "critical",
    reason: "GTV dropped 25% from previous month",
    action: "re-engaged",
    assignedTo: "Ivo",
    aiSummary: {
      duration: "12:30",
      sentiment: "Negative",
      summary:
        "Merchant expressed concerns about recent transaction fees. Mentioned considering alternative payment processors. Requested information about volume discounts.",
      keyPoints: [
        "Price sensitivity",
        "Competitor evaluation",
        "Volume discount interest",
      ],
      nextAction: "Follow up with pricing proposal within 2 business days",
    },
    notes:
      "Merchant agreed to review new pricing structure. Scheduled follow-up call for next week.",
  },
  {
    id: "alert-2",
    date: new Date("2024-01-08"),
    type: "warning",
    reason: "Transaction frequency decreased by 15%",
    action: "seasonal-drop",
    assignedTo: "Ivo",
    aiSummary: {
      duration: "8:45",
      sentiment: "Neutral",
      summary:
        "Merchant explained seasonal business patterns. Holiday period typically shows reduced activity. Expects recovery in February.",
      keyPoints: ["Seasonal variation", "Holiday impact", "Expected recovery"],
      nextAction: "Monitor recovery in February, no immediate action needed",
    },
    notes:
      "Normal seasonal pattern confirmed. Will monitor for recovery post-holidays.",
  },
];

export function MerchantDetailsModal({
  merchant,
  config,
  onClose,
  embedded = false,
}: MerchantDetailsModalProps) {
  const [chartView, setChartView] = useState<"count" | "volume">("volume");
  const scoringEngine = new ScoringEngine();

  const totalScore = scoringEngine.calculateScore(merchant, config);
  const riskLevel = scoringEngine.getRiskLevel(totalScore, merchant);

  // Calculate tenure details
  const signupDate = merchant.signupDate;
  const daysSinceSignup = Math.floor(
    (Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case "gtv-drop":
        return "destructive";
      case "payment-drop":
        return "secondary";
      case "stop-transacting":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case "gtv-drop":
        return "GTV DROP";
      case "payment-drop":
        return "PAYMENT DROP";
      case "stop-transacting":
        return "STOP TRANSACTING";
      default:
        return "UNKNOWN";
    }
  };

  // Prepare chart data
  const chartData =
    merchant.paymentHistory?.map((item) => ({
      month: item.month,
      value: chartView === "count" ? item.count : item.volume / 1000, // Convert volume to K
      label: chartView === "count" ? "Payment Count" : "Volume (K)",
    })) || [];

  const content = (
    <div
      className={embedded ? "" : "p-6 overflow-y-auto max-h-[calc(90vh-120px)]"}
    >
      <div className="space-y-6">
        {/* Merchant Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Merchant Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Signup Date:
                  </span>
                  <span className="font-medium">
                    {signupDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Business Type:
                  </span>
                  <span className="font-medium">
                    {merchant.businessType || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Current Plan:
                  </span>
                  <Badge variant="outline">
                    {merchant.currentPlan || "N/A"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Signup Employee:
                  </span>
                  <span className="font-medium">
                    {merchant.signupEmployee || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    No. of Employees:
                  </span>
                  <span className="font-medium">
                    {merchant.numberOfEmployees || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Business Locations:
                  </span>
                  <span className="font-medium">
                    {merchant.numberOfLocations || "N/A"}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="font-medium">
                    {merchant.phoneNumber || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="font-medium">{merchant.email || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Days Active:
                  </span>
                  <span className="font-medium">{daysSinceSignup} days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Analytics Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Payment Analytics
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={chartView === "volume" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartView("volume")}
                >
                  Payment Volume
                </Button>
                <Button
                  variant={chartView === "count" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartView("count")}
                >
                  Payment Count
                </Button>
              </div>
            </div>
            <CardDescription>
              {chartView === "volume"
                ? "Monthly payment volume trends"
                : "Monthly payment count trends"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      chartView === "volume"
                        ? `£${Number(value).toLocaleString()}K`
                        : value,
                      chartView === "volume" ? "Volume" : "Count",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Simplified Alert History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Past Alerts
            </CardTitle>
            <CardDescription>
              Previous alert history for this merchant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlertHistory.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          alert.type === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {alert.type.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">
                        {alert.date.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.reason}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {alert.action}
                  </Badge>
                </div>
              ))}
            </div>

            {mockAlertHistory.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No alert history available for this merchant</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">{merchant.name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline">Tier {merchant.tier}</Badge>
              <Badge variant={getRiskBadgeVariant(riskLevel)}>
                {getRiskLevelText(riskLevel)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Risk Score:{" "}
                <span className="font-semibold">
                  {totalScore.toFixed(1)}/10
                </span>
              </span>
              <span className="text-sm text-muted-foreground">
                Assigned to:{" "}
                <span className="font-semibold">
                  {merchant.assignedSalesPerson}
                </span>
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {content}
      </div>
    </div>
  );
}
