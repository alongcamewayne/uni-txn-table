import { getTransactionData } from '@/lib/getTranscationData';
import { TxnTable } from '@/components/TxnTable';

export default async function Page() {
	const data = await getTransactionData({
		pool: '0x9a4b641dbAd8F208952F34fb76ed664E28e0b514',
	});

	return (
		<div className='mt-20'>
			<TxnTable transactions={data.transactions} />
		</div>
	);
}
