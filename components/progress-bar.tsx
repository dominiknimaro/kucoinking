interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="px-8 mb-12">
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full flex-1 ${index < currentStep ? "bg-[#24AE8F]" : "bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  )
}
