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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRef, useState } from "react";

interface ChangePhotoModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentSrc: string | null;
  onPhotoChange: (file: File) => void;
  isUploading?: boolean;
  fallbackInitial?: string;
}

export default function ChangePhotoModal({
  isOpen,
  setIsOpen,
  currentSrc,
  onPhotoChange,
  isUploading = false,
  fallbackInitial,
}: ChangePhotoModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = () => {
    if (file) {
      onPhotoChange(file);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset state
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
            <Avatar className="h-16 w-16 border border-border">
              {(previewUrl || currentSrc) ? (
                <AvatarImage
                  src={(previewUrl ?? currentSrc) as string}
                  alt=""
                />
              ) : (
                <AvatarFallback className="bg-muted text-foreground/70 font-semibold text-2xl">
                  {fallbackInitial ?? '?'}
                </AvatarFallback>
              )}
            </Avatar>
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
          <AlertDialogCancel onClick={handleClose} disabled={isUploading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!file || isUploading}>
            {isUploading ? "Enviando..." : "Alterar foto"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
