import { deleteAddress } from "@/actions/address";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

interface ConfirmAddressExclusionModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	addressId: string;
}

export default function ConfirmAddressExclusionModal({
	isOpen,
	setIsOpen,
	addressId,
}: ConfirmAddressExclusionModalProps) {
	async function handleDelete() {
		await deleteAddress(addressId);
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
					<AlertDialogDescription>
						Tem certeza que deseja remover este endereço? Esta ação não pode ser
						desfeita.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						className="bg-red-500 hover:bg-red-600"
						onClick={handleDelete}
					>
						Confirmar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
