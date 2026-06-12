import db from '@/lib/db'

// POST — salva nuova email
export async function POST(request) {
  const body = await request.json()
  const { userId, company, jobTitle, subject, body: emailBody, type } = body

  try {
    // Salva email
    const email = await db.email.create({
      data: { userId, company, jobTitle, subject, body: emailBody, type }
    })

    // Aggiorna stats in base al tipo
    const statsUpdate = {}
    if (type === 'ghost') statsUpdate.ghosted = { increment: 1 }
    else {
      statsUpdate.rejected = { increment: 1 }
      if (type === 'absurd') statsUpdate.absurd = { increment: 1 }
      if (type === 'brutal') statsUpdate.brutal = { increment: 1 }
    }

    await db.stats.update({
      where: { userId },
      data: statsUpdate,
    })

    return Response.json({ email })
  } catch (error) {
    console.error('Save email error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// GET — carica tutte le email di un utente
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return Response.json({ error: 'userId required' }, { status: 400 })
  }

  try {
    const emails = await db.email.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    const stats = await db.stats.findUnique({
      where: { userId }
    })

    return Response.json({ emails, stats })
  } catch (error) {
    console.error('Get emails error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// PATCH — segna email come letta
export async function PATCH(request) {
  const body = await request.json()
  const { emailId } = body

  try {
    const email = await db.email.update({
      where: { id: emailId },
      data: { read: true }
    })

    return Response.json({ email })
  } catch (error) {
    console.error('Mark read error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}