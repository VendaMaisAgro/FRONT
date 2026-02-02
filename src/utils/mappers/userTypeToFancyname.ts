const userTypeToFancyName = [
	{
		type: 'distributor',
		fancyName: 'Comprador/Distribuidor',
	},
	{
		type: 'cooperative-or-partnership',
		fancyName: 'Cooperativa/Associação',
	},
	{
		type: 'farmer',
		fancyName: 'Produtor Rural',
	},
	{
		type: 'wholesaler',
		fancyName: 'Atacadista',
	},
	{
		type: 'supermarket',
		fancyName: 'Supermercado',
	},
];

export default function mapUserTypeToFancyName(
	type:
		| 'distributor'
		| 'cooperative-or-partnership'
		| 'farmer'
		| 'wholesaler'
		| 'supermarket'
		| undefined
) {
	return userTypeToFancyName.find((t) => t.type === type)?.fancyName;
}
