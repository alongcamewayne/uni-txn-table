import { TxnTableWithFilter } from '@/components/TxnTableWithFilter';

export default async function Page() {
	return (
		<div className='my-20 flex flex-col gap-8'>
			<TxnTableWithFilter />
		</div>
	);
}
