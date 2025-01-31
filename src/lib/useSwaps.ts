import { useEffect, useState } from 'react';
import { isAddress } from 'viem';
import type { Swap } from './types';
import { getSwaps } from './getSwapData';

type UseSwapsArgs = {
	pool: string;
	wallet?: string;
};

export function useSwaps({ pool, wallet }: UseSwapsArgs) {
	const [swaps, setSwaps] = useState<Swap[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (isAddress(pool)) {
			setIsLoading(true);
			getSwaps({ pool, wallet })
				.then(setSwaps)
				.finally(() => setIsLoading(false));
		} else {
			setSwaps([]);
			setIsLoading(false);
		}
	}, [pool, wallet]);

	return { swaps, isLoading };
}
