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
	return (
		<>
			<FormField
				control={form.control}
				name="firstSecurityQuestion"
				render={({ field }) => (
					<FormItem>
						<FormLabel htmlFor="firstSecurityQuestion">
							Pergunta 1 <span className="text-red-500">*</span>
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
							Pergunta 2 <span className="text-red-500">*</span>
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
							Pergunta 3 <span className="text-red-500">*</span>
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
