import type { Merchant, ScoringConfig } from "../types/scoring";

export class ScoringEngine {
  calculateScore(merchant: Merchant, config: ScoringConfig): number {
    let totalScore = 0;
    let totalWeight = 0;

    // GTV Drop Rate Score
    if (config.gtvDropRate.enabled) {
      const gtvDropScore = this.calculateGTVDropScore(merchant);
      totalScore += gtvDropScore * config.gtvDropRate.weight;
      totalWeight += config.gtvDropRate.weight;
    }

    // Historical Stability Score
    if (config.historicalStability.enabled) {
      const stabilityScore = this.calculateStabilityScore(merchant);
      totalScore += stabilityScore * config.historicalStability.weight;
      totalWeight += config.historicalStability.weight;
    }

    // Merchant Tier Score
    if (config.merchantTier.enabled) {
      const tierScore = this.calculateTierScore(merchant);
      totalScore += tierScore * config.merchantTier.weight;
      totalWeight += config.merchantTier.weight;
    }

    // Signup Date Score
    if (config.signupDate.enabled) {
      const tenureScore = this.calculateTenureScore(merchant);
      totalScore += tenureScore * config.signupDate.weight;
      totalWeight += config.signupDate.weight;
    }

    // Transaction Frequency Score
    if (config.transactionFrequency.enabled) {
      const frequencyScore = this.calculateFrequencyScore(merchant);
      totalScore += frequencyScore * config.transactionFrequency.weight;
      totalWeight += config.transactionFrequency.weight;
    }

    // Transaction Reverted Score
    if (config.transactionReverted.enabled) {
      const revertedScore = this.calculateRevertedScore(merchant);
      totalScore += revertedScore * config.transactionReverted.weight;
      totalWeight += config.transactionReverted.weight;
    }

    // Employee Drop-off Rate Score
    if (config.employeeDropOffRate.enabled) {
      const employeeScore = this.calculateEmployeeDropOffScore(merchant);
      totalScore += employeeScore * config.employeeDropOffRate.weight;
      totalWeight += config.employeeDropOffRate.weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  public calculateGTVDropScore(merchant: Merchant): number {
    const dropRate =
      ((merchant.previousGTV - merchant.currentGTV) / merchant.previousGTV) *
      100;

    if (dropRate <= 0) return 2; // No drop or growth
    if (dropRate <= 10) return 4; // Low drop
    if (dropRate <= 25) return 6; // Moderate drop
    if (dropRate <= 50) return 8; // High drop
    return 10; // Severe drop
  }

  public calculateStabilityScore(merchant: Merchant): number {
    if (merchant.historicalGTV.length < 2) return 5;

    const mean =
      merchant.historicalGTV.reduce((sum, gtv) => sum + gtv, 0) /
      merchant.historicalGTV.length;
    const variance =
      merchant.historicalGTV.reduce(
        (sum, gtv) => sum + Math.pow(gtv - mean, 2),
        0,
      ) / merchant.historicalGTV.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = standardDeviation / mean;

    if (coefficientOfVariation <= 0.1) return 10; // Very stable
    if (coefficientOfVariation <= 0.25) return 7; // Stable
    if (coefficientOfVariation <= 0.5) return 4; // Unstable
    return 2; // Very unstable
  }

  public calculateTierScore(merchant: Merchant): number {
    switch (merchant.tier) {
      case 1:
        return 10;
      case 2:
        return 7;
      case 3:
        return 5;
      case 4:
        return 2;
      default:
        return 1;
    }
  }

  public calculateTenureScore(merchant: Merchant): number {
    const monthsSinceSignup = Math.floor(
      (Date.now() - merchant.signupDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );

    if (monthsSinceSignup >= 13) return 8;
    if (monthsSinceSignup >= 7) return 6;
    if (monthsSinceSignup >= 4) return 4;
    return 2;
  }

  public calculateFrequencyScore(merchant: Merchant): number {
    const frequency = merchant.transactionFrequency;

    if (frequency >= 100) return 8;
    if (frequency >= 50) return 6;
    if (frequency >= 30) return 4;
    return 2;
  }

  public calculateRevertedScore(merchant: Merchant): number {
    const revertedRate =
      (merchant.revertedTransactions / merchant.transactionFrequency) * 100;

    if (revertedRate >= 20) return 8; // High reversal rate
    if (revertedRate >= 10) return 6;
    if (revertedRate >= 5) return 4;
    return 2;
  }

  public calculateEmployeeDropOffScore(merchant: Merchant): number {
    const dropOffRate = merchant.employeeDropOffRate * 100;

    if (dropOffRate >= 50) return 8; // Severe drop-off
    if (dropOffRate >= 26) return 6; // High drop-off
    if (dropOffRate >= 11) return 4; // Moderate drop-off
    return 2; // Low drop-off
  }

  getRiskLevel(
    score: number,
    merchant: Merchant,
  ): "gtv-drop" | "payment-drop" | "stop-transacting" {
    // Determine risk level based on merchant data patterns
    const gtvDrop =
      ((merchant.previousGTV - merchant.currentGTV) / merchant.previousGTV) *
      100;
    const paymentDrop = merchant.transactionFrequency < 10;
    const noRecentActivity =
      merchant.lastActivity &&
      Date.now() - merchant.lastActivity.getTime() > 7 * 24 * 60 * 60 * 1000; // 7 days

    if (noRecentActivity || merchant.transactionFrequency === 0) {
      return "stop-transacting";
    } else if (paymentDrop) {
      return "payment-drop";
    } else {
      return "gtv-drop";
    }
  }
}
