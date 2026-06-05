import { SignUpFormValues } from '@/lib/schemas';
import { UseFormReturn } from 'react-hook-form';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

export function SecondPageSignUpForm({
	form,
}: {
	form: UseFormReturn<SignUpFormValues>;
}) {
	const cpfCnpj = form.watch('cpfCnpj');
	const isCpf = cpfCnpj.replace(/\D/g, '').length <= 11;

	const questions = isCpf
		? {
				first: '3 primeiros dígitos do CPF',
				second: 'Qual a cidade que você nasceu',
				third: 'Ano de nascimento (aaaa)',
			}
		: {
				first: '3 primeiros dígitos do CNPJ',
				second: 'Qual a cidade sede da sua empresa',
				third: 'Ano de abertura da empresa (aaaa)',
			};

	return (
		<>
			<FormField
				control={form.control}
				name="firstSecurityQuestion"
				render={({ field }) => (
					<FormItem>
						<FormLabel htmlFor="firstSecurityQuestion">
							{questions.first} <span className="text-red-500">*</span>
						</FormLabel>

						<FormControl>
							<Input
								id="firstSecurityQuestion"
								placeholder="Resposta"
								className="w-full border border-border rounded h-12 px-4 py-3"
								{...field}
							/>
						</FormControl>

						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="secondSecurityQuestion"
				render={({ field }) => (
					<FormItem>
						<FormLabel htmlFor="secondSecurityQuestion">
							{questions.second} <span className="text-red-500">*</span>
						</FormLabel>

						<FormControl>
							<Input
								id="secondSecurityQuestion"
								placeholder="Resposta"
								className="w-full border border-border rounded h-12 px-4 py-3"
								{...field}
							/>
						</FormControl>

						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="thirdSecurityQuestion"
				render={({ field }) => (
					<FormItem>
						<FormLabel htmlFor="thirdSecurityQuestion">
							{questions.third} <span className="text-red-500">*</span>
						</FormLabel>

						<FormControl>
							<Input
								id="thirdSecurityQuestion"
								placeholder="Resposta"
								className="w-full border border-border rounded h-12 px-4 py-3"
								{...field}
							/>
						</FormControl>

						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
