import { useWallet, Transaction } from '@/hooks/useWallet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight, Dices, TrendingDown, TrendingUp } from 'lucide-react';

const TYPE_CONFIG = {
  deposit: {
    icon: ArrowDownLeft,
    label: 'Depósito',
    color: 'bg-green-500/10 text-green-500',
    badgeColor: 'bg-green-500/20 text-green-600',
  },
  withdrawal: {
    icon: ArrowUpRight,
    label: 'Saque',
    color: 'bg-red-500/10 text-red-500',
    badgeColor: 'bg-red-500/20 text-red-600',
  },
  bet_placed: {
    icon: Dices,
    label: 'Aposta Colocada',
    color: 'bg-blue-500/10 text-blue-500',
    badgeColor: 'bg-blue-500/20 text-blue-600',
  },
  bet_won: {
    icon: TrendingUp,
    label: 'Aposta Vencida',
    color: 'bg-emerald-500/10 text-emerald-500',
    badgeColor: 'bg-emerald-500/20 text-emerald-600',
  },
  bet_lost: {
    icon: TrendingDown,
    label: 'Aposta Perdida',
    color: 'bg-orange-500/10 text-orange-500',
    badgeColor: 'bg-orange-500/20 text-orange-600',
  },
};

interface TransactionHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransactionHistory({ open, onOpenChange }: TransactionHistoryProps) {
  const { getTransactionHistory, getTotalDeposited, getTotalWithdrawn, balance } = useWallet();
  const transactions = getTransactionHistory();
  const totalDeposited = getTotalDeposited();
  const totalWithdrawn = getTotalWithdrawn();
  const totalNetGains = balance - totalDeposited + totalWithdrawn;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getTransactionAmount = (transaction: Transaction) => {
    if (transaction.type === 'bet_lost') {
      return `-R$ ${transaction.amount.toFixed(2)}`;
    }
    if (transaction.type === 'bet_placed') {
      return `-R$ ${transaction.amount.toFixed(2)}`;
    }
    if (transaction.type === 'withdrawal') {
      return `-R$ ${transaction.amount.toFixed(2)}`;
    }
    return `+R$ ${transaction.amount.toFixed(2)}`;
  };

  const getAmountColor = (transaction: Transaction) => {
    if (transaction.type === 'deposit' || transaction.type === 'bet_won') {
      return 'text-green-500';
    }
    return 'text-red-500';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Transações</DialogTitle>
          <DialogDescription>
            Todas as suas transações, apostas e movimentações de saldo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-card/50 border-border/50 p-4">
              <p className="text-xs text-muted-foreground mb-2">Saldo Atual</p>
              <p className="text-xl font-bold text-foreground">R$ {balance.toFixed(2)}</p>
            </Card>
            <Card className="bg-green-500/10 border-green-500/30 p-4">
              <p className="text-xs text-green-600 mb-2">Total Depositado</p>
              <p className="text-xl font-bold text-green-500">R$ {totalDeposited.toFixed(2)}</p>
            </Card>
            <Card className="bg-red-500/10 border-red-500/30 p-4">
              <p className="text-xs text-red-600 mb-2">Total Sacado</p>
              <p className="text-xl font-bold text-red-500">R$ {totalWithdrawn.toFixed(2)}</p>
            </Card>
            <Card className={`${totalNetGains >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-orange-500/10 border-orange-500/30'} p-4`}>
              <p className={`text-xs mb-2 ${totalNetGains >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                Ganho Líquido
              </p>
              <p className={`text-xl font-bold ${totalNetGains >= 0 ? 'text-emerald-500' : 'text-orange-500'}`}>
                R$ {totalNetGains.toFixed(2)}
              </p>
            </Card>
          </div>

          {/* Tabela de Transações */}
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-background/50 border-b border-border/50">
                <TableRow>
                  <TableHead className="text-foreground">Tipo</TableHead>
                  <TableHead className="text-foreground">Descrição</TableHead>
                  <TableHead className="text-foreground text-right">Valor</TableHead>
                  <TableHead className="text-foreground text-right">Saldo</TableHead>
                  <TableHead className="text-foreground text-right">Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma transação registrada
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => {
                    const config = TYPE_CONFIG[transaction.type];
                    const Icon = config.icon;
                    const { date, time } = formatDate(transaction.timestamp);
                    const amount = getTransactionAmount(transaction);
                    const amountColor = getAmountColor(transaction);

                    return (
                      <TableRow key={transaction.id} className="hover:bg-background/50 border-b border-border/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${config.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">{config.label}</p>
                            <p className="text-xs text-muted-foreground">{transaction.description}</p>
                            {transaction.method && (
                              <p className="text-xs text-muted-foreground">via {transaction.method}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className={`font-semibold ${amountColor}`}>{amount}</p>
                          <Badge variant="outline" className={config.badgeColor}>
                            {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            R$ {transaction.balance_after.toFixed(2)}
                          </p>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          <p>{date}</p>
                          <p>{time}</p>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Nota */}
          <p className="text-xs text-muted-foreground bg-background/50 p-3 rounded-lg text-center">
            📋 Todas as suas transações são registradas e seguras
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
