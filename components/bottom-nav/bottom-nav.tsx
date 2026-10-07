'use client';

import {
  CloseOutlined,
  HomeOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './bottom-nav.module.css';

const menuItems = [
  { route: '/home', label: 'Home', Icon: HomeOutlined },
  { route: '/search', label: 'Buscar', Icon: SearchOutlined },
  { route: '/post', label: 'Postar', Icon: PlusCircleOutlined },
  { route: '/profile', label: 'Perfil', Icon: UserOutlined },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') setIsOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <nav className={styles['bottom-nav']}>
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`${styles.menu} ${isOpen ? styles.open : ''}`}
        role="menu"
        aria-hidden={!isOpen}
      >
        {menuItems.map((item) => (
          <Link
            key={item.route}
            href={item.route}
            role="menuitem"
            className={`${styles['nav-item']} ${pathname.startsWith(item.route) ? styles.active : ''}`}
          >
            <item.Icon />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <button
        type="button"
        className={`${styles['menu-button']} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <CloseOutlined /> : <MenuOutlined />}
      </button>
    </nav>
  );
}
