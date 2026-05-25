import { useState, useEffect, useRef } from 'react'

const PATTERNS = [
  { id: 'box', label: 'Box Breathing', steps: ['Inhale', 'Hold', 'Exhale', 'Hold'], durations: [4, 4, 4, 4] },
  { id: '478', label: '4-7-8', steps: ['Inhale', 'Hold', 'Exhale'], durations: [4, 7, 8] },
  { id: 'calm', label: 'Calm', steps: ['Inhale', 'Exhale'], durations: [4, 6] },
]

export default function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0])
  const [isRunning, setIsRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(PATTERNS[0].durations[0])
  const [scale, setScale] = useState(1)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const start = () => {
    setIsRunning(true)
    setStepIndex(0)
    setSecondsLeft(selectedPattern.durations[0])
    setScale(selectedPattern.steps[0] === 'Inhale' ? 1.4 : 1)

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setStepIndex(si => {
            const next = (si + 1) % selectedPattern.steps.length
            setSecondsLeft(selectedPattern.durations[next])
            setScale(selectedPattern.steps[next] === 'Inhale' ? 1.4 : 1)
            return next
          })
          return selectedPattern.durations[0]
        }
        return prev - 1
      })
    }, 1000)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setStepIndex(0)
    setScale(1)
    setSecondsLeft(selectedPattern.durations[0])
  }

  const selectPattern = (pattern) => {
    stop()
    setSelectedPattern(pattern)
    setSecondsLeft(pattern.durations[0])
  }

  const currentStep = selectedPattern.steps[stepIndex]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2 flex-wrap justify-center">
        {PATTERNS.map(p => (
          <button
            key={p.id}
            onClick={() => selectPattern(p)}
            className={`px-4 py-2 rounded-xl text-sm transition ${
              selectedPattern.id === p.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center w-56 h-56">
        <div
          className="absolute rounded-full bg-purple-200 opacity-30 transition-all"
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${scale})`,
            transitionDuration: `${selectedPattern.durations[stepIndex]}s`,
            transitionTimingFunction: 'ease-in-out'
          }}
        />
        <div
          className="absolute rounded-full bg-purple-400 opacity-50 transition-all"
          style={{
            width: '70%',
            height: '70%',
            transform: `scale(${scale})`,
            transitionDuration: `${selectedPattern.durations[stepIndex]}s`,
            transitionTimingFunction: 'ease-in-out'
          }}
        />
        <div className="relative text-center z-10">
          {isRunning ? (
            <>
              <p className="text-xl font-medium text-purple-800">{currentStep}</p>
              <p className="text-4xl font-light text-purple-600 mt-1">{secondsLeft}</p>
            </>
          ) : (
            <p className="text-purple-400 text-sm">Press start</p>
          )}
        </div>
      </div>

      <button
        onClick={isRunning ? stop : start}
        className={`px-8 py-3 rounded-2xl text-sm font-medium transition ${
          isRunning
            ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  )
}