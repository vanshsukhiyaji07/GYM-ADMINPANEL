
export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED'
}

export enum LeadStatus {
  NEW = 'NEW',
  FOLLOW_UP = 'FOLLOW_UP',
  JOINED = 'JOINED',
  LOST = 'LOST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: MemberStatus;
  renewalDate: string;
  planId: string;
  trainerId?: string;
  lastAttendance?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  assignedTo?: string; // Trainer/Staff ID
  notes: string[];
  createdAt: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  assignedMembers: number;
  performance: number; // 0-100
  avatar: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}
