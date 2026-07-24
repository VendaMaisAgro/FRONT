"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

type AdminModeSwitchProps = {
	className?: string;
};

export default function AdminModeSwitch({ className }: AdminModeSwitchProps) {
	const pathname = usePathname();
	const router = useRouter();
	const isAdminMode = pathname.startsWith("/admin");

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<span
				className={cn(
					"text-xs font-medium",
					isAdminMode ? "text-foreground/70" : "text-destructive"
				)}
			>
				{isAdminMode ? "Admin" : "Usuário"}
			</span>
			<Switch
				checked={isAdminMode}
				onCheckedChange={(checked) =>
					router.push(checked ? "/admin/executive-overview" : "/market")
				}
				className="data-[state=checked]:bg-gray-400 data-[state=unchecked]:bg-destructive"
				aria-label={
					isAdminMode ? "Sair do modo administrador" : "Entrar no modo administrador"
				}
			/>
		</div>
	);
}
