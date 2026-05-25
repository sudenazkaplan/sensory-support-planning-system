import { useState } from 'react'
import SoundPlayer from '../components/relaxation/SoundPlayer'
import BreathingExercise from '../components/relaxation/BreathingExercise'

const TABS = ['Sounds', 'Breathing']

export default function Relax() {
  const [activeTab, setActiveTab] = useState('Sounds')

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium text-purple-800 mb-6">Relaxation</h1>

        <div className="flex gap-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Sounds' && <SoundPlayer />}
        {activeTab === 'Breathing' && <BreathingExercise />}
      </div>
    </div>
  )
}