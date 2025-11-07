export function moneyMask(value: number): string {
	const n = Number(value);
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		useGrouping: true,
	}).format(Number.isFinite(n) ? n : 0);
}

export function cleanNumericString(value: string): string {
	return (value ?? "").replace(/\D/g, "");
}

export function formatCpf(cpf: string): string {
	cpf = cleanNumericString(cpf);

	if (cpf.length > 11) {
		cpf = cpf.substring(0, 11);
	}

	return cpf
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatCnpj(cnpj: string): string {
	cnpj = cleanNumericString(cnpj);

	if (cnpj.length > 14) {
		cnpj = cnpj.substring(0, 14);
	}

	return cnpj
		.replace(/^(\d{2})(\d)/, "$1.$2")
		.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1/$2")
		.replace(/(\d{4})(\d)/, "$1-$2");
}

export function formatCpfCnpj(identifier: string): string {
	const cleaned = cleanNumericString(identifier);

	if (cleaned.length <= 11) {
		return formatCpf(cleaned);
	} else if (cleaned.length <= 14) {
		return formatCnpj(cleaned);
	}
	return formatCnpj(cleaned);
}
export function formatPhoneNumber(v?: string) {
	if (!v) return ""; // protege contra undefined/null
	let value = v.replace(/\D/g, "");
	value = value.slice(0, 11);
	value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
	value = value.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
	return value;
}

/*export function formatPhoneNumber(v: string) {
	let value = v.replace(/\D/g, "");

	value = value.slice(0, 11);
	value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
	value = value.replace(/(\d{5})(\d{4})$/, "$1-$2");

	return value;
}*/

export function formatCep(v: string): string {
	let value = v.replace(/\D/g, "");
	value = value.slice(0, 8);

	return value.replace(/^(\d{5})(\d)/, "$1-$2");
}

export function formatDate(date: string) {
	const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
	});
	return formattedDate;
}

export function removeMoneyMask(value: string): number {
	const onlyDigits = value.replace(/[^0-9,.]/g, "");

	const unmaskedValue = onlyDigits.replace(/\./g, "").replace(",", ".");

	return parseFloat(unmaskedValue);
}

export function inputMoneyMask(value: string): string {
	let onlyDigitsValue = value.replace(/\D/g, "");

	if (onlyDigitsValue.length < 3) {
		onlyDigitsValue = onlyDigitsValue.padStart(3, "0");
	}

	const floatValue = parseFloat(onlyDigitsValue) / 100;

	const currencyFormatter = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		useGrouping: true,
	});

	return currencyFormatter.format(floatValue);
}

export function currencyFormatter(value: number | string): string {
	const n = typeof value === "string" ? Number(value) : value;
	return moneyMask(Number.isFinite(n) ? (n as number) : 0);
}
