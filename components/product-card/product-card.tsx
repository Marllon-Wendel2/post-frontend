'use client';

import type { KeyboardEvent, MouseEvent } from 'react';
import { CheckCircleFilled, CheckOutlined, PlusOutlined } from '@ant-design/icons';
import type { Product } from '@/lib/types';
import styles from './product-card.module.css';

interface ProductCardProps {
  product: Product;
  selected?: boolean;
  selectable?: boolean;
  onToggle?: (productId: string, event: MouseEvent) => void;
}

export default function ProductCard({
  product,
  selected = false,
  selectable = false,
  onToggle,
}: ProductCardProps) {
  const inactive = !product.isActive;

  const classNames = [
    styles.card,
    selected ? styles.selected : '',
    inactive ? styles.inactive : '',
  ]
    .filter(Boolean)
    .join(' ');

  function handleToggle(event: MouseEvent): void {
    if (!selectable || inactive) return;
    onToggle?.(product.id, event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (!selectable || inactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle?.(product.id, event as unknown as MouseEvent);
    }
  }

  return (
    <div
      className={classNames}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
      aria-pressed={selectable ? selected : undefined}
    >
      <div className={styles.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          className={[styles.image, inactive ? styles.dimmed : ''].filter(Boolean).join(' ')}
        />

        {inactive && <span className={styles.badge}>Inativo</span>}

        {selected && (
          <span className={styles.check} aria-hidden="true">
            <CheckCircleFilled />
          </span>
        )}

        {selectable && !inactive && (
          <button
            type="button"
            className={[styles.add, selected ? styles['add-added'] : ''].filter(Boolean).join(' ')}
            onClick={(event) => {
              event.stopPropagation();
              handleToggle(event);
            }}
            aria-label={selected ? 'Remover da seleção' : 'Adicionar à seleção'}
          >
            {selected ? <CheckOutlined /> : <PlusOutlined />}
            {selected ? 'Selecionado' : 'Adicionar'}
          </button>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.meta}>
          <p className={styles.price}>R$ {product.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
