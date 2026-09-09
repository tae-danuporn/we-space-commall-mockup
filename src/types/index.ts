export type UnitStatus = 'vacant' | 'negotiating' | 'rented';

export interface Unit {
  id: string;
  code: string;
  zone: string;       // e.g. "A", "B", "C"
  floor: number;
  number: string;      // e.g. "102"
  sizeSqm: number;
  status: UnitStatus;
  tenantId?: string;
  monthlyRent?: number;
  commonFee?: number;
}

export type LeadStage = 'contacted' | 'site_visit' | 'negotiating' | 'contract_pending';

export interface Lead {
  id: string;
  shopName: string;
  contactName: string;
  phone: string;
  email?: string;
  interestedUnit?: string;
  stage: LeadStage;
  note?: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  shopName: string;
  shopCategory: string;
  contactName: string;
  phone: string;
  email?: string;
  unitId: string;
}

export type ContractStatus = 'active' | 'expiring' | 'expired';

export interface Contract {
  id: string;
  tenantId: string;
  unitId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositMonths: number;
  status: ContractStatus;
}

export type PaymentStatus = 'paid' | 'overdue' | 'pending';

export interface Payment {
  id: string;
  tenantId: string;
  contractId: string;
  month: string;       // e.g. "2026-09"
  amount: number;
  status: PaymentStatus;
  paidDate?: string;
  dueDate: string;
}

export type MaintenanceStatus = 'pending' | 'in_progress' | 'done';

export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  unitId: string;
  issue: string;
  description?: string;
  status: MaintenanceStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: 'all' | 'tenants' | 'staff';
  createdAt: string;
  createdBy: string;
}

export type ActivityType = 'contract' | 'payment' | 'repair' | 'lead';

export interface Activity {
  id: string;
  type: ActivityType;
  text: string;
  highlight: string;
  time: string;
}

export interface RevenueMonth {
  month: string;
  amount: number;
}
