'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { CheckCircleFilled, CheckSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { IonContent, IonSpinner } from '@ionic/react';
import BottomNav from '@/components/bottom-nav/bottom-nav';
import IonSearchbarClient from '@/components/IonSearchbarClient';
import { IonButton } from '@/components/ionic';
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

  function handleSearch(e: CustomEvent<{ value?: string | number | null }>): void {
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
      <IonContent>
        <div className={styles['search-bar']}>
          <IonSearchbarClient
            value={searchTerm}
            onIonInput={handleSearch}
            placeholder="Buscar produto..."
            debounce={0}
          />
        </div>

        {isSearching ? (
          <div className={styles['loading-container']}>
            <IonSpinner name="crescent" color="success" />
          </div>
        ) : (
          <div className={styles['product-grid']}>
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className={[
                  styles['product-card'],
                  selectedIds.has(product.id) ? styles.selected : '',
                  !product.isActive ? styles.inactive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={(e) => toggleSelection(product.id, e)}
              >
                {selectedIds.has(product.id) && (
                  <div className={styles['checkmark-overlay']}>
                    <CheckCircleFilled />
                  </div>
                )}

                {!product.isActive && <div className={styles['inactive-badge']}>Inativo</div>}

                <div className="image-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className={[styles['product-image'], !product.isActive ? styles.dimmed : '']
                      .filter(Boolean)
                      .join(' ')}
                  />
                </div>
                <div className={styles['card-body']}>
                  <h3 className={styles['product-title']}>{product.title}</h3>
                  <p className={styles['product-price']}>R$ {product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}

            {displayedProducts.length === 0 && searchTerm && (
              <div className={styles['empty-state']}>
                <SearchOutlined className={styles['empty-icon']} />
                <p>Nenhum produto encontrado para &quot;{searchTerm}&quot;</p>
              </div>
            )}
          </div>
        )}
      </IonContent>

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
