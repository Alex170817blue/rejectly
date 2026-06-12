import db from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

    console.log('=== GET USER ===')
    console.log('id ricevuto:', id)

  if (!id) {
    return Response.json({ error: 'User id required' }, { status: 400 })
  }

  try {
    const user = await db.user.findUnique({
      where: { id },
      include: { stats: true }
    })

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json({ user })
  } catch (error) {
    console.error('Get user error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  const body = await request.json()
  const { id, name, role, experience, bio, photo, skills } = body

  try {
    const user = await db.user.upsert({
      where: { id: id || 'non-existent' },
      update: {
        name,
        role,
        experience: experience || '2',
        bio: bio || '',
        photo: photo || null,
        skills: skills || [],
        onboarded: true,
      },
      create: {
        name,
        role,
        experience: experience || '2',
        bio: bio || '',
        photo: photo || null,
        skills: skills || [],
        onboarded: true,
        stats: { create: {} }
      },
      include: { stats: true }
    })

    // Crea stats se non esistono
    await db.stats.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id }
    })

    return Response.json({ user })
  } catch (error) {
    console.error('Create user error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  const body = await request.json()
  const { id, name, role, bio, photo, skills, experience } = body

  if (!id) {
    return Response.json({ error: 'User id required' }, { status: 400 })
  }

  try {
    const user = await db.user.update({
      where: { id },
      data: {
        name,
        role,
        bio:   bio   ?? '',
        photo: photo ?? null,
        skills: skills ?? [],
        experience: experience ?? '2',
      },
    })
    return Response.json({ user })
  } catch (error) {
    console.error('Update user error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}