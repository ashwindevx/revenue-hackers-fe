"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  Eye,
  Info,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import type {
  Alert,
  AlertStatus,
} from "@/types/scoring";
import { alertService } from "@/services/AlertService";

interface AlertActionDialogProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: {
    status: AlertStatus;
    notes: string;
    nextActionDate?: Date;
    acknowledged?: boolean;
    churnReason?: string;
    retryCount?: number;
    assignedTo?: string;
  }) => void;
  onViewMerchantDetails: (merchantId: string) => void;
}

// Action descriptions and consequences
const actionDescriptions = {
  "re-engaged": {
    title: "Re-engaged",
    description:
      "Merchant has been successfully re-engaged and is active again",
    consequences: [
      "Added to Post-Re-engagement Watchlist",
      "No alerts for 7 days",
      "After 7 days: if active → close for 7 days; if inactive → restart retention flow",
    ],
  },
  "not-interested": {
    title: "Not Interested (Clearly Confirmed)",
    description:
      "Merchant has clearly stated they are not interested in continuing",
    consequences: [
      "Removed from alert list permanently",
      "No further outreach",
      "Churn reason will be logged for analysis",
    ],
  },
  "no-answer": {
    title: "No Answer / Invalid Number / Bounced Email",
    description: "Unable to reach merchant through provided contact methods",
    consequences: [
      "Alert manager for 2 consecutive days to retry calling",
      "If no response after 2 days: pause for 7 days, then retry for 2 more days",
      "Pattern: 2 days on → 5 days off → 2 days on → 5 days off (repeats)",
      "Cycle resets if user shows any activity",
    ],
  },
  "needs-support": {
    title: "Needs Support / Pricing and Bill Change",
    description:
      "Merchant requires support team assistance or pricing adjustments",
    consequences: [
      "Added to tomorrow's follow-up list for manager",
      "Keep in alert for 7 days while support resolves issue",
      "Manager will check resolution progress daily",
    ],
  },
  "will-return-later": {
    title: "On Vacation / Will Return Later",
    description: "Merchant is temporarily unavailable but will return",
    consequences: [
      "If specific date provided: No alerts until that date",
      "On return date: re-add to alert list only if inactive",
      "If no date provided: Treat as 'No Answer' with 1-day alert → 5-day pause cycle",
    ],
  },
};

// Churn reasons for "Not Interested"
const churnReasons = [
  "No need for service",
  "Too expensive",
  "Switched to cards",
  "Found better alternative",
  "Business closing",
  "Seasonal business ended",
  "Other",
];

