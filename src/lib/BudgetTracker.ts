export class BudgetTracker {
  private dailyBudget: number;
  private dailySpent: number;
  private monthlyBudget: number;
  private monthlySpent: number;
  private dailyResetTime: Date;
  private monthlyResetTime: Date;

  constructor(dailyBudget: number = 15, monthlyBudget: number = 150) {
    this.dailyBudget = dailyBudget;
    this.monthlyBudget = monthlyBudget;
    this.dailySpent = 0;
    this.monthlySpent = 0;
    this.dailyResetTime = this.getNextDayReset();
    this.monthlyResetTime = this.getNextMonthReset();
  }

  private getNextDayReset(): Date {
    const now = new Date();
    now.setHours(24, 0, 0, 0);
    return now;
  }

  private getNextMonthReset(): Date {
    const now = new Date();
    now.setMonth(now.getMonth() + 1, 1);
    now.setHours(0, 0, 0, 0);
    return now;
  }

  private resetDailyBudget() {
    const now = new Date();
    if (now >= this.dailyResetTime) {
      this.dailySpent = 0;
      this.dailyResetTime = this.getNextDayReset();
    }
  }

  private resetMonthlyBudget() {
    const now = new Date();
    if (now >= this.monthlyResetTime) {
      this.monthlySpent = 0;
      this.monthlyResetTime = this.getNextMonthReset();
    }
  }

  canMakeRequest(estimatedCost: number = 0.01): boolean {
    this.resetDailyBudget();
    this.resetMonthlyBudget();

    const canMakeDaily = this.dailySpent + estimatedCost <= this.dailyBudget;
    const canMakeMonthly = this.monthlySpent + estimatedCost <= this.monthlyBudget;

    return canMakeDaily && canMakeMonthly;
  }

  trackRequest(response: any, baseCost: number = 0.01) {
    const estimatedCost = this.calculateRequestCost(response, baseCost);
    
    this.dailySpent += estimatedCost;
    this.monthlySpent += estimatedCost;
  }

  private calculateRequestCost(response: any, baseCost: number): number {
    // Estimation simple du coût basé sur les tokens
    const inputTokens = response?.usage?.input_tokens || 0;
    const outputTokens = response?.usage?.output_tokens || 0;
    
    // Prix estimé : 0.01$ par 1000 tokens
    const tokenCost = (inputTokens + outputTokens) / 1000 * 0.01;
    
    return Math.max(baseCost, tokenCost);
  }

  getDailyBudgetStatus() {
    return {
      dailyBudget: this.dailyBudget,
      dailySpent: this.dailySpent,
      remainingDaily: this.dailyBudget - this.dailySpent
    };
  }

  getMonthlyBudgetStatus() {
    return {
      monthlyBudget: this.monthlyBudget,
      monthlySpent: this.monthlySpent,
      remainingMonthly: this.monthlyBudget - this.monthlySpent
    };
  }
}