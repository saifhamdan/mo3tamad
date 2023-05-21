interface LoginResponse {
  tokenId: number;
  accessToken: string;
  refreshToken: string;
  scope: string;
  expiresIn: number;
  sessionId: string;
  ipAddress: string;
  accountId: number;
}

interface CasbinPolicies {
  adminAll: boolean;
  assessmentsCreate: boolean;
  assessmentsDelete: true;
  assessmentsGetall: boolean;
  assessmentsUpdate: boolean;
  systemAll: boolean;
  userAll: boolean;
}
