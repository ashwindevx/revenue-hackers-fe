"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Save,
  Edit,
  X,
  Crown,
  Star,
  Circle,
  TrendingUp,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { useState } from "react";

interface TierConfig {
  vipPercentage: number;
  highPercentage: number;
  mediumPercentage: number;
  smoothingSensitivity: number;
  weekendSalesEnabled: boolean;
  coolOffPeriodHours: number;
  maxTriggersPerMonth: number;
}

interface AlertActionConfig {
  reEngagedWatchlistDays: number;
  noAnswerRetryDays: number;
  noAnswerPauseDays: number;
  needsSupportFollowupDays: number;
  willReturnDefaultPauseDays: number;
}

interface ConfigurationPanelProps {
  config: any;
  onConfigChange: (config: any) => void;
}

export function ConfigurationPanel({
  config,
  onConfigChange,
}: ConfigurationPanelProps) {
  const [tierConfig, setTierConfig] = useState<TierConfig>({
    vipPercentage: 10,
    highPercentage: 15,
    mediumPercentage: 20,
    smoothingSensitivity: 0.7,
    weekendSalesEnabled: true,
    coolOffPeriodHours: 48,
    maxTriggersPerMonth: 4,
  });

  const [alertActionConfig, setAlertActionConfig] = useState<AlertActionConfig>(
    {
      reEngagedWatchlistDays: 7,
      noAnswerRetryDays: 2,
      noAnswerPauseDays: 5,
      needsSupportFollowupDays: 7,
      willReturnDefaultPauseDays: 1,
    },
  );

  const [isEditing, setIsEditing] = useState(false);
  const [tempTierConfig, setTempTierConfig] = useState<TierConfig>(tierConfig);
  const [tempAlertConfig, setTempAlertConfig] =
    useState<AlertActionConfig>(alertActionConfig);

  const handleEdit = () => {
    setTempTierConfig(tierConfig);
    setTempAlertConfig(alertActionConfig);
    setIsEditing(true);
  };

  const handleSave = () => {
    setTierConfig(tempTierConfig);
    setAlertActionConfig(tempAlertConfig);
    onConfigChange({ ...tempTierConfig, ...tempAlertConfig });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTierConfig(tierConfig);
    setTempAlertConfig(alertActionConfig);
    setIsEditing(false);
  };

  const updateTempTierConfig = (
    key: keyof TierConfig,
    value: number | boolean,
  ) => {
    setTempTierConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateTempAlertConfig = (
    key: keyof AlertActionConfig,
    value: number,
  ) => {
    setTempAlertConfig((prev) => ({ ...prev, [key]: value }));
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Edit Configuration</span>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Adjust merchant tier and alert settings
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Merchant Tiers */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Merchant Tiers</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    VIP Merchants (Top %)
                  </Label>
                  <Select
                    value={tempTierConfig.vipPercentage.toString()}
                    onValueChange={(value) =>
                      updateTempTierConfig(
                        "vipPercentage",
                        Number.parseInt(value),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Top 5%</SelectItem>
                      <SelectItem value="10">Top 10%</SelectItem>
                      <SelectItem value="15">Top 15%</SelectItem>
                      <SelectItem value="20">Top 20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    High Value (75-90th %)
                  </Label>
                  <Select
                    value={tempTierConfig.highPercentage.toString()}
                    onValueChange={(value) =>
                      updateTempTierConfig(
                        "highPercentage",
                        Number.parseInt(value),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10% Range</SelectItem>
                      <SelectItem value="15">15% Range</SelectItem>
                      <SelectItem value="20">20% Range</SelectItem>
                      <SelectItem value="25">25% Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-gray-600" />
                    Medium (50-70th %)
                  </Label>
                  <Select
                    value={tempTierConfig.mediumPercentage.toString()}
                    onValueChange={(value) =>
                      updateTempTierConfig(
                        "mediumPercentage",
                        Number.parseInt(value),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15% Range</SelectItem>
                      <SelectItem value="20">20% Range</SelectItem>
                      <SelectItem value="25">25% Range</SelectItem>
                      <SelectItem value="30">30% Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Prophet Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Facebook Prophet Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Smoothing Sensitivity</Label>
                  <Select
                    value={tempTierConfig.smoothingSensitivity.toString()}
                    onValueChange={(value) =>
                      updateTempTierConfig(
                        "smoothingSensitivity",
                        Number.parseFloat(value),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.3">Low (0.3)</SelectItem>
                      <SelectItem value="0.5">Medium (0.5)</SelectItem>
                      <SelectItem value="0.7">High (0.7)</SelectItem>
                      <SelectItem value="0.9">Very High (0.9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Weekend Sales Analysis</Label>
                  <div className="flex items-center space-x-2 h-10">
                    <Checkbox
                      id="weekend"
                      checked={tempTierConfig.weekendSalesEnabled}
                      onCheckedChange={(checked) =>
                        updateTempTierConfig("weekendSalesEnabled", !!checked)
                      }
                    />
                    <Label htmlFor="weekend" className="text-sm">
                      Include weekend patterns
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Action Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alert Action Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Re-engaged Watchlist Period (days)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={tempAlertConfig.reEngagedWatchlistDays}
                      onChange={(e) =>
                        updateTempAlertConfig(
                          "reEngagedWatchlistDays",
                          Number.parseInt(e.target.value) || 7,
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Days to monitor after re-engagement before checking
                      activity
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>No Answer Retry Period (days)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="7"
                      value={tempAlertConfig.noAnswerRetryDays}
                      onChange={(e) =>
                        updateTempAlertConfig(
                          "noAnswerRetryDays",
                          Number.parseInt(e.target.value) || 2,
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Consecutive days to retry calling before pausing
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>No Answer Pause Period (days)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="14"
                      value={tempAlertConfig.noAnswerPauseDays}
                      onChange={(e) =>
                        updateTempAlertConfig(
                          "noAnswerPauseDays",
                          Number.parseInt(e.target.value) || 5,
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Days to pause between retry cycles
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Support Follow-up Period (days)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="14"
                      value={tempAlertConfig.needsSupportFollowupDays}
                      onChange={(e) =>
                        updateTempAlertConfig(
                          "needsSupportFollowupDays",
                          Number.parseInt(e.target.value) || 7,
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Days to keep in alert while support resolves issue
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Will Return Default Pause (days)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="7"
                      value={tempAlertConfig.willReturnDefaultPauseDays}
                      onChange={(e) =>
                        updateTempAlertConfig(
                          "willReturnDefaultPauseDays",
                          Number.parseInt(e.target.value) || 1,
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Default pause when no return date is specified
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                General Alert Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cool-off Period</Label>
                  <Select
                    value={tempTierConfig.coolOffPeriodHours.toString()}
                    onValueChange={(value) =>
                      updateTempTierConfig(
                        "coolOffPeriodHours",
                        Number.parseInt(value),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                      <SelectItem value="72">72 hours</SelectItem>
                      <SelectItem value="168">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Alerts per Month</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={tempTierConfig.maxTriggersPerMonth}
                    onChange={(e) =>
                      updateTempTierConfig(
                        "maxTriggersPerMonth",
                        Number.parseInt(e.target.value) || 4,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // View Mode
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>System Configuration</span>
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardTitle>
          <CardDescription>
            Current merchant tier and alert configuration
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Merchant Tiers Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Merchant Tiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold">VIP Merchants</span>
                </div>
                <p className="text-2xl font-bold text-yellow-800">
                  Top {tierConfig.vipPercentage}%
                </p>
                <p className="text-sm text-yellow-700">
                  Highest priority alerts
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">High Value</span>
                </div>
                <p className="text-2xl font-bold text-blue-800">75-90th %</p>
                <p className="text-sm text-blue-700">
                  {tierConfig.highPercentage}% range coverage
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Circle className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold">Medium Value</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">50-70th %</p>
                <p className="text-sm text-gray-700">
                  {tierConfig.mediumPercentage}% range coverage
                </p>
              </div>
            </div>
          </div>

          {/* Alert Action Rules Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Alert Action Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Re-engaged Watchlist</span>
                  <Badge variant="outline">
                    {alertActionConfig.reEngagedWatchlistDays} days
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">No Answer Retry Cycle</span>
                  <Badge variant="outline">
                    {alertActionConfig.noAnswerRetryDays}d on,{" "}
                    {alertActionConfig.noAnswerPauseDays}d off
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Support Follow-up</span>
                  <Badge variant="outline">
                    {alertActionConfig.needsSupportFollowupDays} days
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Will Return Default</span>
                  <Badge variant="outline">
                    {alertActionConfig.willReturnDefaultPauseDays} day pause
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Prophet Settings Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Forecasting Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Smoothing Sensitivity</span>
                <Badge variant="outline">
                  {(tierConfig.smoothingSensitivity * 100).toFixed(0)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Weekend Analysis</span>
                <Badge
                  variant={
                    tierConfig.weekendSalesEnabled ? "default" : "secondary"
                  }
                >
                  {tierConfig.weekendSalesEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Alert Settings Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alert Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Cool-off Period</span>
                <Badge variant="outline">
                  {tierConfig.coolOffPeriodHours}h
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Max Monthly Alerts</span>
                <Badge variant="outline">
                  {tierConfig.maxTriggersPerMonth}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
