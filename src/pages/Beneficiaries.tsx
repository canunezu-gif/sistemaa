import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAppStore } from '@/store/useAppStore';
import { Beneficiary } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchInput } from '@/components/ui/search-input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function Beneficiaries() {
  const { beneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Beneficiary | null>(null);

  const [formData, setFormData] = useState<Beneficiary>({
    rut: '',
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    address: '',
    phone: '',
    email: ''
  });

  const resetForm = () => {
    setFormData({
      rut: '',
      firstName: '',
      paternalLastName: '',
      maternalLastName: '',
      address: '',
      phone: '',
      email: ''
    });
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: Beneficiary) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.rut || !formData.firstName || !formData.paternalLastName) {
      toast.error('RUT, Nombre y Apellido Paterno son obligatorios');
      return;
    }

    if (editingItem) {
      updateBeneficiary(editingItem.rut, formData);
      toast.success('Beneficiario actualizado');
    } else {
      if (beneficiaries.some(b => b.rut === formData.rut)) {
        toast.error('El RUT ya existe');
        return;
      }
      addBeneficiary(formData);
      toast.success('Beneficiario creado');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (rut: string) => {
    if (confirm('¿Está seguro de eliminar este beneficiario?')) {
      deleteBeneficiary(rut);
      toast.success('Beneficiario eliminado');
    }
  };

  const filteredData = beneficiaries.filter(item => 
    item.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.paternalLastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Gestor de Personas (Beneficiarios)</h2>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <SearchInput 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar por RUT o Nombre..." 
          />
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RUT</TableHead>
                <TableHead>Nombres</TableHead>
                <TableHead>Ap. Paterno</TableHead>
                <TableHead>Ap. Materno</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron beneficiarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.rut}>
                    <TableCell className="font-medium">{item.rut}</TableCell>
                    <TableCell>{item.firstName}</TableCell>
                    <TableCell>{item.paternalLastName}</TableCell>
                    <TableCell>{item.maternalLastName}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.rut)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Beneficiario' : 'Nuevo Beneficiario'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>RUT</Label>
                <Input value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})} disabled={!!editingItem} />
              </div>
              <div className="space-y-2">
                <Label>Nombres</Label>
                <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Apellido Paterno</Label>
                  <Input value={formData.paternalLastName} onChange={e => setFormData({...formData, paternalLastName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Apellido Materno</Label>
                  <Input value={formData.maternalLastName} onChange={e => setFormData({...formData, maternalLastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}