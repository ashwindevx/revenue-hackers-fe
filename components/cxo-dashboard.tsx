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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Tag,
  Crown,
  Star,
  Circle,
  UserCheck,
  BarChart3,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type {
  Alert,
  Merchant,
  AccountManagerPerformance,
} from "@/types/scoring";

interface CxoDashboardProps {
  alerts: Alert[];
  merchants: Merchant[];
  onUpdateAlert: (alertId: string, updates: Partial<Alert>) => void;
}

// Mock account manager performance data
const mockAccountManagers: AccountManagerPerformance[] = [
  {
    name: "Ivo",
    activeAlerts: 5, // Updated from 3
    resolvedThisMonth: 15, // Updated from 12
    successRate: 85,
    avgResolutionTime: 2.5,
    totalAssigned: 20, // Updated from 15
  },
  {
    name: "Saf",
    activeAlerts: 3, // Updated from 1
    resolvedThisMonth: 10, // Updated from 8
    successRate: 90,
    avgResolutionTime: 1.8,
    totalAssigned: 13, // Updated from 9
  },
  {
    name: "Conor",
    activeAlerts: 2,
    resolvedThisMonth: 6,
    successRate: 75,
    avgResolutionTime: 3.2,
    totalAssigned: 8,
  },
];

// Available tags for alerts
const availableTags = [
  "High Priority",
  "Pricing Issue",
  "Technical Problem",
  "Seasonal",
  "Competitor",
  "Support Needed",
  "Follow-up Required",
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function CxoDashboard({
  alerts,
  merchants,
  onUpdateAlert,
}: CxoDashboardProps) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [newAssignee, setNewAssignee] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cxoComment, setCxoComment] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");

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

  const getStatusBadge = (status?: string) => {
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

  const handleReassignAlert = () => {
    if (!selectedAlert || !newAssignee) return;

    onUpdateAlert(selectedAlert.id, {
      assignedTo: newAssignee,
      tags: selectedTags,
      cxoComments: cxoComment,
    });

    setSelectedAlert(null);
    setNewAssignee("");
    setSelectedTags([]);
    setCxoComment("");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleViewMerchantDetails = (merchantId: string) => {
    const merchant = merchants.find((m) => m.id === merchantId);
    if (merchant) {
      // You can implement merchant details modal here
      console.log("View merchant details:", merchant);
      // For now, we'll just log it - you can add the MerchantDetailsModal component if needed
    }
  };

  // Calculate metrics
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(
    (a) => !a.acknowledged && a.status === "pending",
  ).length;
  const resolvedAlerts = alerts.filter((a) => a.status === "re-engaged").length;
  const successRate =
    totalAlerts > 0 ? Math.round((resolvedAlerts / totalAlerts) * 100) : 0;

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (filterStatus !== "all" && alert.status !== filterStatus) return false;
    if (filterAssignee !== "all" && alert.assignedTo !== filterAssignee)
      return false;
    return true;
  });

  // Prepare chart data
  const statusData = [
    {
      name: "Pending",
      value: alerts.filter((a) => a.status === "pending").length,
    },
    {
      name: "Re-engaged",
      value: alerts.filter((a) => a.status === "re-engaged").length,
    },
    {
      name: "No Answer",
      value: alerts.filter((a) => a.status === "no-answer").length,
    },
    {
      name: "Needs Support",
      value: alerts.filter((a) => a.status === "needs-support").length,
    },
    {
      name: "Not Interested",
      value: alerts.filter((a) => a.status === "not-interested").length,
    },
  ].filter((item) => item.value > 0);

  const performanceData = mockAccountManagers.map((am) => ({
    name: am.name,
    resolved: am.resolvedThisMonth,
    active: am.activeAlerts,
    successRate: am.successRate,
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlerts}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Successfully re-engaged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alert Management</TabsTrigger>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alert Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Status Distribution</CardTitle>
                <CardDescription>Current status of all alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Account Manager Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Account Manager Performance</CardTitle>
                <CardDescription>Resolved alerts this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="resolved" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="re-engaged">Re-engaged</SelectItem>
                      <SelectItem value="no-answer">No Answer</SelectItem>
                      <SelectItem value="needs-support">
                        Needs Support
                      </SelectItem>
                      <SelectItem value="not-interested">
                        Not Interested
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label>Assignee</Label>
                  <Select
                    value={filterAssignee}
                    onValueChange={setFilterAssignee}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      <SelectItem value="Ivo">Ivo</SelectItem>
                      <SelectItem value="Saf">Saf</SelectItem>
                      <SelectItem value="Conor">Conor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Alerts Management</CardTitle>
              <CardDescription>
                Manage, reassign, and track all alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold">
                              {alert.merchantName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {alert.message}
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
                          <div className="flex flex-wrap gap-1">
                            {alert.tags?.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {alert.timestamp.toLocaleDateString()}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAlert(alert);
                                  setNewAssignee(alert.assignedTo || "");
                                  setSelectedTags(alert.tags || []);
                                  setCxoComment(alert.cxoComments || "");
                                }}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Manage Alert - {alert.merchantName}
                                </DialogTitle>
                                <DialogDescription>
                                  Reassign, tag, and add comments to this alert
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                {/* Current Alert Info */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <h4 className="font-semibold mb-2">
                                    Alert Details
                                  </h4>
                                  <p className="text-sm text-gray-700">
                                    {alert.message}
                                  </p>
                                  {alert.alertReason && (
                                    <p className="text-sm text-gray-600 mt-2">
                                      <strong>Reason:</strong>{" "}
                                      {alert.alertReason}
                                    </p>
                                  )}
                                  {alert.status &&
                                    alert.status !== "pending" && (
                                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                          <strong>
                                            Alert was closed by{" "}
                                            {alert.assignedTo ||
                                              "Account Manager"}
                                            :
                                          </strong>
                                          {alert.status ===
                                            "will-return-later" &&
                                            " Merchant went on vacation"}
                                          {alert.status === "re-engaged" &&
                                            " Merchant was successfully re-engaged"}
                                          {alert.status === "no-answer" &&
                                            " Unable to reach merchant"}
                                          {alert.status === "needs-support" &&
                                            " Merchant needs support assistance"}
                                          {alert.status === "not-interested" &&
                                            " Merchant is not interested"}
                                          {alert.notes && ` - ${alert.notes}`}
                                        </p>
                                      </div>
                                    )}
                                </div>

                                {/* View Merchant Details */}
                                <div className="flex justify-center">
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleViewMerchantDetails(
                                        alert.merchantId,
                                      )
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View Merchant Details - Why This Alert
                                    Triggered
                                  </Button>
                                </div>

                                {/* Reassign */}
                                <div className="space-y-3">
                                  <Label>Reassign To</Label>
                                  <Select
                                    value={newAssignee}
                                    onValueChange={setNewAssignee}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select account manager..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Ivo">Ivo</SelectItem>
                                      <SelectItem value="Saf">Saf</SelectItem>
                                      <SelectItem value="Conor">
                                        Conor
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Tags */}
                                <div className="space-y-3">
                                  <Label>Tags</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {availableTags.map((tag) => (
                                      <Button
                                        key={tag}
                                        variant={
                                          selectedTags.includes(tag)
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() => toggleTag(tag)}
                                      >
                                        <Tag className="h-3 w-3 mr-1" />
                                        {tag}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                {/* CXO Comments */}
                                <div className="space-y-2">
                                  <Label htmlFor="cxo-comment">
                                    CXO Comments
                                  </Label>
                                  <Textarea
                                    id="cxo-comment"
                                    placeholder="Add executive comments or instructions..."
                                    value={cxoComment}
                                    onChange={(e) =>
                                      setCxoComment(e.target.value)
                                    }
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setSelectedAlert(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button onClick={handleReassignAlert}>
                                    Update Alert
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Account Manager Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Account Manager Performance
              </CardTitle>
              <CardDescription>
                Detailed performance metrics for each account manager
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Manager</TableHead>
                      <TableHead>Active Alerts</TableHead>
                      <TableHead>Resolved This Month</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Avg Resolution Time</TableHead>
                      <TableHead>Total Assigned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAccountManagers.map((am) => (
                      <TableRow key={am.name}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{am.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{am.activeAlerts}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-600">
                            {am.resolvedThisMonth}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${am.successRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {am.successRate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {am.avgResolutionTime} days
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {am.totalAssigned}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
