'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { isAddress } from 'viem';
import type { Transaction } from '@/lib/types';
import { useTransactions } from '@/lib/useTransactions';
import { formatNumber, truncateAddress } from '@/lib/utils';

dayjs.extend(relativeTime);

export function TxnTable() {
	const [poolInput, setPoolInput] = useState('0x9a4b641dbAd8F208952F34fb76ed664E28e0b514');
	const [poolAddress, setPoolAddress] = useState('0x9a4b641dbAd8F208952F34fb76ed664E28e0b514');
	const [token0, setToken0] = useState('');
	const [token1, setToken1] = useState('');

	const { isLoading, transactions } = useTransactions({ pool: poolAddress });

	useEffect(() => {
		if (transactions?.length) {
			setToken0(transactions[0].token0.symbol);
			setToken1(transactions[0].token1.symbol);
		}
	}, [transactions]);

	function handlePoolSubmit() {
		if (isAddress(poolInput.trim())) setPoolAddress(poolInput);
		else alert('Invalid pool address');
	}

	return (
		<div className='max-w-4xl mx-auto w-full'>
			<div className='mb-4 flex flex-col gap-2'>
				<div className='flex flex-col'>
					<label>Pool Address</label>
					<div className='flex items-stretch gap-2'>
						<input
							type='text'
							defaultValue={poolAddress}
							onChange={(e) => setPoolInput(e.target.value)}
							placeholder='Enter a pool address'
							className='px-4 grow py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
						/>
						<button
							onClick={handlePoolSubmit}
							className='bg-black hover:bg-zinc-800 text-white transition rounded-lg px-5'>
							Get Pool
						</button>
					</div>
				</div>
			</div>

			<table className='min-w-full bg-black text-white border border-gray-800 rounded-lg overflow-hidden'>
				<thead>
					<tr className='border-b border-gray-700'>
						<th className='px-4 py-2 text-left max-w-[200px]'>Time</th>
						<th className='px-4 py-2 text-left'>Type</th>
						<th className='px-4 py-2 text-right'>USD</th>
						<th className='px-4 py-2 text-right'>{isLoading ? '' : token0}</th>
						<th className='px-4 py-2 text-right'>{isLoading ? '' : token1}</th>
						<th className='px-4 py-2 text-right'>Wallet</th>
					</tr>
				</thead>

				<tbody>
					{isLoading ? (
						<tr>
							<td className='px-4 py-2' colSpan={6}>
								Loading...
							</td>
						</tr>
					) : transactions.length ? (
						transactions.map((txn: Transaction, i) => {
							const isSell = Number(txn.token0Quantity) > 0;
							return (
								<tr key={i} className='border-b border-gray-800'>
									<td className='px-4 py-2 max-w-[200px]'>
										<Link
											href={`https://basescan.org/tx/${txn.hash}`}
											target='_blank'
											className='group hover:underline flex gap-2 items-center w-fit'>
											{dayjs.unix(txn.timestamp).fromNow()}

											<svg
												xmlns='http://www.w3.org/2000/svg'
												width='16'
												height='16'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
												className='lucide lucide-external-link mt-0.5 opacity-0 group-hover:opacity-100 transition'>
												<path d='M15 3h6v6' />
												<path d='M10 14 21 3' />
												<path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
											</svg>
										</Link>
									</td>
									<td className={`px-4 py-2 ${isSell ? 'text-red-500' : 'text-green-500'}`}>
										{isSell ? 'Sell' : 'Buy'} {token0}
									</td>
									<td className='px-4 py-2 text-right'>{formatNumber(txn.usdValue.value, true)}</td>
									<td className='px-4 py-2 text-right'>
										{formatNumber(Math.abs(Number(txn.token0Quantity)))}
									</td>
									<td className='px-4 py-2 text-right'>
										{formatNumber(Math.abs(Number(txn.token1Quantity)))}
									</td>
									<td className='px-4 py-2 text-right'>
										<Link
											href={`https://basescan.org/address/${txn.account}`}
											target='_blank'
											className='hover:underline'>
											{truncateAddress(txn.account)}
										</Link>
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td className='px-4 py-2' colSpan={6}>
								No transactions found
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
