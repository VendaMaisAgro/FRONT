'use client';

import {
	getDocumentContent,
	getDocumentDescription,
	getDocumentTitle,
} from '@/utils/mappers/signUpDocumentData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface DocumentsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	documentType: 'privacyPolicy' | 'termsOfUse';
}

export default function DocumentsDialog({
	open,
	onOpenChange,
	documentType,
}: DocumentsDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[650px] sm:max-h-[700px] overflow-y-scroll">
				<DialogHeader>
					<DialogTitle>{getDocumentTitle(documentType)}</DialogTitle>

					<div className="flex flex-col justify-center text-sm text-neutral-500">
						{getDocumentDescription(documentType)}
						<span className="font-semibold text-primary">
							Atualizado em 08 de setembro de 2025
						</span>
					</div>
				</DialogHeader>

				<div
					className="grid gap-4 overflow-y-scroll text-justify px-3"
					dangerouslySetInnerHTML={{ __html: getDocumentContent(documentType) }}
				></div>
			</DialogContent>
		</Dialog>
	);
}
