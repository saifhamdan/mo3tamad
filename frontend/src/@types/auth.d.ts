interface LoginResponse {
  tokenId: number;
  accessToken: string;
  refreshToken: string;
  scope: string;
  expiresIn: number;
  sessionId: string;
  ipAddress: string;
}

interface CasbinPolicies {
  adminAll: true;
  examsCreate: true;
  examsDelete: true;
  examsGet: true;
  examsGetall: true;
  examsUpdate: true;
  registerAll: false;
  usersCreate: true;
  usersDelete: true;
  usersGet: true;
  usersGetall: true;
  usersUpdate: true;
}
