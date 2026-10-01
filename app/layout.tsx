import type { Metadata } from 'next';
import { Audiowide, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import { Providers } from './providers';
import './globals.css';

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-audiowide',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#16a34a',
    colorSuccess: '#16a34a',
    colorLink: '#16a34a',
    colorText: '#0b2018',
    colorBgBase: '#eaf4ee',
    borderRadius: 12,
    fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 14,
      controlHeight: 52,
      fontWeight: 600,
    },
    Input: {
      borderRadius: 12,
      controlHeight: 48,
    },
    Modal: {
      borderRadius: 16,
      headerBg: '#ffffff',
      contentBg: '#ffffff',
    },
    List: {
      borderRadius: 12,
    },
    Spin: {
      dotSize: 24,
    },
  },
};

export const metadata: Metadata = {
  title: 'NaturaPost',
  description: 'Rede social de produtos das vendedoras Natura',
  icons: { icon: '/logo.jpg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${audiowide.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ConfigProvider theme={theme}>
          <Providers>{children}</Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}