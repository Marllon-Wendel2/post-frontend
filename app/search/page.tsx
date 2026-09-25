'use client';

import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { IonContent, IonInput, IonSpinner } from '@ionic/react';
import BottomNav from '@/components/bottom-nav/bottom-nav';
import IonSearchbarClient from '@/components/IonSearchbarClient';
import { IonButton } from '@/components/ionic';
import { useAuthGuard } from '@/lib/guards';
import { searchProducts } from '@/lib/products';
import type { Product, ProductSearchDto } from '@/lib/types';
import styles from './page.module.css';

export default function SearchPage() {
  useAuthGuard();

  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  async function search(): Promise<void> {
    const name = searchTerm.trim();
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;

    if (!name && min === undefined && max === undefined) {
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const filters: ProductSearchDto = {};
      if (name) filters.name = name;
      if (min !== undefined) filters.minPrice = min;
      if (max !== undefined) filters.maxPrice = max;

      const searchResults = await searchProducts(filters);
      setResults(searchResults);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <>
      <IonContent>
        <div className={styles['search-page']}>
          <div className={styles['search-section']}>
            <IonSearchbarClient
              value={searchTerm}
              onIonInput={(e) => setSearchTerm(String(e.detail.value ?? ''))}
              placeholder="Buscar por nome..."
              debounce={0}
            />

            <div className={styles['price-filters']}>
              <IonInput
                type="number"
                placeholder="Preço mínimo"
                value={minPrice}
                onIonInput={(e) => setMinPrice(String(e.detail.value ?? ''))}
                className={styles['price-input']}
              />
              <span className={styles['price-separator']}>até</span>
              <IonInput
                type="number"
                placeholder="Preço máximo"
                value={maxPrice}
                onIonInput={(e) => setMaxPrice(String(e.detail.value ?? ''))}
                className={styles['price-input']}
              />
            </div>

            <div className={styles['search-actions']}>
              <IonButton expand="block" color="success" onClick={search} className="btn-primary">
                <SearchOutlined slot="start" />
                Buscar
              </IonButton>
            </div>
          </div>

          {isSearching ? (
            <div className={styles['loading-container']}>
              <IonSpinner name="crescent" color="success" />
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <>
                <div className={styles['results-header']}>
                  <span>{results.length} resultado(s) encontrado(s)</span>
                </div>
                <div className={styles['product-grid']}>
                  {results.map((product) => (
                    <div key={product.id} className={styles['product-card']}>
                      <div className="image-container">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className={styles['product-image']}
                        />
                      </div>
                      <div className={styles['card-body']}>
                        <h3 className={styles['product-title']}>{product.title}</h3>
                        <p className={styles['product-price']}>
                          R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles['empty-state']}>
                <SearchOutlined className={styles['empty-icon']} />
                <p>Nenhum produto encontrado</p>
              </div>
            )
          ) : null}
        </div>
      </IonContent>

      <BottomNav />
    </>
  );
}
