export const isOwner = (email?: string | null) =>
  !!email && email.toLowerCase() === String(import.meta.env.VITE_OWNER_EMAIL).toLowerCase()
