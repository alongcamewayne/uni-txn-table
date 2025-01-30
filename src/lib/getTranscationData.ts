'use server';

import { Hex } from 'viem';
import { Root } from './types';

const subgraph = 'https://interface.gateway.uniswap.org/v1/graphql';

export async function getTransactionData({ pool }: { pool: Hex }) {
	const response = await fetch(subgraph, {
		method: 'post',
		headers: {
			'content-type': 'application/json',
			origin: 'https://app.uniswap.org',
		},
		body: JSON.stringify(payload).replace('POOL_ADDRESS', pool),
	});

	if (!response.ok) throw new Error('Failed to fetch transaction data');

	return ((await response.json()) as Root).data.v3Pool;
}

const payload = {
	operationName: 'V3PoolTransactions',
	variables: {
		first: 25,
		chain: 'BASE',
		address: 'POOL_ADDRESS',
	},
	query: `
			query V3PoolTransactions($chain: Chain!, $address: String!, $first: Int!, $cursor: Int) {
					v3Pool(chain: $chain, address: $address) {
							id
							transactions(first: $first, timestampCursor: $cursor) {
									timestamp
									hash
									account
									token0 {
											id
											address
											symbol
											chain
											decimals
											project {
													id
													name
													logo {
															id
															url
													}
											}
									}
									token0Quantity
									token1 {
											id
											address
											symbol
											chain
											decimals
											project {
													id
													name
													logo {
															id
															url
													}
											}
									}
									token1Quantity
									usdValue {
											value
									}
									type
							}
					}
			}
	`,
};
