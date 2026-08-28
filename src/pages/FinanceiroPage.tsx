import { useState, useMemo } from 'react';
import { DollarSign, QrCode, Copy, FileText, CheckCircle2, Clock, TrendingUp, Wallet } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast';
import type { Payment } from '@/types';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export function FinanceiroPage() {
  const { data, markPaymentPaid } = useData();
  const { showToast } = useToast();
  const [pixModal, setPixModal] = useState<Payment | null>(null);
  const [filter, setFilter] = useState<string>('todos');

  const stats = useMemo(() => {
    const monthlyPayments = data.payments.filter((p) => p.type === 'mensalidade');
    const expected = monthlyPayments.reduce((s, p) => s + p.amount, 0);
    const received = monthlyPayments.filter((p) => p.status === 'pago').reduce((s, p) => s + p.amount, 0);
    const pending = monthlyPayments.filter((p) => p.status === 'pendente' || p.status === 'atrasado').reduce((s, p) => s + p.amount, 0);
    const fee = received * 0.05;
    const net = received - fee;
    return { expected, received, pending, fee, net };
  }, [data.payments]);

  const filteredPayments = data.payments.filter((p) => {
    if (filter === 'todos') return true;
    return p.status === filter;
  });

  const typeLabels: Record<string, string> = {
    mensalidade: 'Mensalidade',
    convidado: 'Taxa de convidado',
    goleiro: 'Goleiro',
    ativacao: 'Ativação',
  };

  const copyPix = (code: string) => {
    navigator.clipboard.writeText(code).then(() => showToast('success', 'Código PIX copiado!'));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard label="Receita Prevista" value={`R$ ${stats.expected.toFixed(0)}`} icon={<TrendingUp size={22} />} accent="green" />
        <StatCard label="Recebido" value={`R$ ${stats.received.toFixed(0)}`} icon={<CheckCircle2 size={22} />} accent="blue" />
        <StatCard label="Pendente" value={`R$ ${stats.pending.toFixed(0)}`} icon={<Clock size={22} />} accent="yellow" />
        <StatCard label="Taxa Flamilia (5%)" value={`R$ ${stats.fee.toFixed(2)}`} icon={<DollarSign size={22} />} accent="red" />
        <StatCard label="Saldo Líquido" value={`R$ ${stats.net.toFixed(2)}`} icon={<Wallet size={22} />} accent="green" subtitle="Para a pelada" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {['todos', 'pago', 'pendente', 'atrasado', 'isento', 'liberado'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all capitalize ${
              filter === f ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Payment list */}
      <div className="space-y-2">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{payment.memberName}</p>
                <p className="text-sm text-gray-500">{typeLabels[payment.type]} - R$ {payment.amount.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Venc: {new Date(payment.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge type={payment.status} />
                <div className="flex gap-1">
                  {payment.status !== 'pago' && payment.status !== 'isento' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setPixModal(payment)}>
                        <QrCode size={16} /> PIX
                      </Button>
                      <Button size="sm" variant="success" onClick={() => { markPaymentPaid(payment.id); showToast('success', 'Pagamento registrado!'); }}>
                        Pago
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* PIX Modal */}
      <Modal open={!!pixModal} onClose={() => setPixModal(null)} title="Pagamento via PIX">
        {pixModal && <PixModal payment={pixModal} onCopy={copyPix} onPaid={() => { markPaymentPaid(pixModal.id); setPixModal(null); showToast('success', 'Pagamento confirmado! Status atualizado para Liberado.'); }} />}
      </Modal>
    </div>
  );
}

function PixModal({ payment, onCopy, onPaid }: { payment: Payment; onCopy: (code: string) => void; onPaid: () => void }) {
  const [method, setMethod] = useState<'pix' | 'boleto'>('pix');
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136FLAMILIA${payment.id}5204000053039865802BR5913FLAMILIA6009SAO_PAULO62070503***6304${payment.id.slice(-4)}`;
  const boletoCode = `23793${payment.id.slice(-6)}8 ${payment.amount.toFixed(2).replace('.', ',')} 2${payment.dueDate.replace(/-/g, '').slice(-4)}`;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-gray-500 text-sm">{payment.memberName}</p>
        <p className="text-2xl font-bold text-gray-900">R$ {payment.amount.toFixed(2)}</p>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setMethod('pix')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${method === 'pix' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
        >
          PIX
        </button>
        <button
          onClick={() => setMethod('boleto')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${method === 'boleto' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
        >
          Boleto
        </button>
      </div>

      {method === 'pix' ? (
        <div className="space-y-3">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0.5 p-2 opacity-80">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'} rounded-sm`} />
                ))}
              </div>
              <div className="relative z-10 w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <QrCode size={28} className="text-gray-900" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Código PIX copia e cola:</p>
            <div className="flex gap-2 items-start">
              <p className="text-xs text-gray-700 font-mono break-all flex-1">{pixCode}</p>
              <button onClick={() => onCopy(pixCode)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 shrink-0">
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={20} className="text-blue-600" />
              <p className="font-medium text-gray-800">Boleto bancário</p>
            </div>
            <p className="text-sm font-mono text-gray-600 break-all">{boletoCode}</p>
          </div>
          <p className="text-xs text-gray-400">Vencimento em 3 dias úteis. Após o pagamento, o status será atualizado automaticamente.</p>
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
        Demonstração - No futuro, esta cobrança será integrada ao Asaas para processamento automático.
      </div>

      <Button fullWidth size="lg" variant="success" onClick={onPaid}>
        <CheckCircle2 size={20} /> Confirmar pagamento
      </Button>
    </div>
  );
}
