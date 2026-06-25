import bcrypt from 'bcryptjs'
import db from '@/lib/db'

export async function POST(request) {
  const { email, password, name } = await request.json()

  if (!email || !password || !name) {
    return Response.json({ error: 'All fields required' }, { status: 400 })
  }

  if (password.length < 6) {
    return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  try {
    // Controllk
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: 'Email already in use' }, { status: 400 })
    }

    
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        stats: { create: {} }
      }
    })

    return Response.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    console.error('Register error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
