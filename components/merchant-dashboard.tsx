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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Search, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { Merchant, ScoringConfig } from "../types/scoring";
import { MerchantDetailsModal } from "./merchant-details-modal";

interface MerchantDashboardProps {
  merchants: Merchant[];
  config: ScoringConfig;
}

export function MerchantDashboard({
  merchants,
  config,
}: MerchantDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("score");
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(false);

  const getRiskBadgeVariant = (riskLevel?: string) => {
    switch (riskLevel) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "default";
      default:
        return "outline";
    }
  };

  const getGTVTrend = (merchant: Merchant) => {
    const change =
      ((merchant.currentGTV - merchant.previousGTV) / merchant.previousGTV) *
      100;
    if (change > 5)
      return {
        icon: TrendingUp,
        color: "text-green-600",
        value: `+${change.toFixed(1)}%`,
      };
    if (change < -5)
      return {
        icon: TrendingDown,
        color: "text-red-600",
        value: `${change.toFixed(1)}%`,
      };
    return {
      icon: Minus,
      color: "text-muted-foreground",
      value: `${change.toFixed(1)}%`,
    };
  };

  const filteredMerchants = merchants
    .filter(
      (merchant) =>
        merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterRisk === "all" || merchant.riskLevel === filterRisk),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return (b.score || 0) - (a.score || 0);
        case "gtv":
          return b.currentGTV - a.currentGTV;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchant Risk Dashboard</CardTitle>
        <CardDescription>
          Monitor merchant performance and risk scores in real-time
        </CardDescription>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search merchants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Risk Score</SelectItem>
              <SelectItem value="gtv">GTV</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Current GTV</TableHead>
                <TableHead>GTV Trend</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMerchants.map((merchant) => {
                const trend = getGTVTrend(merchant);
                const TrendIcon = trend.icon;

                return (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{merchant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Member since{" "}
                          {merchant.signupDate.toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16">
                          <Progress
                            value={(merchant.score || 0) * 10}
                            className="h-2"
                          />
                        </div>
                        <span className="font-semibold">
                          {merchant.score?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(merchant.riskLevel)}>
                        {merchant.riskLevel?.toUpperCase() || "UNKNOWN"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold">
                        ${(merchant.currentGTV / 1000).toFixed(0)}K
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className={`flex items-center ${trend.color}`}>
                        <TrendIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {trend.value}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">Tier {merchant.tier}</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">
                        <div>{merchant.transactionFrequency}/month</div>
                        <div className="text-muted-foreground">
                          {merchant.revertedTransactions} reverted
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMerchant(merchant);
                          setShowDetails(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredMerchants.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No merchants found matching your criteria.
          </div>
        )}
      </CardContent>

      {showDetails && selectedMerchant && (
        <MerchantDetailsModal
          merchant={selectedMerchant}
          config={config}
          onClose={() => {
            setShowDetails(false);
            setSelectedMerchant(null);
          }}
        />
      )}
    </Card>
  );
}
