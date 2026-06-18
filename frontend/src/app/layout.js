import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const metadata = {
  title: 'Paper Bank - Previous Year Question Papers',
  description: 'Access previous year question papers, download them, and get AI-powered solutions to prepare for your exams.',
  keywords: 'question papers, previous year papers, exam preparation, college, university',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
