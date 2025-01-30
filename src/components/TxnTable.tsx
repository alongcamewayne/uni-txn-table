'use client';

import { useState } from 'react';
// import { isAddress } from 'viem';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { Transaction } from '@/lib/types';

dayjs.extend(relativeTime);

function formatUsd(number: number) {
	const opts: Intl.NumberFormatOptions = {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	};

	return new Intl.NumberFormat('en-US', opts).format(number);
}

function formatNumber(number: number) {
	const opts: Intl.NumberFormatOptions = {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	};

	return new Intl.NumberFormat('en-US', opts).format(number);
}

export function TxnTable({ transactions }: { transactions: Transaction[] }) {
	const token0 = transactions[0].token0;
	const token1 = transactions[0].token1;
	const [txnList] = useState<Transaction[]>(transactions);
	// const [addressFilter, setAddressFilter] = useState<string>('');

	// function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
	// 	setAddressFilter(e.target.value);
	// 	console.log(e.target.value, addressFilter);
	// 	if (isAddress(addressFilter)) {
	// 		console.log('filtering...');
	// 		setTxnList(transactions.filter((txn) => txn.account === addressFilter));
	// 	} else setTxnList(transactions);
	// }

	return (
		<div className='max-w-4xl mx-auto'>
			{/* <input
				type='text'
				value={addressFilter}
				onChange={handleAddressChange}
				placeholder='A wallet address'
			/> */}

			<table className='min-w-full bg-black text-white border border-gray-800 rounded-lg overflow-hidden'>
				<thead>
					<tr className='border-b border-gray-700'>
						<th className='px-4 py-2 text-left'>Time</th>
						<th className='px-4 py-2 text-left'>Type</th>
						<th className='px-4 py-2 text-left'>USD</th>
						<th className='px-4 py-2 text-left'>{token0.symbol}</th>
						<th className='px-4 py-2 text-left'>{token1.symbol}</th>
					</tr>
				</thead>
				<tbody>
					{txnList.map((txn: Transaction) => {
						const isSell = Number(txn.token0Quantity) < 0;
						return (
							<tr key={txn.hash} className='border-b border-gray-800'>
								<td className='px-4 py-2'>{dayjs.unix(txn.timestamp).fromNow()}</td>
								<td className={`px-4 py-2 ${isSell ? 'text-red-500' : 'text-green-500'}`}>
									{isSell ? 'Sell' : 'Buy'} {token0.symbol}
								</td>
								<td className='px-4 py-2'>{formatUsd(txn.usdValue.value)}</td>
								<td className='px-4 py-2'>{formatNumber(Math.abs(Number(txn.token0Quantity)))}</td>
								<td className='px-4 py-2'>{formatNumber(Math.abs(Number(txn.token1Quantity)))}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