export function AlertActionDialog({
  alert,
  isOpen,
  onClose,
  onSubmit,
  onViewMerchantDetails,
}: AlertActionDialogProps) {
  const [actionNotes, setActionNotes] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [callLaterDate, setCallLaterDate] = useState<Date>();
  const [callLaterTime, setCallLaterTime] = useState<string>("");
  const [churnReason, setChurnReason] = useState<string>("");

  useEffect(() => {
    const fetchAlerts = async () => {
      if (isOpen && alert) {
        const response = await alertService.getAlerts(alert.merchantId);
        console.log('Fetched alerts for merchant:', response);
      }
    };

    fetchAlerts();
  }, [isOpen, alert]);

  const handleSubmit = () => {
    if (!alert || !selectedAction) return;

    const updates: {
      status: AlertStatus;
      notes: string;
      nextActionDate?: Date;
      acknowledged?: boolean;
      churnReason?: string;
      retryCount?: number;
      assignedTo?: string;
    } = {
      status: selectedAction as AlertStatus,
      notes: actionNotes,
    };

    // Handle specific action logic
    switch (selectedAction) {
      case "re-engaged":
        updates.nextActionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days later
        break;
      case "not-interested":
        updates.acknowledged = true; // Remove from active alerts
        updates.churnReason = churnReason;
        break;
      case "no-answer":
        updates.nextActionDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Next day for manager retry
        updates.retryCount = (alert.retryCount || 0) + 1;
        break;
      case "needs-support":
        updates.nextActionDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow for follow-up
        updates.assignedTo = "Support Team";
        break;
      case "will-return-later":
        if (callLaterDate && callLaterTime) {
          const [hours, minutes] = callLaterTime.split(":");
          const scheduledDateTime = new Date(callLaterDate);
          scheduledDateTime.setHours(
            Number.parseInt(hours),
            Number.parseInt(minutes),
          );
          updates.nextActionDate = scheduledDateTime;
        } else {
          // Treat as no answer if no date provided
          updates.nextActionDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        break;
    }

    onSubmit(updates);
    handleClose();
  };

  const handleClose = (openOrEvent?: boolean | React.MouseEvent) => {
    // If called with false, undefined, or a mouse event, close the dialog
    if (openOrEvent === false || openOrEvent === undefined || (openOrEvent && typeof openOrEvent === 'object')) {
      setActionNotes("");
      setSelectedAction("");
      setCallLaterDate(undefined);
      setCallLaterTime("");
      setChurnReason("");
      onClose();
    }
  };

  const handleViewDetails = () => {
    if (alert) {
      onViewMerchantDetails(alert.merchantId);
      handleClose(); // Close the dialog
    }
  };

  if (!alert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => handleClose(open)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Alert Action - {alert.merchantName}
          </DialogTitle>
          <DialogDescription>
            Update the status and add notes for this alert
            (Assigned to: {alert.assignedTo})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Reason */}
          {alert.alertReason && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">
                    Why this alert was triggered:
                  </h4>
                  <p className="text-sm text-red-800">
                    {alert.alertReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* View Merchant Details */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleViewDetails}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Merchant Details - Why This Alert Triggered
            </Button>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <Label>Select Action</Label>
            <Select
              value={selectedAction}
              onValueChange={setSelectedAction}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="re-engaged">
                  Re-engaged
                </SelectItem>
                <SelectItem value="not-interested">
                  Not Interested
                </SelectItem>
                <SelectItem value="no-answer">
                  No Answer / Bounced
                </SelectItem>
                <SelectItem value="needs-support">
                  Needs Support / Pricing and Bill Change
                </SelectItem>
                <SelectItem value="will-return-later">
                  On Vacation / Will Return Later
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Summary */}
          {selectedAction &&
            actionDescriptions[
              selectedAction as keyof typeof actionDescriptions
            ] && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-900">
                      {
                        actionDescriptions[
                          selectedAction as keyof typeof actionDescriptions
                        ].title
                      }
                    </h4>
                    <p className="text-sm text-blue-800">
                      {
                        actionDescriptions[
                          selectedAction as keyof typeof actionDescriptions
                        ].description
                      }
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-900">
                        What will happen:
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {actionDescriptions[
                          selectedAction as keyof typeof actionDescriptions
                        ].consequences.map(
                          (consequence, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2"
                            >
                              <span className="text-blue-600 mt-1">
                                •
                              </span>
                              <span>{consequence}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Churn Reason Selection for Not Interested */}
          {selectedAction === "not-interested" && (
            <div className="space-y-3">
              <Label>Churn Reason</Label>
              <Select
                value={churnReason}
                onValueChange={setChurnReason}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason for leaving..." />
                </SelectTrigger>
                <SelectContent>
                  {churnReasons.map((reason) => (
                    <SelectItem
                      key={reason}
                      value={reason}
                    >
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Return Date Selection for Will Return Later */}
          {selectedAction === "will-return-later" && (
            <div className="space-y-3">
              <Label>Return Date (Optional)</Label>
              <p className="text-sm text-muted-foreground">
                If no date is provided, this will be
                treated as "No Answer" with retry cycles.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {callLaterDate
                          ? format(callLaterDate, "PPP")
                          : "Pick a date (optional)"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={callLaterDate}
                        onSelect={setCallLaterDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Time (Optional)</Label>
                  <Input
                    type="time"
                    value={callLaterTime}
                    onChange={(e) =>
                      setCallLaterTime(e.target.value)
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about the interaction..."
              value={actionNotes}
              onChange={(e) =>
                setActionNotes(e.target.value)
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !selectedAction ||
                (selectedAction === "not-interested" &&
                  !churnReason)
              }
            >
              Submit Action
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 