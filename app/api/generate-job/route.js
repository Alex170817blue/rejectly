export async function POST(request) {
  const body = await request.json()

  const name = body.name || 'User'
  const role = body.role || 'Developer'
  const experience = body.experience || '2'
  const skills = Array.isArray(body.skills) ? body.skills : []

  const jobTypes = [
    `junior ${role} requiring 10+ years experience`,
    `unpaid internship with CEO-level responsibilities`,
    `${role} with impossible tech stack of 15 frameworks`,
    `${role} with absurd personal requirements like zodiac sign`,
    `${role} with salary that sounds good but is terrible`,
    `normal ${role} that becomes surreal in the details`,
  ]

  const jobs = []

  for (let i = 0; i < 6; i++) {
    const prompt = `Return ONLY a single valid JSON object, no explanation, no markdown.

Example:
{"id":"j1","company":"Acme Corp","title":"Junior Senior Dev","location":"Remote","salary":"Unpaid","type":"Full-time","description":"We need someone to do everything alone.","requirements":["10 years React exp","Must be Capricorn","Speak 5 languages"],"tag":"absurd"}

Now create ONE job listing of type: "${jobTypes[i]}"
For candidate: ${name}, wants to be ${role}, has ${experience} years experience.
Use id "j${i + 1}". Keep it short. Return ONLY the JSON object.`

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
            num_predict: 300, // un oggetto solo = molto più corto
          }
        }),
      })

      if (!res.ok) continue

      const data = await res.json()
      let text = data.response || ''

      // JSON object
      const start = text.indexOf('{')
      const end = text.lastIndexOf('}')
      if (start === -1 || end === -1) continue

      text = text.slice(start, end + 1)

      // Pulizia
    text = text
        .replace(/[\u0000-\u001F\u007F]/g, ' ')  // caratteri di controllo
        .replace(/'/g, '"')                        // apostrofi → virgolette
        .replace(/,\s*}/g, '}')                   // virgola finale prima di }
        .replace(/,\s*]/g, ']')                   // virgola finale prima di ]
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // chiavi senza virgolette

      const job = JSON.parse(text)

      jobs.push({
        id: `j${i + 1}`,
        company: job.company || 'Mystery Corp',
        title: job.title || 'Unknown Role',
        location: job.location || 'Somewhere',
        salary: job.salary || 'TBD',
        type: job.type || 'Full-time',
        description: job.description || 'No description.',
        requirements: Array.isArray(job.requirements)
          ? job.requirements
          : ['Requirements unknown'],
        tag: job.tag || 'absurd',
      })

    } catch (err) {
      console.log(`Job ${i + 1} failed:`, err.message)
      // Job placholder se non si carica uno
      jobs.push({
        id: `j${i + 1}`,
        company: 'GhostCorp LLC',
        title: `Senior ${role} (Entry Level)`,
        location: 'Remote (but actually in office)',
        salary: 'Competitive (€0)',
        type: 'Full-time',
        description: 'We are a fast-paced startup looking for someone to do everything.',
        requirements: [
          `${parseInt(experience) + 8}+ years of experience as ${role}`,
          'Must work 80 hours/week with a smile',
          'Salary negotiable (it is not)',
        ],
        tag: 'absurd',
      })
    }
  }

  if (jobs.length === 0) {
    return Response.json({ error: 'So desparate that there is nothing for you' }, { status: 500 })
  }

  return Response.json({ jobs })
}