export function formatNumber(number: number, isCurrency = false) {
	const opts: Intl.NumberFormatOptions = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 5,
	};

	if (isCurrency) {
		opts.style = 'currency';
		opts.currency = 'USD';
		opts.maximumFractionDigits = 2;
	}

	return new Intl.NumberFormat('en-US', opts).format(number);
}
