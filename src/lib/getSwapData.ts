'use server';

import { isAddress, getAddress } from 'viem';
import type { RawSwap, Swap } from './types';

type GetSwapsArgs = {
	pool: string;
	wallet?: string;
};

const subgraph = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/FUbEPQw1oMghy39fwWBFY5fE6MXPXZQtjncQy2cXdrNS`;

export async function getSwaps({ pool, wallet }: GetSwapsArgs) {
	if (!isAddress(pool)) throw new Error('Invalid pool address');
	if (wallet && !isAddress(wallet)) throw new Error('Invalid wallet address');

	const variables = {
		poolAddress: getAddress(pool),
		walletAddress: wallet ? getAddress(wallet) : '',
		first: 25,
		skip: 0,
	};

	const response = await fetch(subgraph, {
		method: 'post',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ query, variables }).replace(
			'ACCOUNT_FILTER',
			wallet ? ', account: $walletAddress' : ''
		),
	});

	if (!response.ok) throw new Error('Failed to fetch swap data');
	const { data } = await response.json();

	const swaps: Swap[] = data.swaps.map((swap: RawSwap): Swap => {
		const { tokenIn, tokenOut } = swap;
		const tokenA = tokenIn.symbol < tokenOut.symbol ? tokenIn.symbol : tokenOut.symbol;
		const tokenB = tokenIn.symbol < tokenOut.symbol ? tokenOut.symbol : tokenIn.symbol;

		return {
			hash: swap.id,
			timestamp: Number(swap.timestamp),
			tokenA,
			tokenB,
			tokenSold: tokenIn.symbol,
			amountIn: tokenA === tokenIn.symbol ? swap.amountIn : swap.amountOut,
			amountOut: tokenA === tokenIn.symbol ? swap.amountOut : swap.amountIn,
			usdValue: swap.amountOutUSD,
			wallet: swap.account.id,
		};
	});

	return swaps;
}

const query = `
query GetSwaps($poolAddress: Bytes!, $walletAddress: Bytes, $first: Int, $skip: Int) {
  swaps(
    first: $first
    skip: $skip
    orderBy: timestamp
    orderDirection: desc
    where: {
      pool: $poolAddress
			ACCOUNT_FILTER
    }
  ) {
    id
    timestamp
    tokenIn {
      symbol
    }
    tokenOut {
      symbol
    }
    amountIn
    amountOut
    amountOutUSD
    account {
      id
    }
  }
}
	`;
