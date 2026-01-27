export interface UserContext {
  userId: number;
  username: string;
  isAdmin: boolean;
  currentOrgId?: number;
  orgRole?: string;
  exp: number;
}
