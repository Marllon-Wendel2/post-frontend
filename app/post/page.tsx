'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, type ChangeEvent } from 'react';
import { CameraOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import { IonButton, IonInput, IonLabel, IonText } from '@/components/ionic';
import BottomNav from '@/components/bottom-nav/bottom-nav';
import { useAuth } from '@/lib/auth-context';
import { useAuthGuard } from '@/lib/guards';
import { addProduct } from '@/lib/products';
import styles from './page.module.css';

export default function PostPage() {
  useAuthGuard();
  const { user } = useAuth();
  const router = useRouter();

  const sellerName = user?.name ?? 'Vendedora';

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = title.trim().length > 0 && Number(price) > 0 && imageFile !== null;

  function onFileSelected(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function triggerFileInput(): void {
    fileInputRef.current?.click();
  }

  async function submit(): Promise<void> {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await addProduct({
        title,
        price: Number(price),
        imageFile: imageFile!,
      });
      router.push('/home');
    } catch (error) {
      console.error('Erro ao publicar produto:', error);
      alert('Erro ao publicar produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-post">
      <div className={styles['post-form']}>
        <input
          id="fileInput"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles['file-input-hidden']}
          onChange={onFileSelected}
        />

        <div className={styles['upload-area']} onClick={triggerFileInput}>
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} className={styles['upload-preview']} alt="Pré-visualização" />
          ) : (
            <div className={styles['upload-placeholder']}>
              <CameraOutlined className={styles['upload-icon']} />
              <IonLabel>Adicionar foto</IonLabel>
            </div>
          )}
        </div>

        <div className={styles['form-fields']}>
          <div className={styles['field-group']}>
            <IonLabel className={styles['field-label']}>Nome do produto</IonLabel>
            <IonInput
              type="text"
              placeholder="Ex: Sabonete de Lavanda"
              value={title}
              onIonInput={(e) => setTitle(String(e.detail.value ?? ''))}
              className={styles['form-input']}
            />
          </div>

          <div className={styles['field-group']}>
            <IonLabel className={styles['field-label']}>Preço (R$)</IonLabel>
            <IonInput
              type="number"
              placeholder="0,00"
              value={price}
              onIonInput={(e) => setPrice(String(e.detail.value ?? ''))}
              className={styles['form-input']}
            />
          </div>

          <div className={styles['field-group']}>
            <IonLabel className={styles['field-label']}>Vendedora</IonLabel>
            <div className={styles['seller-badge']}>
              <IonText color="success">{sellerName}</IonText>
            </div>
          </div>
        </div>

        <div className={styles['submit-area']}>
          <IonButton
            expand="block"
            color="success"
            disabled={!isValid || isSubmitting}
            onClick={submit}
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <ReloadOutlined slot="start" className={styles.spin} />
                Publicando...
              </>
            ) : (
              <>
                <CheckOutlined slot="start" className="btn-icon" />
                Publicar
              </>
            )}
          </IonButton>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}