import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CreditCard, DollarSign, Landmark, Smartphone } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Cartão de Crédito', icon: CreditCard, color: 'bg-blue-500/10 text-blue-500' },
  { id: 'bank', label: 'Transferência Bancária', icon: Landmark, color: 'bg-green-500/10 text-green-500' },
  { id: 'pix', label: 'PIX', icon: DollarSign, color: 'bg-purple-500/10 text-purple-500' },
  { id: 'wallet', label: 'Carteira Digital', icon: Smartphone, color: 'bg-orange-500/10 text-orange-500' },
];

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const { deposit } = useWallet();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label || selectedMethod;
    
    const result = await deposit(parseFloat(amount), method);
    
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setAmount('');
        setSuccess(false);
        onOpenChange(false);
      }, 2000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-gradient-to-b from-green-950/50 to-background border-green-500/30">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-green-500/40 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-green-500">Depósito Realizado!</h3>
              <p className="text-muted-foreground">R$ {parseFloat(amount).toFixed(2)} adicionado à sua conta</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gold" />
            Fazer Depósito
          </DialogTitle>
          <DialogDescription>
            Escolha o método de pagamento e o valor para depositar em sua conta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Métodos de Pagamento */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Método de Pagamento</label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedMethod === method.id
                        ? 'border-gold bg-gold/10'
                        : 'border-border hover:border-gold/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-2 ${method.color}`} />
                    <p className="text-xs font-medium text-foreground text-center">{method.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Montantes Predefinidos */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Valor Rápido</label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className={`py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
                    amount === preset.toString()
                      ? 'bg-gold text-background border-gold'
                      : 'bg-background border-border hover:border-gold text-foreground'
                  }`}
                >
                  R$ {preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Input Customizado */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Valor Customizado</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                type="number"
                placeholder="Digite o valor"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 pr-3"
                min="10"
                max="100000"
              />
            </div>
            {amount && (
              <p className="text-xs text-muted-foreground">
                Mínimo: R$ 10 | Máximo: R$ 100.000
              </p>
            )}
          </div>

          {/* Resumo */}
          {amount && (
            <Card className="bg-card/50 border-border/50 p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor do Depósito:</span>
                <span className="text-lg font-bold text-gold">R$ {parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Taxa:</span>
                <span className="text-sm">Grátis</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-semibold">Total a Receber:</span>
                <span className="text-lg font-bold text-green-500">R$ {parseFloat(amount).toFixed(2)}</span>
              </div>
            </Card>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={!amount || parseFloat(amount) <= 0 || loading}
              className="flex-1 bg-gold hover:bg-gold/90"
            >
              {loading ? 'Processando...' : 'Confirmar Depósito'}
            </Button>
          </div>

          {/* Aviso de Segurança */}
          <p className="text-xs text-muted-foreground text-center bg-background/50 p-3 rounded-lg">
            💳 Sua informação de pagamento é segura e criptografada
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
