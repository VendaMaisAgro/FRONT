'use client'

import { compressImage } from './compressImage';

export async function uploadProfilePhoto(file: File) {
  const compressedFile = await compressImage(file, 800, 800, 0.8); // Resize to max 800x800 for profile photos
  const formData = new FormData()
  formData.append('img', compressedFile)

  try {
    const res = await fetch('/api/user/profile-photo', {
      method: 'PUT',
      body: formData,
    })

    if (!res.ok) {
      if (res.status === 413) {
        return { success: false, error: 'A imagem é muito grande. Tamanho máximo: 1MB' }
      }

      try {
        const error = await res.json()
        return { success: false, error: error.error || 'Erro ao atualizar foto de perfil' }
      } catch {
        return { success: false, error: `Erro no servidor: ${res.status} ${res.statusText}` }
      }
    }

    const data = await res.json()
    return { success: true, data: data.data }
  } catch (error) {
    console.error('Erro no upload da foto de perfil:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

