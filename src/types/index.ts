export interface InventoryItem {
  id: string;
  code: string;
  year: number;
  process: string;
  description: string; // Obs_Linea
  address: string;
  department: string;
  section: string;
  purchasePrice: number;
  internalOC: string;
  publicMarketOC: string;
  uploadDate: string;
  quantityPurchased: number;
  stock: number;
}

export interface Professional {
  rut: string;
  firstName: string;
  lastName: string;
  position: string;
  status: 'Active' | 'Inactive';
  email: string;
}

export interface SystemUserPermissions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface SystemUser {
  rut: string;
  firstName: string;
  lastName: string;
  position: string;
  status: 'Active' | 'Inactive';
  username: string;
  password: string; // In a real app, this would be hashed
  permissions: SystemUserPermissions;
}

export interface Beneficiary {
  rut: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  address: string;
  phone: string;
  email: string;
}

export interface BenefitItem {
  id: string;
  name: string;
}

export interface BenefitCategory {
  id: string;
  name: string;
  items: BenefitItem[];
}

export interface AidRecord {
  folio: number;
  beneficiaryRut: string;
  beneficiaryName: string; // Denormalized for easier display
  date: string;
  aidType: string; // Category Name
  product: string; // Item Name or Inventory Description
  quantity: number;
  value: number;
  detail: string;
  receiverName: string;
  professionalId: string; // Who authorized/recorded it
}