import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { coordSchema } from '../utils/validators'

function Field({ label, error, children, required }) {
  return (
    <div className="space-y-1">
      <label className="font-display text-xs tracking-widest text-[#111111] uppercase">
        {label}{required && ' *'}
      </label>
      {children}
      {error && <p className="text-red-600 text-xs font-inter">{error.message}</p>}
    </div>
  )
}

const inputClass = "w-full bg-transparent border-b border-black/30 py-2 text-[#111111] font-inter text-sm outline-none focus:border-[#6195a4] transition-colors"

export default function CoordForm({ defaultValues, onSubmit }) {
  const today = new Date().toISOString().slice(0, 10)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(coordSchema),
    defaultValues: { dateSouscription: today, ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" error={errors.prenom} required>
          <input {...register('prenom')} className={inputClass} aria-invalid={!!errors.prenom} />
        </Field>
        <Field label="Nom" error={errors.nom} required>
          <input {...register('nom')} className={inputClass} aria-invalid={!!errors.nom} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Email" error={errors.email} required>
          <input type="email" {...register('email')} className={inputClass} aria-invalid={!!errors.email} />
        </Field>
        <Field label="Téléphone" error={errors.telephone}>
          <input type="tel" {...register('telephone')} className={inputClass} />
        </Field>
      </div>

      <Field label="Adresse" error={errors.adresse} required>
        <input {...register('adresse')} className={inputClass} aria-invalid={!!errors.adresse} />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Code postal" error={errors.codePostal} required>
          <input {...register('codePostal')} className={inputClass} aria-invalid={!!errors.codePostal} />
        </Field>
        <div className="col-span-2">
          <Field label="Ville" error={errors.ville} required>
            <input {...register('ville')} className={inputClass} aria-invalid={!!errors.ville} />
          </Field>
        </div>
      </div>

      <Field label="Date de souscription" error={errors.dateSouscription} required>
        <input type="date" {...register('dateSouscription')} className={inputClass} aria-invalid={!!errors.dateSouscription} />
      </Field>

      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('engagement')}
            className="mt-0.5 w-4 h-4 accent-[#6195a4] shrink-0"
            aria-invalid={!!errors.engagement}
          />
          <span className="text-xs text-black/60">
            J'ai pris connaissance du projet PROPICE et souhaite participer à sa constitution en qualité de sociétaire. *
          </span>
        </label>
        {errors.engagement && (
          <p className="text-red-500 text-xs mt-1 ml-6">{errors.engagement.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[#111111] text-white font-display font-bold text-base py-3 tracking-widest hover:bg-[#6195a4] transition-colors"
      >
        CONTINUER
      </button>
    </form>
  )
}
