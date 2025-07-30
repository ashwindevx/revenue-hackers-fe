"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Bell } from "lucide-react";
import type { Alert } from "../types/scoring";

interface NotificationCenterProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
}

export function NotificationCenter({
  alerts,
  onAcknowledge,
}: NotificationCenterProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "warning":
        return <Badge variant="secondary">Warning</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  const activeAlerts = alerts.filter((alert) => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter((alert) => alert.acknowledged);

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Active Alerts ({activeAlerts.length})
          </CardTitle>
          <CardDescription>
            Alerts requiring immediate attention from account managers
          </CardDescription>
        </CardHeader>

        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No active alerts. All merchants are performing well!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 border rounded-lg bg-white"
                >
                  {getAlertIcon(alert.type)}

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{alert.merchantName}</h4>
                        {getAlertBadge(alert.type)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {alert.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700">{alert.message}</p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onAcknowledge(alert.id)}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Acknowledge
                      </Button>
                      <Button size="sm" variant="outline">
                        View Merchant
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert History */}
      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alert History</CardTitle>
            <CardDescription>
              Recently acknowledged alerts and notifications
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {acknowledgedAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-3 border rounded-lg bg-gray-50"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {alert.merchantName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
