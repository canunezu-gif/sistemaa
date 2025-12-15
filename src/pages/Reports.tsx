import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAppStore } from '@/store/useAppStore';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function Reports() {
  const { inventory, aidRecords, professionals } = useAppStore();
  
  // Filters for Aid History
  const [filterRut, setFilterRut] = useState('');
  const [filterProf, setFilterProf] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  const filteredAidRecords = aidRecords.filter(record => {
    const matchesRut = !filterRut || record.beneficiaryRut.includes(filterRut);
    const matchesProf = filterProf === 'all' || record.professionalId === filterProf;
    const matchesDate = !filterDate || record.date === filterDate;
    return matchesRut && matchesProf && matchesDate;
  });

  const criticalStock = inventory.filter(i => i.stock <= 5);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExport = (data: any[], filename: string) => {
    // Simple CSV export simulation
    console.log('Exporting', data);
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0] || {}).join(",") + "\n"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      + data.map((e: any) => Object.values(e).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Reportes y Listados</h2>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Inventario General</TabsTrigger>
            <TabsTrigger value="critical">Stock Crítico</TabsTrigger>
            <TabsTrigger value="history">Ayudas Entregadas</TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Listado de Productos</CardTitle>
                  <CardDescription>Vista general de todo el inventario disponible.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => handleExport(inventory, 'inventario')}>
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Año</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Precio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.year}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>${item.purchasePrice.toLocaleString('es-CL')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Critical Stock Tab */}
          <TabsContent value="critical">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-red-600">Stock Crítico</CardTitle>
                  <CardDescription>Productos con stock igual o menor a 5 unidades.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => handleExport(criticalStock, 'stock_critico')}>
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Stock Actual</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criticalStock.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">No hay productos en estado crítico</TableCell>
                      </TableRow>
                    ) : (
                      criticalStock.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="font-bold text-red-600">{item.stock}</TableCell>
                          <TableCell><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Crítico</span></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aid History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Ayudas</CardTitle>
                <CardDescription>Registro completo de beneficios entregados.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-lg border">
                  <div className="flex-1 min-w-[200px]">
                    <Label>Filtrar por RUT Beneficiario</Label>
                    <Input 
                      placeholder="Ej: 12.345.678-9" 
                      value={filterRut} 
                      onChange={e => setFilterRut(e.target.value)} 
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Label>Filtrar por Profesional</Label>
                    <Select value={filterProf} onValueChange={setFilterProf}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {professionals.map(p => (
                          <SelectItem key={p.rut} value={p.rut}>{p.firstName} {p.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Label>Fecha de Entrega</Label>
                    <Input 
                      type="date" 
                      value={filterDate} 
                      onChange={e => setFilterDate(e.target.value)} 
                    />
                  </div>
                  <div className="flex items-end">
                    <Button variant="ghost" onClick={() => {setFilterRut(''); setFilterProf('all'); setFilterDate('')}}>
                      Limpiar
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Beneficiario</TableHead>
                      <TableHead>Ayuda</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Profesional</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAidRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">No se encontraron registros</TableCell>
                      </TableRow>
                    ) : (
                      filteredAidRecords.map((record) => (
                        <TableRow key={record.folio}>
                          <TableCell className="font-mono">{record.folio}</TableCell>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.beneficiaryName}</p>
                              <p className="text-xs text-muted-foreground">{record.beneficiaryRut}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{record.aidType}</p>
                            <p className="text-xs text-muted-foreground">{record.product}</p>
                          </TableCell>
                          <TableCell>${record.value.toLocaleString('es-CL')}</TableCell>
                          <TableCell>{record.professionalId}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}