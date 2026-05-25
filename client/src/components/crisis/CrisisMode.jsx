import { useState } from 'react'
import { useCrisis } from '../../context/CrisisContext'
import BreathingExercise from '../relaxation/BreathingExercise'

export default function CrisisMode() {
  const { isCrisis, dismissCrisis } = useCrisis()
  const [showBreathing, setShowBreathing] = useState(false)

  if (!isCrisis) return null

  return (
    <div className="fixed inset-0 bg-purple-50 z-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="text-2xl font-medium text-purple-800 mb-3">
          You are safe
        </h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          It looks like you might be feeling overwhelmed.
          Take a moment to breathe. You are not alone.
        </p>

        {!showBreathing ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowBreathing(true)}
              className="bg-purple-600 text-white py-4 rounded-2xl text-sm font-medium hover:bg-purple-700 transition"
            >
              Start breathing exercise
            </button>
            <button
              onClick={dismissCrisis}
              className="bg-white text-purple-600 border border-purple-200 py-4 rounded-2xl text-sm hover:bg-purple-50 transition"
            >
              I am okay, continue
            </button>
          </div>
        ) : (
          <div>
            <BreathingExercise />
            <button
              onClick={dismissCrisis}
              className="mt-6 text-sm text-gray-400 hover:text-gray-600"
            >
              I feel better, continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}