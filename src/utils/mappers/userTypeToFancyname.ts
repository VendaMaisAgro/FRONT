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
];

export default function mapUserTypeToFancyName(
	type: 'distributor' | 'cooperative-or-partnership' | 'farmer'
) {
	return userTypeToFancyName.find((t) => t.type === type)?.fancyName;
}
