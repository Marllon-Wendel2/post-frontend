'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogoutOutlined, ShoppingOutlined } from '@ant-design/icons';
import { IonButton, IonLabel } from '@/components/ionic';
import BottomNav from '@/components/bottom-nav/bottom-nav';
import { useAuth } from '@/lib/auth-context';
import { useAuthGuard } from '@/lib/guards';
import { getProfile, type ProfileData } from '@/lib/profile';
import styles from './page.module.css';

export default function ProfilePage() {
  const ready = useAuthGuard();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.id;

  useEffect(() => {
    if (!ready) return;

    if (!userId) {
      router.replace('/login');
      return;
    }

    let cancelled = false;

    getProfile(userId)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar perfil:', error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ready, userId, router]);

  function handleLogout(): void {
    logout();
    router.replace('/login');
  }

  return (
    <div className="page-profile">
      <div className={styles['profile-page']}>
        {isLoading ? (
          <div className={styles['loading-container']}>
            <div className={styles['loading-spinner']} />
            <IonLabel>Carregando perfil...</IonLabel>
          </div>
        ) : profile ? (
          <>
            <div className={styles['profile-header']}>
              <div className={styles.avatar}>
                <span className={styles['avatar-text']}>{user?.name?.charAt(0)}</span>
              </div>
              <h1 className={styles['user-name']}>{user?.name}</h1>
              <p className={styles['user-email']}>{user?.email}</p>
              {user?.phone && <p className={styles['user-phone']}>{user.phone}</p>}
            </div>

            <div className={styles['stats-grid']}>
              <div className={styles['stat-card']}>
                <span className={styles['stat-icon']}>
                  <ShoppingOutlined />
                </span>
                <span className={styles['stat-value']}>{profile.stats.productsCount}</span>
                <span className={styles['stat-label']}>Produtos</span>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles['section-title']}>Meus Produtos</h2>
              <div className={styles['products-list']}>
                {profile.products.map((product) => (
                  <div key={product.id} className={styles['product-item']}>
                    <div className={styles['product-thumb']}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.imageUrl} alt={product.title} />
                    </div>
                    <div className={styles['product-info']}>
                      <h3 className={styles['product-title']}>{product.title}</h3>
                      <p className={styles['product-price']}>R$ {product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles['logout-area']}>
              <IonButton
                expand="block"
                fill="outline"
                color="danger"
                onClick={handleLogout}
                className={styles['logout-button']}
              >
                <LogoutOutlined slot="start" />
                Sair da conta
              </IonButton>
            </div>
          </>
        ) : null}
      </div>

      <BottomNav />
    </div>
  );
}