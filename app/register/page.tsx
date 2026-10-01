'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IonButton, IonInput, IonLabel, IonText } from '@/components/ionic';
import { useAuth } from '@/lib/auth-context';
import styles from './page.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;

  const isPasswordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[@#$%^&+=!_.\-]/.test(password);

  const isFormValid =
    name.trim().length > 0 && email.trim().length > 0 && isPasswordValid && passwordsMatch;

  async function handleRegister(): Promise<void> {
    if (!isFormValid || isLoading) return;

    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await register({
        name,
        email,
        phone: phone || undefined,
        password,
      });

      if (result.success) {
        router.push('/home');
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles['auth-container']}>
      <div className={`${styles['auth-card']} rise`}>
        <div className={styles['auth-header']}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="NaturaPost" className={styles['logo-img']} />
          <h1 className={styles['app-title']}>NaturaPost</h1>
          <p className={styles['app-subtitle']}>Crie sua conta</p>
        </div>

        <div className={styles['auth-form']}>
        {errorMessage && (
          <div className={styles['error-banner']}>
            <IonText color="danger">{errorMessage}</IonText>
          </div>
        )}

        <div className={styles['field-group']}>
          <IonLabel className={styles['field-label']}>Nome completo</IonLabel>
          <IonInput
            type="text"
            placeholder="Seu nome"
            value={name}
            onIonInput={(e) => setName(String(e.detail.value ?? ''))}
            className={styles['form-input']}
          />
        </div>

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
          <IonLabel className={styles['field-label']}>Telefone (opcional)</IonLabel>
          <IonInput
            type="tel"
            placeholder="(11) 99999-0000"
            value={phone}
            onIonInput={(e) => setPhone(String(e.detail.value ?? ''))}
            className={styles['form-input']}
          />
        </div>

        <div className={styles['field-group']}>
          <IonLabel className={styles['field-label']}>Senha</IonLabel>
          <IonInput
            type="password"
            placeholder="Mín. 8 caracteres, 1 maiúscula, 1 especial"
            value={password}
            onIonInput={(e) => setPassword(String(e.detail.value ?? ''))}
            className={styles['form-input']}
          />
          {password.length > 0 && !isPasswordValid && (
            <IonText color="danger" className={styles['field-hint']}>
              Senha: 8+ caracteres, 1 maiúscula, 1 minúscula, 1 especial
            </IonText>
          )}
        </div>

        <div className={styles['field-group']}>
          <IonLabel className={styles['field-label']}>Confirmar senha</IonLabel>
          <IonInput
            type="password"
            placeholder="Repita a senha"
            value={confirmPassword}
            onIonInput={(e) => setConfirmPassword(String(e.detail.value ?? ''))}
            className={styles['form-input']}
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <IonText color="danger" className={styles['field-hint']}>
              As senhas não coincidem
            </IonText>
          )}
        </div>

        <div className={styles['submit-area']}>
          <IonButton
            expand="block"
            color="success"
            disabled={!isFormValid || isLoading}
            onClick={handleRegister}
            className="btn-primary"
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </IonButton>
        </div>

        <div className={styles['auth-footer']}>
          <IonText color="medium">
            Já tem uma conta?
            <Link href="/login" className={styles.link}>
              Entrar
            </Link>
          </IonText>
        </div>
        </div>
      </div>

      <p className={styles['auth-legal']}>
        Ao criar sua conta você aceita os Termos e a Política de Privacidade.
      </p>
    </div>
  );
}