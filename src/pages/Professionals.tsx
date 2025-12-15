import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAppStore } from '@/store/useAppStore';
import { Professional } from '@/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function Professionals() {
  const { professionals, addProfessional, updateProfessional, deleteProfessional } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Professional | null>(null);

  const [formData, setFormData] = useState<Professional>({
    rut: '',
    firstName: '',
    lastName: '',
    position: '',
    status: 'Active',
    email: ''
  });

  const resetForm = () => {
    setFormData({
      rut: '',
      firstName: '',
      lastName: '',
      position: '',
      status: 'Active',
      email: ''
    });
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: Professional) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.rut || !formData.firstName || !formData.lastName) {
      toast.error('RUT y Nombres son obligatorios');
      return;
    }

    if (editingItem) {
      updateProfessional(editingItem.rut, formData);
      toast.success('Profesional actualizado');
    } else {
      // Check duplicate RUT
      if (professionals.some(p => p.rut === formData.rut)) {
        toast.error('El RUT ya existe');
        return;
      }
      addProfessional(formData);
      toast.success('Profesional creado');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (rut: string) => {
    if (confirm('¿Está seguro de eliminar este profesional?')) {
      deleteProfessional(rut);
      toast.success('Profesional eliminado');
    }
  };

  const filteredData = professionals.filter(item => 
    item.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Gestor de Profesionales</h2>
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
                <TableHead>Apellidos</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron profesionales
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.rut}>
                    <TableCell className="font-medium">{item.rut}</TableCell>
                    <TableCell>{item.firstName}</TableCell>
                    <TableCell>{item.lastName}</TableCell>
                    <TableCell>{item.position}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status === 'Active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Profesional' : 'Nuevo Profesional'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>RUT</Label>
                <Input value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})} disabled={!!editingItem} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombres</Label>
                  <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Apellidos</Label>
                  <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(val: 'Active' | 'Inactive') => setFormData({...formData, status: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Activo</SelectItem>
                    <SelectItem value="Inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
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