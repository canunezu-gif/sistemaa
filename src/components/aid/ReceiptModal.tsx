import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { AidRecord } from '@/types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AidRecord | null;
}

export function ReceiptModal({ isOpen, onClose, record }: ReceiptModalProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Recibo-${record?.folio}`,
  });

  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Comprobante de Entrega</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 my-4">
          {/* Printable Area */}
          <div 
            ref={componentRef} 
            className="w-full bg-white p-8 border border-gray-200 text-sm font-sans"
            style={{ minHeight: '500px' }}
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <img src="/assets/municipal-seal.png" alt="Municipalidad" className="h-16 w-16 object-contain" />
                <div>
                  <h2 className="font-bold text-lg uppercase">Municipalidad de San Pedro</h2>
                  <p className="font-semibold">Dirección de Desarrollo Comunitario</p>
                  <p className="text-xs text-gray-500">Gestión de Ayudas Sociales</p>
                </div>
              </div>
              <div className="text-right">
                <div className="border-2 border-red-600 text-red-600 px-3 py-1 font-bold text-xl rounded">
                  FOLIO N° {record.folio.toString().padStart(6, '0')}
                </div>
                <p className="mt-2 text-gray-600">{new Date(record.date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold underline decoration-2 underline-offset-4">RECIBO DE AYUDA SOCIAL</h1>
            </div>

            {/* Body */}
            <div className="space-y-6 px-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b border-gray-300 pb-1">
                  <span className="font-bold w-32">Beneficiario:</span>
                  <span className="flex-1 uppercase">{record.beneficiaryName}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-1">
                  <span className="font-bold w-32">RUT:</span>
                  <span className="flex-1">{record.beneficiaryRut}</span>
                </div>
              </div>

              <div className="mt-8 border border-gray-300 rounded p-4 bg-gray-50">
                <h3 className="font-bold mb-4 border-b border-gray-300 pb-2">Detalle del Beneficio</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold block text-xs text-gray-500">Tipo de Ayuda</span>
                    <p>{record.aidType}</p>
                  </div>
                  <div>
                    <span className="font-bold block text-xs text-gray-500">Producto / Servicio</span>
                    <p>{record.product}</p>
                  </div>
                  <div>
                    <span className="font-bold block text-xs text-gray-500">Cantidad</span>
                    <p>{record.quantity}</p>
                  </div>
                  <div>
                    <span className="font-bold block text-xs text-gray-500">Valor Estimado</span>
                    <p>${record.value.toLocaleString('es-CL')}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold block text-xs text-gray-500">Observaciones / Prescripción</span>
                    <p className="italic">{record.detail}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-between items-end pt-12">
                <div className="text-center w-64">
                  <div className="border-t border-gray-400 pt-2">
                    <p className="font-bold uppercase">{record.receiverName}</p>
                    <p className="text-xs text-gray-500">Nombre y Firma de quien retira</p>
                  </div>
                </div>
                
                <div className="text-center w-64">
                  <div className="border-t border-gray-400 pt-2">
                    <p className="font-bold">Profesional DIDECO</p>
                    <p className="text-xs text-gray-500">Firma y Timbre</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 text-center text-xs text-gray-400 border-t pt-4">
              <p>Este documento acredita la entrega de beneficio social municipal.</p>
              <p>Municipalidad de San Pedro - DIDECO</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
          <Button onClick={() => handlePrint && handlePrint()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Comprobante
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}