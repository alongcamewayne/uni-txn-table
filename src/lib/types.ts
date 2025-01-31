export interface QueryData {
	data: {
		v3Pool: {
			id: string;
			transactions: Transaction[];
		};
	};
}

export interface Transaction {
	timestamp: number;
	hash: string;
	account: string;
	token0: Token;
	token0Quantity: string;
	token1: Token;
	token1Quantity: string;
	usdValue: { value: number };
	type: string;
}

export interface Token {
	id: string;
	address: string;
	symbol: string;
	chain: string;
	decimals: number;
	project: { id: string; name: string; logo: { id: string; url: string } };
}

export interface RawSwap {
	account: { id: string };
	amountIn: string;
	amountOut: string;
	amountOutUSD: string;
	id: string;
	timestamp: string;
	tokenIn: { symbol: string };
	tokenOut: { symbol: string };
}

export interface Swap {
	amountIn: string;
	amountOut: string;
	usdValue: string;
	hash: string;
	timestamp: number;
	tokenA: string;
	tokenB: string;
	tokenSold: string;
	wallet: string;
}
