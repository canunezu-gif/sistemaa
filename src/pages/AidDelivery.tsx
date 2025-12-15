import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { AidRecord, Beneficiary } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { ReceiptModal } from '@/components/aid/ReceiptModal';

export default function AidDelivery() {
  const { 
    beneficiaries, 
    benefitCategories, 
    inventory, 
    addAidRecord,
    aidRecords
  } = useAppStore();
  const { user } = useAuthStore();

  const [searchRut, setSearchRut] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastRecord, setLastRecord] = useState<AidRecord | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    aidCategory: '',
    aidProduct: '',
    quantity: 1,
    value: 0,
    detail: '',
    receiverName: '',
  });

  const handleSearchBeneficiary = () => {
    const found = beneficiaries.find(b => b.rut === searchRut);
    if (found) {
      setSelectedBeneficiary(found);
      setFormData(prev => ({ ...prev, receiverName: `${found.firstName} ${found.paternalLastName}` }));
      toast.success('Beneficiario encontrado');
    } else {
      setSelectedBeneficiary(null);
      toast.error('Beneficiario no encontrado');
    }
  };

  const handleProductChange = (value: string) => {
    // Check if it's an inventory item or a generic benefit
    const inventoryItem = inventory.find(i => i.description === value);
    if (inventoryItem) {
      setFormData(prev => ({ 
        ...prev, 
        aidProduct: value,
        value: inventoryItem.purchasePrice 
      }));
    } else {
      setFormData(prev => ({ ...prev, aidProduct: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBeneficiary) {
      toast.error('Debe seleccionar un beneficiario');
      return;
    }

    const newRecord: AidRecord = {
      folio: aidRecords.length + 1001, // Simple auto-increment logic
      beneficiaryRut: selectedBeneficiary.rut,
      beneficiaryName: `${selectedBeneficiary.firstName} ${selectedBeneficiary.paternalLastName} ${selectedBeneficiary.maternalLastName}`,
      date: formData.date,
      aidType: benefitCategories.find(c => c.id === formData.aidCategory)?.name || '',
      product: formData.aidProduct,
      quantity: formData.quantity,
      value: formData.value,
      detail: formData.detail,
      receiverName: formData.receiverName,
      professionalId: user?.rut || 'unknown'
    };

    addAidRecord(newRecord);
    setLastRecord(newRecord);
    setShowReceipt(true);
    toast.success('Ayuda registrada exitosamente');
    
    // Reset form partially
    setFormData(prev => ({
      ...prev,
      aidCategory: '',
      aidProduct: '',
      quantity: 1,
      value: 0,
      detail: '',
    }));
  };

  const selectedCategory = benefitCategories.find(c => c.id === formData.aidCategory);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Entrega de Ayudas</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column: Beneficiary Search */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Beneficiario</CardTitle>
                <CardDescription>Buscar por RUT</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="12.345.678-9" 
                    value={searchRut} 
                    onChange={e => setSearchRut(e.target.value)}
                  />
                  <Button size="icon" onClick={handleSearchBeneficiary}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {selectedBeneficiary && (
                  <div className="bg-slate-50 p-3 rounded-md text-sm space-y-2 border">
                    <p><span className="font-semibold">Nombre:</span> {selectedBeneficiary.firstName}</p>
                    <p><span className="font-semibold">Apellidos:</span> {selectedBeneficiary.paternalLastName} {selectedBeneficiary.maternalLastName}</p>
                    <p><span className="font-semibold">Dirección:</span> {selectedBeneficiary.address}</p>
                    <p><span className="font-semibold">Teléfono:</span> {selectedBeneficiary.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Aid Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalle de la Ayuda</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha</Label>
                      <Input 
                        type="date" 
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Folio (Auto)</Label>
                      <Input value={aidRecords.length + 1001} disabled className="bg-slate-100" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Ayuda</Label>
                    <Select 
                      value={formData.aidCategory} 
                      onValueChange={val => setFormData({...formData, aidCategory: val, aidProduct: ''})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {benefitCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Producto / Beneficio</Label>
                    <Select 
                      value={formData.aidProduct} 
                      onValueChange={handleProductChange}
                      disabled={!formData.aidCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione detalle" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory?.items.map(item => (
                          <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cantidad</Label>
                      <Input 
                        type="number" 
                        min="1"
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valor ($)</Label>
                      <Input 
                        type="number" 
                        value={formData.value}
                        onChange={e => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Detalle / Prescripción</Label>
                    <Textarea 
                      placeholder="Ingrese detalles adicionales prescritos por el profesional..."
                      value={formData.detail}
                      onChange={e => setFormData({...formData, detail: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quien Retira</Label>
                    <Input 
                      value={formData.receiverName}
                      onChange={e => setFormData({...formData, receiverName: e.target.value})}
                      placeholder="Nombre de la persona que retira"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={!selectedBeneficiary || !formData.aidCategory}>
                      Registrar Ayuda
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <ReceiptModal 
          isOpen={showReceipt} 
          onClose={() => setShowReceipt(false)} 
          record={lastRecord} 
        />
      </div>
    </MainLayout>
  );
}