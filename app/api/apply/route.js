import db from '@/lib/db'

export async function POST(request) {
  const body = await request.json()
  const { userId, jobId, jobTitle, company } = body

  try {
    // Salva candidatura
    const application = await db.application.create({
      data: { userId, jobId, jobTitle, company }
    })

    // Incrementa contatore applied nelle stats
    await db.stats.update({
      where: { userId },
      data: { applied: { increment: 1 } }
    })

    return Response.json({ application })
  } catch (error) {
    console.error('Apply error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}