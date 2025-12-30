import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'বাকি হিসাব - Customer Baki Tracker',
  description: 'গ্রাহকদের বাকির হিসাব রাখার অ্যাপ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
