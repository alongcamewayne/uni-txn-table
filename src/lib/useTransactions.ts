import { useEffect, useState } from 'react';
import { isAddress } from 'viem';
import type { Transaction } from './types';
import { getTransactionData } from './getTranscationData';

type UseTransactionsArgs = {
	pool: string;
};

export function useTransactions({ pool }: UseTransactionsArgs) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (isAddress(pool)) {
			setIsLoading(true);
			getTransactionData({ pool })
				.then((data) => {
					setTransactions(data.transactions);
				})
				.finally(() => setIsLoading(false));
		} else {
			setTransactions([]);
			setIsLoading(false);
		}
	}, [pool]);

	return { transactions, isLoading };
}
