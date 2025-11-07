import { removeMoneyMask } from '@/utils/functions';
import z from 'zod';

const sellingUnitSchema = z.object({
	id: z.string().optional(), // ID do sellingUnitProduct para edição
	unitId: z.string().min(1, 'Por favor selecione uma unidade.'),
	minPrice: z.string().transform((val, ctx) => {
		if (val === undefined || val === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Insira um preço mínimo para a venda.',
			});
			return z.NEVER;
		}
		const num = removeMoneyMask(val);

		if (isNaN(num)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Insira um valor válido.',
			});
			return z.NEVER;
		}

		if (num <= 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Insira um número positivo.',
			});
			return z.NEVER;
		}

		return val;
	}),
	acronym: z.string(),
});

const productImagesSchema =
	typeof window === 'undefined'
		? z.any()
		: z.union([
				z.instanceof(File, { message: 'Por favor insira uma imagem.' }),
				z.string().min(1, 'URL da imagem é obrigatória'),
		  ]);

export const createProductSchema = z.object({
	name: z.string().min(1, 'Por favor preencha o nome do seu produto.'),
	variety: z.string().min(1, 'Variedade é obrigatória'),
	category: z.string().min(1, 'Por favor preencha a categoria do seu produto.'),
	harvestAt: z.date({
		required_error: 'Por favor selecione a data de colheita.',
	}),
	isNegotiable: z.boolean({
		required_error: 'Por favor indique se o produto é negociável.',
	}),
	amount: z
		.string()
		.transform((val, ctx) => {
			if (val === undefined || val === '') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Insira a quantidade em estoque.',
				});
				return z.NEVER;
			}
			const num = Number(val);

			if (isNaN(num)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Insira um valor válido.',
				});
				return z.NEVER;
			}

			if (num <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Insira um número positivo maior que zero.',
				});
				return z.NEVER;
			}
			return val;
		})
		.pipe(z.string()),
	description: z
		.string({
			required_error: 'Por favor insira a descrição do seu produto.',
		})
		.min(10, 'A descrição deve ter no mínimo 10 caracteres.'),
	sellingUnits: z
		.array(sellingUnitSchema)
		.min(1, 'Adicione no mínimo uma unidade de venda.'),
	images: z
		.array(productImagesSchema)
		.min(1, 'Insira no mínimo uma foto do seu produto.'),
});

export const productSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório'),
	variety: z.string().min(1, 'Variedade é obrigatória'),
	category: z.string().min(1, 'Categoria é obrigatória'),
	amount: z
		.string()
		.regex(/^[0-9]*([.,][0-9]*)?$/, 'Quantidade inválida')
		.refine((val) => val !== '', {
			message: 'Novo estoque é obrigatório',
		}),
	harvestAt: z.date({ required_error: 'Data de colheita é obrigatória' }),
	isNegotiable: z.boolean(),
	description: z.string().min(1, 'Descrição é obrigatória'),
	units: z
		.array(
			z.object({
				label: z.string().min(1, 'Selecione uma unidade'),
				price: z
					.string()
					.min(1, 'Preço é obrigatório')
					.regex(/^\d+(\.\d{1,2})?$/, 'Preço inválido'),
			})
		)
		.min(1, 'Adicione ao menos uma unidade de venda'),
});

