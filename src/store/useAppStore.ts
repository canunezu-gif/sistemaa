import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  InventoryItem, 
  Professional, 
  SystemUser, 
  Beneficiary, 
  BenefitCategory, 
  AidRecord 
} from '@/types';

interface AppState {
  inventory: InventoryItem[];
  professionals: Professional[];
  systemUsers: SystemUser[];
  beneficiaries: Beneficiary[];
  benefitCategories: BenefitCategory[];
  aidRecords: AidRecord[];
  
  // Actions
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  addProfessional: (prof: Professional) => void;
  updateProfessional: (rut: string, prof: Partial<Professional>) => void;
  deleteProfessional: (rut: string) => void;
  
  addSystemUser: (user: SystemUser) => void;
  updateSystemUser: (rut: string, user: Partial<SystemUser>) => void;
  deleteSystemUser: (rut: string) => void;
  
  addBeneficiary: (ben: Beneficiary) => void;
  updateBeneficiary: (rut: string, ben: Partial<Beneficiary>) => void;
  deleteBeneficiary: (rut: string) => void;
  
  addBenefitCategory: (cat: BenefitCategory) => void;
  updateBenefitCategory: (id: string, cat: Partial<BenefitCategory>) => void;
  deleteBenefitCategory: (id: string) => void;
  
  addAidRecord: (record: AidRecord) => void;
}

// Initial Data
const initialBenefitCategories: BenefitCategory[] = [
  {
    id: '1',
    name: 'Aporte Económico',
    items: [
      { id: '1-1', name: 'Ahorro para la vivienda' },
      { id: '1-2', name: 'Entrega y/o transporte de agua potable' },
      { id: '1-3', name: 'Gas (vales, recarga, cilindros)' },
      { id: '1-4', name: 'Pago de Servicios Básicos' },
      { id: '1-5', name: 'Exención de pago servicio de aseo' },
      { id: '1-6', name: 'Pago de Arriendo' },
      { id: '1-7', name: 'Prestaciones y tratamientos de salud' },
      { id: '1-8', name: 'Retiro de medicamentos' },
      { id: '1-9', name: 'Otros' },
    ]
  },
  {
    id: '2',
    name: 'Fúnebres',
    items: [
      { id: '2-1', name: 'Servicios Fúnebres' },
      { id: '2-2', name: 'Entrega de Urna' },
      { id: '2-3', name: 'Derecho a terreno en Cementerio Municipal' },
      { id: '2-4', name: 'Servicio Sepultación' },
      { id: '2-5', name: 'Derecho a Sepultación' },
      { id: '2-6', name: 'Otros Funerales' },
    ]
  },
  {
    id: '3',
    name: 'Artículos de uso personal',
    items: [
      { id: '3-1', name: 'Pañales, sabanillas, insumos de cuidados' },
      { id: '3-2', name: 'Ajuar' },
      { id: '3-3', name: 'Sabanillas' },
      { id: '3-4', name: 'Útiles de Aseo' },
      { id: '3-5', name: 'Vestuario' },
      { id: '3-6', name: 'Otros artículos de aseo' },
    ]
  },
  {
    id: '4',
    name: 'Pasajes y Traslados',
    items: [
      { id: '4-1', name: 'Entrega de pasajes' },
      { id: '4-2', name: 'Traslados y Fletes' },
      { id: '4-3', name: 'Reembolso de pasajes' },
      { id: '4-4', name: 'Otros pasajes y traslado' },
    ]
  },
  {
    id: '5',
    name: 'Salud',
    items: [
      { id: '5-1', name: 'Entrega de medicamento y similares' },
      { id: '5-2', name: 'Atención Médica /Odontológicos' },
      { id: '5-3', name: 'Traslados por Emergencias de Salud' },
      { id: '5-4', name: 'Otros Salud' },
    ]
  },
  {
    id: '6',
    name: 'Servicios Básicos',
    items: [
      { id: '6-1', name: 'Entrega de Agua Potable' },
      { id: '6-2', name: 'Entrega de Paneles Solares o Baterías' },
      { id: '6-3', name: 'Entrega de Gas, Leña, otros' },
      { id: '6-4', name: 'Otros Servicios Básicos' },
    ]
  },
  {
    id: '7',
    name: 'Otros',
    items: [
      { id: '7-1', name: 'Regalos de navidad a niños y niñas' },
      { id: '7-2', name: 'Otro beneficio en especie o servicio municipal' },
    ]
  },
];

const initialAdmin: SystemUser = {
  rut: '11111111-1',
  firstName: 'Admin',
  lastName: 'Sistema',
  position: 'Administrador',
  status: 'Active',
  username: 'admin',
  password: '123',
  permissions: { create: true, read: true, update: true, delete: true }
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      inventory: [],
      professionals: [],
      systemUsers: [initialAdmin],
      beneficiaries: [],
      benefitCategories: initialBenefitCategories,
      aidRecords: [],

      addInventoryItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
      updateInventoryItem: (id, item) => set((state) => ({
        inventory: state.inventory.map((i) => (i.id === id ? { ...i, ...item } : i))
      })),
      deleteInventoryItem: (id) => set((state) => ({
        inventory: state.inventory.filter((i) => i.id !== id)
      })),

      addProfessional: (prof) => set((state) => ({ professionals: [...state.professionals, prof] })),
      updateProfessional: (rut, prof) => set((state) => ({
        professionals: state.professionals.map((p) => (p.rut === rut ? { ...p, ...prof } : p))
      })),
      deleteProfessional: (rut) => set((state) => ({
        professionals: state.professionals.filter((p) => p.rut !== rut)
      })),

      addSystemUser: (user) => set((state) => ({ systemUsers: [...state.systemUsers, user] })),
      updateSystemUser: (rut, user) => set((state) => ({
        systemUsers: state.systemUsers.map((u) => (u.rut === rut ? { ...u, ...user } : u))
      })),
      deleteSystemUser: (rut) => set((state) => ({
        systemUsers: state.systemUsers.filter((u) => u.rut !== rut)
      })),

      addBeneficiary: (ben) => set((state) => ({ beneficiaries: [...state.beneficiaries, ben] })),
      updateBeneficiary: (rut, ben) => set((state) => ({
        beneficiaries: state.beneficiaries.map((b) => (b.rut === rut ? { ...b, ...ben } : b))
      })),
      deleteBeneficiary: (rut) => set((state) => ({
        beneficiaries: state.beneficiaries.filter((b) => b.rut !== rut)
      })),

      addBenefitCategory: (cat) => set((state) => ({ benefitCategories: [...state.benefitCategories, cat] })),
      updateBenefitCategory: (id, cat) => set((state) => ({
        benefitCategories: state.benefitCategories.map((c) => (c.id === id ? { ...c, ...cat } : c))
      })),
      deleteBenefitCategory: (id) => set((state) => ({
        benefitCategories: state.benefitCategories.filter((c) => c.id !== id)
      })),

      addAidRecord: (record) => set((state) => ({ aidRecords: [...state.aidRecords, record] })),
    }),
    {
      name: 'dideco-storage',
    }
  )
);