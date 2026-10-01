'use client';

import { HomeOutlined, PlusCircleOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './bottom-nav.module.css';

const menuItems = [
  { route: '/home', label: 'Home', Icon: HomeOutlined },
  { route: '/search', label: 'Buscar', Icon: SearchOutlined },
  { route: '/post', label: 'Postar', Icon: PlusCircleOutlined },
  { route: '/profile', label: 'Perfil', Icon: UserOutlined },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles['bottom-nav']}>
      {menuItems.map((item) => (
        <Link
          key={item.route}
          href={item.route}
          className={`${styles['nav-item']} ${pathname.startsWith(item.route) ? styles.active : ''}`}
        >
          <item.Icon />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}