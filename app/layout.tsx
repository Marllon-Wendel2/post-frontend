import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import { Providers } from './providers';
import './globals.css';

const cormorant = Cormorant_Garamond({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#0f5132',
    colorSuccess: '#0f5132',
    colorLink: '#0f5132',
    colorText: '#242b27',
    colorTextSecondary: '#6e746c',
    colorBgBase: '#f1eee7',
    colorBgContainer: '#faf8f3',
    colorBorder: '#e7e3da',
    borderRadius: 16,
    fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 999,
      controlHeight: 48,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 16,
      controlHeight: 48,
    },
    Modal: {
      borderRadius: 20,
      headerBg: '#faf9f4',
      contentBg: '#faf9f4',
    },
    List: {
      borderRadius: 16,
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
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ConfigProvider theme={theme}>
          <Providers>{children}</Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}