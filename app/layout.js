import './globals.css'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'Rejectly — Get Rejected!',
  description: 'The job board where every application leads to rejection.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div style={{
            maxWidth: '480px',
            margin: '0 auto',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}