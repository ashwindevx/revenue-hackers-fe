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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Phone,
  Mail,
  Crown,
  Star,
  Circle,
  Clock,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { MerchantDetailsModal } from "./merchant-details-modal";
import { AlertActionDialog } from "./alert-action-dialog";
import type {
  Alert,
  Merchant,
  AlertStatus,
  ScoringConfig,
} from "@/types/scoring";

interface AlertManagementProps {
  alerts: Alert[];
  merchants: Merchant[];
  config: ScoringConfig;
  onUpdateAlert: (alertId: string, updates: Partial<Alert>) => void;
}



export function AlertManagement({
  alerts,
  merchants,
  config,
  onUpdateAlert,
}: AlertManagementProps) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null,
  );
  const [showMerchantDetails, setShowMerchantDetails] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const getMerchantTypeIcon = (type: "VIP" | "High" | "Medium") => {
    switch (type) {
      case "VIP":
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case "High":
        return <Star className="h-4 w-4 text-blue-600" />;
      case "Medium":
        return <Circle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status?: AlertStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "re-engaged":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Re-engaged
          </Badge>
        );
      case "not-interested":
        return <Badge variant="destructive">Not Interested</Badge>;
      case "no-answer":
        return <Badge variant="secondary">No Answer</Badge>;
      case "needs-support":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            Needs Support
          </Badge>
        );
      case "will-return-later":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Will Return Later
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAlertAction = (updates: {
    status: AlertStatus;
    notes: string;
    nextActionDate?: Date;
    acknowledged?: boolean;
    churnReason?: string;
    retryCount?: number;
    assignedTo?: string;
  }) => {
    if (!selectedAlert) return;
    onUpdateAlert(selectedAlert.id, updates);
    setSelectedAlert(null);
    setShowAlertDialog(false);
  };

  const handleViewMerchantDetails = (merchantId: string) => {
    const merchant = merchants.find((m) => m.id === merchantId);
    if (merchant) {
      setSelectedMerchant(merchant);
      setShowMerchantDetails(true);
    }
  };

  const activeAlerts = alerts.filter(
    (alert) => !alert.acknowledged && alert.status === "pending",
  );
  const inProgressAlerts = alerts.filter(
    (alert) =>
      alert.status &&
      alert.status !== "pending" &&
      alert.status !== "not-interested",
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeAlerts.length}</div>
            <p className="text-sm text-muted-foreground">
              Require immediate action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inProgressAlerts.length}</div>
            <p className="text-sm text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">73%</div>
            <p className="text-sm text-muted-foreground">Re-engagement rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Management Dashboard</CardTitle>
          <CardDescription>
            Manage alerts for VIP and High value merchants only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Next Action</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => {
                  const merchant = merchants.find(
                    (m) => m.id === alert.merchantId,
                  );
                  return (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {alert.merchantName}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {merchant?.phoneNumber && (
                              <Phone className="h-3 w-3" />
                            )}
                            {merchant?.email && <Mail className="h-3 w-3" />}
                            {alert.timestamp.toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMerchantTypeIcon(alert.merchantType)}
                          <span className="font-medium">
                            {alert.merchantType}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            alert.type === "critical"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {alert.type.toUpperCase()}
                        </Badge>
                      </TableCell>

                      <TableCell>{getStatusBadge(alert.status)}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {alert.assignedTo}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          {alert.nextActionDate ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(alert.nextActionDate, "MMM dd, HH:mm")}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Now</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedAlert(alert);
                              setShowAlertDialog(true);
                            }}
                          >
                            Take Action
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No alerts found. All VIP and High value merchants are performing
              well!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Merchant Details Modal */}
      {showMerchantDetails && selectedMerchant && (
        <MerchantDetailsModal
          merchant={selectedMerchant}
          config={config}
          onClose={() => {
            setShowMerchantDetails(false);
            setSelectedMerchant(null);
          }}
        />
      )}

      {/* Alert Action Dialog */}
      <AlertActionDialog
        alert={selectedAlert}
        isOpen={showAlertDialog}
        onClose={() => {
          setSelectedAlert(null);
          setShowAlertDialog(false);
        }}
        onSubmit={handleAlertAction}
        onViewMerchantDetails={handleViewMerchantDetails}
      />
    </div>
  );
}
