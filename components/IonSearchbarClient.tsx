'use client';

import dynamic from 'next/dynamic';

const IonSearchbarClient = dynamic(
  () => import('@ionic/react').then((mod) => ({ default: mod.IonSearchbar })),
  { ssr: false }
);

export default IonSearchbarClient;
