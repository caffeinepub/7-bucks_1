import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { AlertCircle, Loader2, Receipt } from 'lucide-react';
import { Transaction, Variant_pending_success_failed } from '../../backend';

export default function AdminTransactionsPage() {
  const { actor, isFetching: actorFetching } = useActor();

  const { data: transactions, isLoading, isError, error } = useQuery<Transaction[]>({
    queryKey: ['allTransactions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllTransactions();
    },
    enabled: !!actor && !actorFetching,
  });

  const getStatusBadge = (status: Variant_pending_success_failed) => {
    switch (status) {
      case Variant_pending_success_failed.success:
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Success</Badge>;
      case Variant_pending_success_failed.pending:
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Pending</Badge>;
      case Variant_pending_success_failed.failed:
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (nanos: bigint) => {
    const millis = Number(nanos) / 1_000_000;
    return new Date(millis).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-muted-foreground">
          View all payment transactions processed through 7 Bucks
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <CardTitle>Recent Transactions</CardTitle>
          </div>
          <CardDescription>
            All transactions are listed below. Sensitive card data is never stored.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to load transactions'}
              </AlertDescription>
            </Alert>
          )}

          {transactions && transactions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
            </div>
          )}

          {transactions && transactions.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount (USD)</TableHead>
                    <TableHead>Charged</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-sm">
                        {formatDate(tx.timestampNanos)}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${(Number(tx.amountUsd) / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${(Number(tx.totalCharged) / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {tx.contiPayReference || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
