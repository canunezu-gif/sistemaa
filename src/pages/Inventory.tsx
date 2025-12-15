import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAppStore } from '@/store/useAppStore';
import { InventoryItem } from '@/types';
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
  DialogTrigger,
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
import { Plus, Trash2, Edit, RefreshCw, Filter } from 'lucide-react';

export default function Inventory() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    code: '',
    year: new Date().getFullYear(),
    process: '',
    description: '',
    address: '',
    department: '',
    section: '',
    purchasePrice: 0,
    internalOC: '',
    publicMarketOC: '',
    uploadDate: new Date().toISOString().split('T')[0],
    quantityPurchased: 0,
    stock: 0,
  });

  const resetForm = () => {
    setFormData({
      code: '',
      year: new Date().getFullYear(),
      process: '',
      description: '',
      address: '',
      department: '',
      section: '',
      purchasePrice: 0,
      internalOC: '',
      publicMarketOC: '',
      uploadDate: new Date().toISOString().split('T')[0],
      quantityPurchased: 0,
      stock: 0,
    });
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.code || !formData.description) {
      toast.error('Código y Descripción son obligatorios');
      return;
    }

    const itemData = formData as InventoryItem;

    if (editingItem) {
      updateInventoryItem(editingItem.id, itemData);
      toast.success('Producto actualizado');
    } else {
      addInventoryItem({ ...itemData, id: crypto.randomUUID() });
      toast.success('Producto creado');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      deleteInventoryItem(id);
      toast.success('Producto eliminado');
    }
  };

  const handleSync = () => {
    // Simulation of Sync
    toast.info('Sincronizando con SQL Server...');
    setTimeout(() => {
      toast.success('Sincronización completada (Simulación)');
    }, 1500);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.internalOC.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = filterYear === 'all' || item.year.toString() === filterYear;

    return matchesSearch && matchesYear;
  });

  const uniqueYears = Array.from(new Set(inventory.map(i => i.year))).sort((a, b) => b - a);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Mantenedor de Inventario</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSync}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
          <SearchInput 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar por código, descripción u OC..." 
          />
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Año Proceso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los años</SelectItem>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>OC Interna</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.year}</TableCell>
                    <TableCell>${item.purchasePrice.toLocaleString('es-CL')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.stock}
                      </span>
                    </TableCell>
                    <TableCell>{item.internalOC}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Código</Label>
                <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Año</Label>
                <Input type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Descripción (Obs_Linea)</Label>
                <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Departamento</Label>
                <Input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Sección</Label>
                <Input value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Precio Compra</Label>
                <Input type="number" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2">
                <Label>Orden de Compra Interna</Label>
                <Input value={formData.internalOC} onChange={e => setFormData({...formData, internalOC: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Orden de Compra MP</Label>
                <Input value={formData.publicMarketOC} onChange={e => setFormData({...formData, publicMarketOC: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Fecha Subida</Label>
                <Input type="date" value={formData.uploadDate} onChange={e => setFormData({...formData, uploadDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Cantidad Comprada</Label>
                <Input type="number" value={formData.quantityPurchased} onChange={e => setFormData({...formData, quantityPurchased: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2">
                <Label>Stock Actual</Label>
                <Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} />
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