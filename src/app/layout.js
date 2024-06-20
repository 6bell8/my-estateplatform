import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '내집어디',
  description: '궁금한 실거래가 정보를 확인할 수 있습니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
