import { useState, useRef, useEffect } from 'react'

const SOUNDS = [
  { id: 'white', label: 'White Noise', emoji: '🌫️', frequency: 'white' },
  { id: 'pink', label: 'Pink Noise', emoji: '🌸', frequency: 'pink' },
  { id: 'brown', label: 'Brown Noise', emoji: '🌊', frequency: 'brown' },
  { id: 'rain', label: 'Rain', emoji: '🌧️', frequency: 'rain' },
  { id: 'forest', label: 'Forest', emoji: '🌲', frequency: 'forest' },
]

const createNoiseNode = (audioCtx, type) => {
  const bufferSize = 2 * audioCtx.sampleRate
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)

  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
  } else if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }
  } else if (type === 'brown') {
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = data[i]
      data[i] *= 3.5
    }
  } else {
    // rain ve forest için brown noise bazlı
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = data[i]
      data[i] *= 2.5
    }
  }

  const source = audioCtx.createBufferSource()
  source.buffer = buffer
  source.loop = true
  return source
}

export default function SoundPlayer() {
  const [playing, setPlaying] = useState(null)
  const [volume, setVolume] = useState(0.5)
  const audioCtxRef = useRef(null)
  const sourceRef = useRef(null)
  const gainRef = useRef(null)

  useEffect(() => {
    return () => {
      stopSound()
      audioCtxRef.current?.close()
    }
  }, [])

  const stopSound = () => {
    try {
      sourceRef.current?.stop()
    } catch {}
    sourceRef.current = null
  }

  const playSound = (sound) => {
    stopSound()

    if (playing === sound.id) {
      setPlaying(null)
      return
    }

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    const audioCtx = audioCtxRef.current
    const source = createNoiseNode(audioCtx, sound.frequency)
    const gainNode = audioCtx.createGain()
    gainNode.gain.value = volume

    source.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    source.start()

    sourceRef.current = source
    gainRef.current = gainNode
    setPlaying(sound.id)
  }

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (gainRef.current) {
      gainRef.current.gain.value = val
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SOUNDS.map(sound => (
          <button
            key={sound.id}
            onClick={() => playSound(sound)}
            className={`p-4 rounded-2xl text-center transition ${
              playing === sound.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="text-3xl mb-2">{sound.emoji}</div>
            <div className="text-sm font-medium">{sound.label}</div>
            {playing === sound.id && (
              <div className="text-xs mt-1 opacity-75">Playing...</div>
            )}
          </button>
        ))}
      </div>

      {playing && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="flex-1 accent-purple-600"
            />
            <span className="text-sm text-gray-500 w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}