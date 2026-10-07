export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  userId: string;
}

/** Dados enviados no LOGIN */
export interface AuthRequestDto {
  email: string;
  password: string;
}

/** Resposta do LOGIN (tokens + email) */
export interface AuthResponseDto {
  token: string; // Token JWT (válido 24h)
  refreshToken: string; // Token de renovação (válido 7 dias)
  email: string;
  id: string;
}

/** Dados para RENOVAR TOKEN */
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

// ============================================================
// DTOs DE USUÁRIO
// ============================================================

/** Dados para CRIAR USUÁRIO (cadastro) */
export interface UserCreateDto {
  sellerName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

/** Resposta com dados do USUÁRIO */
export interface UserResponseDto {
  id: string;
  sellerName: string;
  email: string;
  phoneNumber: string;
}

/** Dados para ATUALIZAR USUÁRIO (todos opcionais) */
export interface UserUpdatedDto {
  sellerName?: string;
  email?: string;
  phoneNumber?: string;
}

// ============================================================
// DTOs DE PRODUTO
// ============================================================

/** Resposta com dados do PRODUTO */
export interface ProductResponseDto {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  userId: string;
}

// ============================================================
// DTOs DE BUSCA DE PRODUTO
// ============================================================

/** Filtros para BUSCAR PRODUTOS */
export interface ProductSearchDto {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ============================================================
// DTOs DE IMAGEM SOCIAL (REPOST)
// ============================================================

/** Dados para GERAR IMAGEM SOCIAL */
export interface SocialImageRequestDto {
  products: Array<{
    title: string;
    price: number;
    imageUrl: string;
    productId: string;
  }>;
}

/** Resposta com IMAGENS SOCIAIS GERADAS */
export interface SocialImageResponseDto {
  images: Array<{
    originalTitle: string;
    imageUrl: string;
    priceUsed: number;
  }>;
}
