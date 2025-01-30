export interface Root {
	data: Data;
}

export interface Data {
	v3Pool: V3Pool;
}

export interface V3Pool {
	id: string;
	transactions: Transaction[];
}

export interface Transaction {
	timestamp: number;
	hash: string;
	account: string;
	token0: Token0;
	token0Quantity: string;
	token1: Token1;
	token1Quantity: string;
	usdValue: UsdValue;
	type: string;
}

export interface Token0 {
	id: string;
	address: string;
	symbol: string;
	chain: string;
	decimals: number;
	project: Project;
}

export interface Project {
	id: string;
	name: string;
	logo: Logo;
}

export interface Logo {
	id: string;
	url: string;
}

export interface Token1 {
	id: string;
	address: string;
	symbol: string;
	chain: string;
	decimals: number;
	project: Project2;
}

export interface Project2 {
	id: string;
	name: string;
	logo: Logo2;
}

export interface Logo2 {
	id: string;
	url: string;
}

export interface UsdValue {
	value: number;
}
