'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { CheckSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { IonButton, IonSpinner } from '@/components/ionic';
import BottomNav from '@/components/bottom-nav/bottom-nav';
import IonSearchbarClient from '@/components/IonSearchbarClient';
import ProductCard from '@/components/product-card/product-card';
import RepostModal from '@/components/repost-modal/repost-modal';
import { useAuth } from '@/lib/auth-context';
import { useAuthGuard } from '@/lib/guards';
import { loadProducts, searchProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import styles from './page.module.css';

export default function HomePage() {
  const ready = useAuthGuard();
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const repostedRef = useRef(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userId = user?.id;

  const displayedProducts = searchResults ?? products;
  const selectedCount = selectedIds.size;
  const selectedProducts = displayedProducts.filter((p) => selectedIds.has(p.id));

  useEffect(() => {
    if (!ready || !userId) return;

    let cancelled = false;
    loadProducts(userId).then((list) => {
      if (!cancelled) setProducts(list);
    });

    return () => {
      cancelled = true;
    };
  }, [ready, userId]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  function handleSearch(e: { detail: { value: string | number | null } }): void {
    const term = String(e.detail.value ?? '');
    setSearchTerm(term);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!term.trim()) {
      setSearchResults(null);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProducts({ name: term.trim() });
        setSearchResults(results);
      } catch (error) {
        console.error('Erro na busca:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }

  function toggleSelection(productId: string, event: MouseEvent): void {
    event.stopPropagation();
    setSelectedIds((ids) => {
      const newIds = new Set(ids);
      if (newIds.has(productId)) {
        newIds.delete(productId);
      } else {
        newIds.add(productId);
      }
      return newIds;
    });
  }

  function openModal(): void {
    repostedRef.current = false;
    setIsModalOpen(true);
  }

  function handleModalDismiss(): void {
    setIsModalOpen(false);

    if (repostedRef.current) {
      repostedRef.current = false;
      setSelectedIds(new Set());
    }
  }

  return (
    <div className="page-home">
      <header className={styles.header}>
        <div className={styles.avatar}>{(user?.name || 'N').charAt(0).toUpperCase()}</div>
        <div className={styles.greeting}>
          <span className={styles['greeting-hi']}>Bem-vindo de volta</span>
          <strong className={styles['greeting-name']}>{user?.name ?? 'Vendedora'}</strong>
        </div>
      </header>

      <div className={styles['search-row']}>
        <div className="search-shell">
          <IonSearchbarClient
            value={searchTerm}
            onIonInput={handleSearch}
            placeholder="Buscar produto..."
          />
        </div>
      </div>

      {isSearching ? (
        <div className={styles['loading-container']}>
          <IonSpinner name="crescent" color="success" />
        </div>
      ) : (
        <>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>
              {searchResults !== null ? 'Resultados' : 'Novidades'}
            </h2>
            {searchResults !== null && (
              <span className={styles['section-count']}>
                {displayedProducts.length} produto(s)
              </span>
            )}
          </div>

          <div className={styles['product-grid']}>
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selectable
                selected={selectedIds.has(product.id)}
                onToggle={toggleSelection}
              />
            ))}

            {displayedProducts.length === 0 && searchTerm && (
              <div className={styles['empty-state']}>
                <SearchOutlined className={styles['empty-icon']} />
                <p>Nenhum produto encontrado para &quot;{searchTerm}&quot;</p>
              </div>
            )}
          </div>
        </>
      )}

      {selectedCount > 0 && (
        <div className={styles['fab-container']}>
          <IonButton
            className={styles['fab-button']}
            color="success"
            shape="round"
            onClick={openModal}
          >
            <CheckSquareOutlined slot="start" />
            Repostar ({selectedCount})
          </IonButton>
        </div>
      )}

      <RepostModal
        isOpen={isModalOpen}
        products={selectedProducts}
        onDismiss={handleModalDismiss}
        onReposted={() => {
          repostedRef.current = true;
        }}
      />

      <BottomNav />
    </div>
  );
}