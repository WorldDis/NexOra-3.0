import { NexoraTool, RiskTier } from '../types';
import { UserConfirmationCallback } from './UserConfirmationCallback';

export class RiskGateManager {
  private isAdminModeAuthorized: boolean = true;

  constructor(private confirmationCallback: UserConfirmationCallback) {}

  setConfirmationCallback(callback: UserConfirmationCallback): void {
    this.confirmationCallback = callback;
  }

  getConfirmationCallback(): UserConfirmationCallback {
    return this.confirmationCallback;
  }

  setAdminModeAuthorized(authorized: boolean): void {
    this.isAdminModeAuthorized = authorized;
  }

  getAdminModeAuthorized(): boolean {
    return this.isAdminModeAuthorized;
  }

  /**
   * Evaluates risk level prior to executing a tool.
   * If Admin Mode is authorized, all tools execute autonomously.
   * Otherwise, MEDIUM, HIGH, and CRITICAL require explicit confirmation.
   */
  async evaluateAndCanExecute(
    tool: NexoraTool,
    parameters: Record<string, any>
  ): Promise<boolean> {
    if (this.isAdminModeAuthorized) {
      return true;
    }

    switch (tool.riskLevel) {
      case RiskTier.LOW:
        return true;
      case RiskTier.MEDIUM:
      case RiskTier.HIGH:
      case RiskTier.CRITICAL: {
        const explanation = `Tool '${tool.name}' requires authorization due to elevated risk tier (${tool.riskLevel}).`;
        return await this.confirmationCallback.requestConfirmation(tool, parameters, explanation);
      }
    }
  }
}
