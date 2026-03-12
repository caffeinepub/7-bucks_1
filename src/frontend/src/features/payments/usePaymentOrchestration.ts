import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { Transaction } from "../../backend";
import { useActor } from "../../hooks/useActor";

interface PaymentInput {
  cardNumber: string;
  cvv: string;
  expiry: string;
  ecoCashNumber: string;
  amount: number;
}

export function usePaymentOrchestration() {
  const { actor } = useActor();
  const [result, setResult] = useState<Transaction | null>(null);

  const mutation = useMutation({
    mutationFn: async (input: PaymentInput) => {
      if (!actor) throw new Error("Actor not available");

      const transactionId = `7B_${input.cardNumber.slice(-4)}_${Date.now()}`;
      const amountUsd = BigInt(Math.round(input.amount * 100));

      const transaction = await actor.orchestratePayment(
        transactionId,
        amountUsd,
        input.ecoCashNumber,
      );

      return transaction;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const reset = () => {
    setResult(null);
    mutation.reset();
  };

  return {
    initiatePayment: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    result,
    reset,
  };
}
