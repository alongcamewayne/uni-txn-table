'use client';

import { useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { formatEther, isAddress } from 'viem';
import { useSwaps } from '@/lib/useSwaps';
import { formatNumber, truncateAddress } from '@/lib/utils';

dayjs.extend(relativeTime);

export function TxnTableWithFilter() {
	const [poolInput, setPoolInput] = useState('0x9a4b641dbAd8F208952F34fb76ed664E28e0b514');
	const [walletInput, setWalletInput] = useState('');
	const [poolAddress, setPoolAddress] = useState('0x9a4b641dbAd8F208952F34fb76ed664E28e0b514');
	const [walletAddress, setWalletAddress] = useState('');

	const { isLoading, swaps } = useSwaps({ pool: poolAddress, wallet: walletAddress });

	function handlePoolSubmit() {
		if (isAddress(poolInput.trim())) setPoolAddress(poolInput);
		else alert('Invalid pool address');
	}

	function handleFilterSubmit() {
		if (isAddress(walletInput)) setWalletAddress(walletInput);
		else alert('Invalid wallet address');
	}

	function handleFilterClear() {
		const el = document.getElementById('walletInput') as HTMLInputElement;
		if (el) el.value = '';
		setWalletInput('');
		setWalletAddress('');
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

				<div className='flex flex-col'>
					<label>Filter by Wallet</label>
					<div className='flex items-stretch gap-2'>
						<input
							id='walletInput'
							type='text'
							defaultValue={walletAddress}
							onChange={(e) => setWalletInput(e.target.value)}
							placeholder='Enter a wallet address to filter by'
							className='px-4 grow py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500'
						/>
						<button
							onClick={handleFilterSubmit}
							className='bg-black hover:bg-zinc-800 text-white transition rounded-lg px-5'>
							Filter
						</button>
						<button
							onClick={handleFilterClear}
							className='border hover:bg-black/20 transition rounded-lg px-5'>
							Clear
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
						<th className='px-4 py-2 text-right'>{isLoading ? '' : swaps[0]?.tokenA ?? ''}</th>
						<th className='px-4 py-2 text-right'>{isLoading ? '' : swaps[0]?.tokenB ?? ''}</th>
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
					) : swaps.length ? (
						swaps.map((swap, i) => {
							const isSell = swap.tokenA === swap.tokenSold;
							return (
								<tr key={i} className='border-b border-gray-800'>
									<td className='px-4 py-2 max-w-[200px]'>
										<Link
											href={`https://basescan.org/tx/${swap.hash}`}
											target='_blank'
											className='group hover:underline flex gap-2 items-center w-fit'>
											{dayjs.unix(swap.timestamp).fromNow()}

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
										{isSell ? 'Sell' : 'Buy'} {swaps[0].tokenA}
									</td>
									<td className='px-4 py-2 text-right'>
										{formatNumber(Number(swap.usdValue), true)}
									</td>
									<td className='px-4 py-2 text-right'>
										{formatNumber(Math.abs(Number(formatEther(BigInt(swap.amountIn)))))}
									</td>
									<td className='px-4 py-2 text-right'>
										{formatNumber(Math.abs(Number(formatEther(BigInt(swap.amountOut)))))}
									</td>
									<td className='px-4 py-2 text-right'>
										<Link
											href={`https://basescan.org/address/${swap.wallet}`}
											target='_blank'
											className='hover:underline'>
											{truncateAddress(swap.wallet)}
										</Link>
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td className='px-4 py-2' colSpan={6}>
								No swaps found.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
