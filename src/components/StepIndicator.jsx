export default function StepIndicator({ currentStep, onStepClick }) {
  const steps = ['TYPE', 'MONTANT', 'COORDONNÉES', 'CONFIRMATION']
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const num = i + 1
        const done = num < currentStep
        const active = num === currentStep
        return (
          <div key={num} className="flex items-center">
            <button
              onClick={() => done && onStepClick(num)}
              disabled={!done}
              className={`flex flex-col items-center ${done ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-sm transition-colors
                ${active ? 'bg-[#111111] text-white' : ''}
                ${done ? 'bg-[#6195a4] text-white' : ''}
                ${!active && !done ? 'bg-gray-100 text-gray-400' : ''}
              `}>
                {done ? '✓' : num}
              </div>
              <span className={`text-[10px] font-inter mt-1 hidden sm:block
                ${active ? 'text-[#111111] font-semibold' : ''}
                ${done ? 'text-[#6195a4]' : ''}
                ${!active && !done ? 'text-gray-400' : ''}
              `}>{label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-px mx-1 ${done ? 'bg-[#6195a4]' : 'bg-gray-300'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
