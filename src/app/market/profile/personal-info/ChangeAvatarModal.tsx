"use client";

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
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface ChangeAvatarModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    currentSrc: string;
    onConfirm: (file: File, previewUrl: string) => Promise<void> | void;
}

export default function ChangeAvatarModal({
    isOpen,
    setIsOpen,
    currentSrc,
    onConfirm,
}: ChangeAvatarModalProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    function handlePickFile() {
        fileInputRef.current?.click();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(selected);
        const url = URL.createObjectURL(selected);
        setPreviewUrl(url);
    }

    async function handleConfirm() {
        if (file && previewUrl) {
            await onConfirm(file, previewUrl);
            setIsOpen(false);
        } else {
            setIsOpen(false);
        }
    }

    function handleClose() {
        setIsOpen(false);
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Alterar foto</AlertDialogTitle>
                    <AlertDialogDescription>
                        Selecione uma nova foto para seu perfil. Esta ação atualizará sua imagem.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                        <Image
                            src={previewUrl ?? currentSrc}
                            alt="Pré-visualização de foto"
                            fill
                            className="rounded-full object-cover border border-border"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handlePickFile}
                        className="px-4 py-2 rounded-md border bg-background hover:bg-muted text-foreground"
                    >
                        Selecionar foto
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                    />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={!file}>
                        Alterar foto
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}



