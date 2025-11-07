'use client'

export async function uploadProfilePhoto(file: File) {
  const formData = new FormData()
  formData.append('img', file)

   try {
    const res = await fetch('/api/user/profile-photo', {
      method: 'PUT',
      body: formData,
    })

    if (!res.ok) {
      const error = await res.json()
      return { success: false, error: error.error || 'Erro ao atualizar foto de perfil' }
    }

    const data = await res.json()
    return { success: true, data: data.data }
  } catch (error) {
    console.error('Erro no upload da foto de perfil:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

