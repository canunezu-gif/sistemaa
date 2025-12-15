import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchInput } from '@/components/ui/search-input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Settings } from 'lucide-react';

export default function BenefitsConfig() {
  const { benefitCategories, updateBenefitCategory } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Only handling items editing for simplicity as categories are fixed structure in requirement
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{id: string, name: string} | null>(null);
  const [itemName, setItemName] = useState('');

  const handleOpenDialog = (categoryId: string, item?: {id: string, name: string}) => {
    setEditingCategory(categoryId);
    if (item) {
      setEditingItem(item);
      setItemName(item.name);
    } else {
      setEditingItem(null);
      setItemName('');
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!itemName || !editingCategory) return;

    const category = benefitCategories.find(c => c.id === editingCategory);
    if (!category) return;

    let newItems = [...category.items];

    if (editingItem) {
      newItems = newItems.map(i => i.id === editingItem.id ? {...i, name: itemName} : i);
      toast.success('Beneficio actualizado');
    } else {
      newItems.push({
        id: `${editingCategory}-${Date.now()}`,
        name: itemName
      });
      toast.success('Beneficio agregado');
    }

    updateBenefitCategory(editingCategory, { items: newItems });
    setIsDialogOpen(false);
  };

  const handleDelete = (categoryId: string, itemId: string) => {
    if (confirm('¿Eliminar este beneficio?')) {
      const category = benefitCategories.find(c => c.id === categoryId);
      if (!category) return;
      
      const newItems = category.items.filter(i => i.id !== itemId);
      updateBenefitCategory(categoryId, { items: newItems });
      toast.success('Beneficio eliminado');
    }
  };

  const filteredCategories = benefitCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.items.length > 0 || searchTerm === '');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Mantenedor de Ayudas (Beneficios)</h2>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <SearchInput 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar beneficio..." 
          />
        </div>

        <div className="bg-white rounded-lg border p-4">
          <Accordion type="multiple" className="w-full">
            {filteredCategories.map((category) => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-lg">{category.name}</span>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500 ml-2">
                      {category.items.length} items
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-4 pr-2">
                    <div className="flex justify-end mb-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenDialog(category.id)}>
                        <Plus className="h-3 w-3 mr-1" /> Agregar Item
                      </Button>
                    </div>
                    {category.items.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border group">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-mono text-xs w-6">{index + 1}</span>
                          <span>{item.name}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(category.id, item)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(category.id, item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Beneficio' : 'Nuevo Beneficio'}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label>Nombre del Beneficio</Label>
              <Input value={itemName} onChange={e => setItemName(e.target.value)} className="mt-2" />
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