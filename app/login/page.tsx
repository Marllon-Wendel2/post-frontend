'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IonContent, IonInput, IonLabel, IonText } from '@ionic/react';
import { IonButton } from '@/components/ionic';
import { useAuth } from '@/lib/auth-context';
import styles from './page.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(): Promise<void> {
    if (isLoading) return;

    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        router.push('/home');
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <IonContent>
      <div className={styles['auth-container']}>
        <div className={styles['auth-header']}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="NaturaPost" className={styles['logo-img']} />
          <h1 className={styles['app-title']}>NaturaPost</h1>
          <p className={styles['app-subtitle']}>Entre na sua conta</p>
        </div>

        <div className={styles['auth-form']}>
          {errorMessage && (
            <div className={styles['error-banner']}>
              <IonText color="danger">{errorMessage}</IonText>
            </div>
          )}

          <div className={styles['field-group']}>
            <IonLabel className={styles['field-label']}>E-mail</IonLabel>
            <IonInput
              type="email"
              placeholder="seu@email.com"
              value={email}
              onIonInput={(e) => setEmail(String(e.detail.value ?? ''))}
              className={styles['form-input']}
            />
          </div>

          <div className={styles['field-group']}>
            <IonLabel className={styles['field-label']}>Senha</IonLabel>
            <IonInput
              type="password"
              placeholder="Sua senha"
              value={password}
              onIonInput={(e) => setPassword(String(e.detail.value ?? ''))}
              className={styles['form-input']}
            />
          </div>

          <div className={styles['submit-area']}>
            <IonButton
              expand="block"
              color="success"
              disabled={!email || !password || isLoading}
              onClick={handleLogin}
              className="btn-primary"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </IonButton>
          </div>

          <div className={styles['auth-footer']}>
            <IonText color="medium">
              Não tem uma conta?
              <Link href="/register" className={styles.link}>
                Cadastre-se
              </Link>
            </IonText>
          </div>
        </div>
      </div>
    </IonContent>
  );
}
