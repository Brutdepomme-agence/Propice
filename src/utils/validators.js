import { z } from 'zod'

export const coordSchema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  email: z.string().min(1, 'L\'email est requis').email('Format d\'email invalide'),
  telephone: z.string().optional(),
  adresse: z.string().min(1, 'L\'adresse est requise'),
  codePostal: z.string().min(4, 'Le code postal est requis'),
  ville: z.string().min(1, 'La ville est requise'),
  dateSouscription: z.string().min(1, 'La date est requise'),
  engagement: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez cocher cette case pour continuer' }),
  }),
})
