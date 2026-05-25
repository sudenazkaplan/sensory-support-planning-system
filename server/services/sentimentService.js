const Groq = require('groq-sdk')

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

exports.analyzeSentiment = async (text) => {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Analyze the emotional tone of the following text and respond ONLY with a JSON object in this exact format, nothing else, no markdown:
{"mood":"very_good","score":5,"keywords":["keyword1"]}
mood options: very_good, good, neutral, bad, very_bad
score: 1=very_bad, 2=bad, 3=neutral, 4=good, 5=very_good`
        },
        { role: 'user', content: text }
      ],
      max_tokens: 100,
      temperature: 0
    })

    const raw = response.choices[0].message.content.trim()
    const clean = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch (err) {
    return { mood: 'neutral', score: 3, keywords: [] }
  }
}