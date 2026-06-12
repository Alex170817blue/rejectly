export async function POST(request) {
  const body = await request.json()

  const name = body.name || 'User'
  const jobTitle = body.jobTitle || 'the position'
  const company = body.company || 'our company'

  const rejectionTypes = [
    'polite and vague corporate HR rejection',
    'brutally honest rejection explaining real reason',
    'completely absurd rejection with surreal reason',
    'starts as good news then reveals it is a rejection',
  ]

  const isGhost = Math.random() < 0.15 // 15% di ghosting
  if (isGhost) {
    return Response.json({ type: 'ghost', body: null, company, jobTitle })
  }

  const type = rejectionTypes[Math.floor(Math.random() * rejectionTypes.length)]

  const prompt = `Write a short rejection email (3-4 lines max) from ${company} to ${name} for the position "${jobTitle}".

Style: ${type}

Rules:
- Write ONLY the email body text
- No subject line
- Sign as "The ${company} Team"
- Be creative and slightly satirical
- Maximum 4 sentences`

  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt,
        stream: false,
        options: {
          temperature: 0.9,
          num_predict: 200,
        }
      }),
    })

    if (!res.ok) throw new Error(`Ollama error: ${res.status}`)

    const data = await res.json()
    const text = (data.response || '').trim()

    const typeKey = type.includes('brutal') ? 'brutal'
      : type.includes('absurd') ? 'absurd'
      : type.includes('good news') ? 'fake'
      : 'polite'

    return Response.json({
      type: typeKey,
      body: text,
      company,
      jobTitle,
      subject: `Re: Your application for ${jobTitle}`,
    })

  } catch (error) {
    console.error('generate-rejection error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}