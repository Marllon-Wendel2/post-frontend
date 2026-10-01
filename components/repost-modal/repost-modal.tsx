'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CheckSquareOutlined,
  CloseOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { IonButton, IonItem, IonLabel, IonText, IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonModal, IonInput } from '@/components/ionic';
import { generateSocialImages } from '@/lib/products';
import type { Product, SocialImageResponseDto } from '@/lib/types';
import styles from './repost-modal.module.css';

interface RepostModalProps {
  isOpen: boolean;
  products: Product[];
  onDismiss: () => void;
  onReposted: () => void;
}

export default function RepostModal({
  isOpen,
  products,
  onDismiss,
  onReposted,
}: RepostModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [editableProducts, setEditableProducts] = useState<Product[]>(products);
  const [isReposting, setIsReposting] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<SocialImageResponseDto | null>(
    null
  );
  const wasOpen = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setEditableProducts(products);
      setGeneratedImages(null);
    }
    wasOpen.current = isOpen;
  }, [isOpen, products]);

  function updatePrice(productId: string, newPrice: number): void {
    setEditableProducts((items) =>
      items.map((item) => (item.id === productId ? { ...item, price: newPrice } : item))
    );
  }

  async function repost(): Promise<void> {
    setIsReposting(true);
    try {
      const result = await generateSocialImages(editableProducts);
      setGeneratedImages(result);
      onReposted();
    } catch (error) {
      console.error('Erro ao gerar imagens:', error);
    } finally {
      setIsReposting(false);
    }
  }

  async function downloadImage(imageUrl: string, title: string): Promise<void> {
    try {
      const response = await fetch(imageUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const fileName = `${title.replace(/\s+/g, '_')}.png`;
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
      window.open(imageUrl, '_blank');
    }
  }

  async function downloadAll(): Promise<void> {
    const images = generatedImages?.images;
    if (!images) return;
    for (const img of images) {
      await downloadImage(img.imageUrl, img.originalTitle);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  async function shareAll(): Promise<void> {
    const images = generatedImages?.images;
    if (!images?.length) return;

    try {
      const files = await Promise.all(
        images.map(async (img) => {
          const response = await fetch(img.imageUrl, { cache: 'no-store' });
          const blob = await response.blob();
          const fileName = `${img.originalTitle.replace(/\s+/g, '_')}.png`;
          return new File([blob], fileName, { type: 'image/png' });
        })
      );

      if (navigator.share && navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({ files, title: 'Imagens Natura' });
        return;
      }

      for (const file of files) {
        const blobUrl = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = file.name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 100);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Erro ao compartilhar imagens:', error);
    }
  }

  if (!isMounted) {
    return null; 
  }

  return (
    <IonModal
      isOpen={isOpen}
      className={styles['repost-modal']}
      onDidDismiss={onDismiss}
    >
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Itens Selecionados ({products.length})</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>
              <CloseOutlined slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {generatedImages ? (
          <div className={styles['result-container']}>
            <h3 className={styles['result-title']}>Imagens geradas com sucesso!</h3>
            {generatedImages.images.map((img) => (
              <div key={img.originalTitle} className={styles['result-item']}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.imageUrl} alt={img.originalTitle} />
                <p className={styles['result-text']}>
                  {img.originalTitle} — R$ {img.priceUsed.toFixed(2)}
                </p>
                <IonButton
                  fill="outline"
                  color="success"
                  size="small"
                  onClick={() => downloadImage(img.imageUrl, img.originalTitle)}
                >
                  <DownloadOutlined slot="start" />
                  Baixar imagem
                </IonButton>
              </div>
            ))}
            <IonButton
              expand="block"
              fill="outline"
              color="success"
              className={styles['download-all-btn']}
              onClick={downloadAll}
            >
              <DownloadOutlined slot="start" />
              Baixar todas
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              color="success"
              className={styles['download-all-btn']}
              onClick={shareAll}
            >
              <ShareAltOutlined slot="start" />
              Compartilhar todas
            </IonButton>
          </div>
        ) : (
          <IonList>
            {editableProducts.map((item) => (
              <IonItem key={item.id}>
                <div className={styles['item-image']}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.title} />
                </div>
                <IonLabel>
                  <h3 className={styles['item-title']}>{item.title}</h3>
                  <div className={styles['price-row']}>
                    <IonText color="success">R$</IonText>
                    <IonInput
                      type="number"
                      value={String(item.price)}
                      onIonInput={(e) => updatePrice(item.id, Number(e.detail.value ?? 0))}
                      className={styles['price-input']}
                    />
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>

      <div className={styles['modal-buttons']}>
        {!generatedImages && (
          <IonButton expand="block" color="success" onClick={repost} disabled={isReposting}>
            {isReposting ? (
              <>
                <ReloadOutlined slot="start" className={styles.spin} />
                Gerando imagens...
              </>
            ) : (
              <>
                <CheckSquareOutlined slot="start" />
                Gerar Imagens ({editableProducts.length})
              </>
            )}
          </IonButton>
        )}
        <IonButton
          expand="block"
          color="medium"
          fill="outline"
          onClick={onDismiss}
          disabled={isReposting}
        >
          {generatedImages ? 'Fechar' : 'Cancelar'}
        </IonButton>
      </div>
    </IonModal>
  );
}