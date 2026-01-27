export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
  isAdmin: boolean;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  owner_id: number;
}

export interface OrganizationMember {
  id: number;
  organization_id: number;
  user_id: number;
  role: string;
  joined_at: string;
  username: string;
  email: string;
}

export interface Session {
  id: string;
  user_id: number;
  token: string;
  current_organization_id: number | null;
  expires_at: string;
  created_at: string;
}

export interface Document {
  id: number;
  organization_id: number;
  user_id: number;
  path: string;
  title: string;
  color: string | null;
  size: number;
  created_at: string;
  updated_at: string;
}