export const signInSchema = z.object({
	identifier: z
		.string()
		.min(1, 'O CPF ou CNPJ é obrigatório.')
		.refine(
			(value) => {
				if (value.length === 11) {
					return true;
				}
				if (value.length === 14) {
					return true;
				}
				return false;
			},
			{
				message: 'O CPF deve ter 11 dígitos ou o CNPJ deve ter 14 dígitos.',
			}
		),
	password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

const signUpCommonSchema = z.object({
	name: z.string().min(15, 'O nome deve ter no mínimo 15 caracteres.').max(50),
	phone_number: z.string().min(10, 'O telefone deve ter DDD + 8 ou 9 dígitos.'),
	email: z.string().email('Insira um email válido.'),
	password: z.string().min(8, 'Sua senha deve ter no mínimo 8 caracteres.'),
	confirmPassword: z.string(),
	acceptPrivacyPolicy: z
		.boolean({
			required_error: 'Aceite os termos de privacidade para continuar.',
		})
		.refine((data) => data, {
			message: 'Aceite os termos de privacidade para continuar.',
		}),
	acceptTermsOfUse: z
		.boolean({
			required_error: 'Aceite os termos de uso para continuar.',
		})
		.refine((data) => data, {
			message: 'Aceite os termos de uso para continuar.',
		}),
	firstSecurityQuestion: z
		.string()
		.min(1, 'Por favor responda a pergunta de segurança.'),
	secondSecurityQuestion: z
		.string()
		.min(1, 'Por favor responda a pergunta de segurança.'),
	thirdSecurityQuestion: z
		.string()
		.min(1, 'Por favor responda a pergunta de segurança.'),
});

const enterprisesSchema = signUpCommonSchema.extend({
	userType: z.enum(['distributor', 'cooperative-or-partnership', 'farmer'], {
		errorMap: (issue) => {
			switch (issue.code) {
				case 'invalid_enum_value':
					return { message: 'Por favor, selecione um tipo de usuário válido.' };
				case 'invalid_union_discriminator':
					return { message: 'O tipo de usuário é obrigatório.' };
				default:
					return {
						message: 'Ocorreu um erro na validação do tipo de usuário.',
					};
			}
		},
	}),
	cnpj: z.string().min(14, 'O CNPJ deve ter exatamente 14 dígitos.'),
	ccir: z.string().optional(),
});

// const buyerSchema = signUpCommonSchema.extend({
// 	userType: z.literal("buyer"),
// 	cpf: z.string().min(11, "O CPF deve ter exatamente 11 dígitos."),
// });

export const signUpSchema = z
	.discriminatedUnion('userType', [enterprisesSchema])
	.refine((data) => data.password === data.confirmPassword, {
		message: 'As senhas não coincidem.',
		path: ['confirmPassword'],
	});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const addressSchema = z.object({
	cep: z.string().min(8, 'O CEP deve conter exatamente 8 números.'),
	uf: z.string().min(1, 'Informe o estado'),
	city: z.string().min(1, 'Informe a cidade'),
	street: z.string().min(1, 'Informe a rua/avenida'),
	number: z.string().min(1, 'Informe o número'),
	complement: z.string().min(1, 'Informe o complemento'),
	referencePoint: z.string().optional(),
	alias: z
		.string()
		.min(15, 'O nome deve ter no mínimo 15 caracteres.')
		.max(50, 'O nome deve ter no máximo 50 caracteres.'),
	phone_number_addressee: z
		.string()
		.min(10, 'O telefone deve ter DDD + 8 ou 9 dígitos.'),
	addressee: z.string().min(10, 'Informe o nome do destinatário.'),
	default: z.boolean().optional()
});

export type AddressFormValues = z.infer<typeof addressSchema>;

const transportSchema = z.object({
	sellerId: z.string(),
	transportTypeId: z.string(),
	transport: z.string(),
});

export const collectTransportTypes = z.enum(['collect']);
export const sendTransportTypes = z.enum(['basic', 'fast', 'express']);

export const preCheckoutSchema = z.object({
	// insurance: z.enum(["0", "1", "2"]),
	address: z.object({
		type: z.enum(['retirada', 'entrega']),
		addressId: z.number().optional(),
	}),
	transport: z.array(transportSchema),
	payment: z.object({
		methodId: z.string(),
		method: z.string(),
		// cardNumber: z.string().optional(),
		// cardName: z.string().optional(),
		// cardExpiry: z.string().optional(),
		// cardCvv: z.string().optional(),
	}),
	terms: z.object({
		accepted: z.boolean().refine((val) => val === true, {
			message: 'Você deve aceitar o termo de venda para continuar',
		}),
	}),
});
// .superRefine((data, ctx) => {
// 	if (data.address.type === "retirada") {
// 		data.transport.forEach((t, i) => {
// 			if (t.transportType !== collectTransportTypes.enum["collect"]) {
// 				ctx.addIssue({
// 					code: z.ZodIssueCode.custom,
// 					message: "Selecione o tipo de transporte.",
// 					path: ["transport", i, "transportType"],
// 				});
// 			}
// 		});
// 	} else if (data.address.type === "entrega") {
// 		data.transport.forEach((item, index) => {
// 			if (!sendTransportTypes.safeParse(item.transportType).success) {
// 				ctx.addIssue({
// 					code: z.ZodIssueCode.custom,
// 					message: "Selecione o tipo de transporte.",
// 					path: ["transport", index, "transportType"],
// 				});
// 			}
// 		});
// 	}
// });

export type CreateProductSchemaType = z.infer<typeof createProductSchema>;
