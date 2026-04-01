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
import { CreditCard, DollarSign, Landmark, Smartphone, AlertCircle } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Cartão de Crédito', icon: CreditCard, color: 'bg-blue-500/10 text-blue-500' },
  { id: 'bank', label: 'Transferência Bancária', icon: Landmark, color: 'bg-green-500/10 text-green-500' },
  { id: 'pix', label: 'PIX', icon: DollarSign, color: 'bg-purple-500/10 text-purple-500' },
  { id: 'wallet', label: 'Carteira Digital', icon: Smartphone, color: 'bg-orange-500/10 text-orange-500' },
];

const WITHDRAWAL_LIMITS = {
  min: 50,
  max: 50000,
  daily: 100000,
};

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const { withdraw, balance } = useWallet();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('bank');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (!amount || withdrawAmount <= 0) return;
    if (withdrawAmount < WITHDRAWAL_LIMITS.min || withdrawAmount > WITHDRAWAL_LIMITS.max) return;
    if (withdrawAmount > balance) return;

    setLoading(true);
    const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label || selectedMethod;
    
    const result = await withdraw(withdrawAmount, method);
    
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

  const withdrawAmount = amount ? parseFloat(amount) : 0;
  const processingDays = selectedMethod === 'pix' ? '0-2 horas' : '1-3 dias úteis';

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-gradient-to-b from-blue-950/50 to-background border-blue-500/30">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-blue-500/40 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-500"
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
              <h3 className="text-lg font-bold text-blue-500">Saque Solicitado!</h3>
              <p className="text-muted-foreground">R$ {withdrawAmount.toFixed(2)} será transferido para sua conta</p>
              <p className="text-xs text-muted-foreground mt-2">Tempo de processamento: {processingDays}</p>
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
            <DollarSign className="w-5 h-5 text-primary" />
            Sacar Fundos
          </DialogTitle>
          <DialogDescription>
            Retire seus ganhos de forma segura e rápida
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Saldo Disponível */}
          <Card className="bg-primary/10 border-primary/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Disponível</p>
                <p className="text-2xl font-bold text-foreground">R$ {balance.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Métodos de Saque */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Método de Saque</label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-2 ${method.color}`} />
                    <p className="text-xs font-medium text-foreground text-center">{method.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Informações de Saque */}
          <div className="bg-background/50 border border-border/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <p className="font-medium text-foreground">Limites de Saque</p>
                <p className="text-muted-foreground">
                  Mínimo: R$ {WITHDRAWAL_LIMITS.min} | Máximo: R$ {WITHDRAWAL_LIMITS.max.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Input de Valor */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Valor a Sacar</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                type="number"
                placeholder="Digite o valor"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 pr-3"
                min={WITHDRAWAL_LIMITS.min}
                max={Math.min(WITHDRAWAL_LIMITS.max, balance)}
              />
            </div>
            {amount && (
              <div className="text-xs text-muted-foreground">
                {withdrawAmount < WITHDRAWAL_LIMITS.min && (
                  <p className="text-red-500">Valor inferior ao mínimo de R$ {WITHDRAWAL_LIMITS.min}</p>
                )}
                {withdrawAmount > WITHDRAWAL_LIMITS.max && (
                  <p className="text-red-500">Valor superior ao máximo de R$ {WITHDRAWAL_LIMITS.max.toLocaleString()}</p>
                )}
                {withdrawAmount > balance && (
                  <p className="text-red-500">Saldo insuficiente</p>
                )}
              </div>
            )}
          </div>

          {/* Resumo */}
          {amount && withdrawAmount >= WITHDRAWAL_LIMITS.min && withdrawAmount <= Math.min(WITHDRAWAL_LIMITS.max, balance) && (
            <Card className="bg-card/50 border-border/50 p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor a Sacar:</span>
                <span className="text-lg font-bold text-foreground">R$ {withdrawAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Taxa:</span>
                <span className="text-sm">Grátis</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tempo de Processamento:</span>
                <span className="text-sm font-medium">{processingDays}</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-semibold">Saldo Após Saque:</span>
                <span className="text-lg font-bold text-foreground">R$ {(balance - withdrawAmount).toFixed(2)}</span>
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
              onClick={handleWithdraw}
              disabled={
                !amount ||
                withdrawAmount <= 0 ||
                withdrawAmount < WITHDRAWAL_LIMITS.min ||
                withdrawAmount > Math.min(WITHDRAWAL_LIMITS.max, balance) ||
                loading
              }
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? 'Processando...' : 'Solicitar Saque'}
            </Button>
          </div>

          {/* Aviso de Segurança */}
          <p className="text-xs text-muted-foreground text-center bg-background/50 p-3 rounded-lg">
            🔒 Todos os saques são protegidos e criptografados
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
