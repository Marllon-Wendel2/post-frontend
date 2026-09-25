import api from './api';
import type {
  Product,
  ProductResponseDto,
  ProductSearchDto,
  SocialImageRequestDto,
  SocialImageResponseDto,
} from './types';

export async function loadProducts(userId: string): Promise<Product[]> {
  if (!userId) {
    console.log(`userId não definido`);
    return [];
  }

  try {
    const response = await api.get<ProductResponseDto[]>(`/products/user/${userId}`);

    return response.data.map(mapProduct);
  } catch (error) {
    console.error('Erro ao carregar os produtos', error);
    return [];
  }
}

export async function addProduct(data: {
  title: string;
  price: number;
  imageFile: File;
}): Promise<Product> {
  const formData = new FormData();

  formData.append(
    'product',
    JSON.stringify({
      title: data.title,
      price: data.price,
      isActive: true,
    })
  );
  formData.append('image', data.imageFile, data.imageFile.name);

  const response = await api.post<ProductResponseDto>('/products', formData);

  return mapProduct(response.data);
}

export async function generateSocialImages(
  products: Product[]
): Promise<SocialImageResponseDto> {
  const requestDto: SocialImageRequestDto = {
    products: products.map((p) => ({
      title: p.title,
      price: p.price,
      imageUrl: p.imageUrl,
    })),
  };
  const response = await api.post<SocialImageResponseDto>(
    '/products/social-image',
    requestDto
  );
  return response.data;
}

export async function deleteProduct(productId: string): Promise<void> {
  await api.delete(`/products/${productId}`);
}

export async function searchProducts(filters: ProductSearchDto): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.name) params.set('name', filters.name);
  if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());

  const response = await api.get<ProductResponseDto[]>(
    `/products/search?${params.toString()}`
  );
  return response.data.map(mapProduct);
}

function mapProduct(dto: ProductResponseDto): Product {
  return {
    id: dto.id,
    title: dto.title,
    price: dto.price,
    imageUrl: dto.imageUrl,
    isActive: dto.isActive,
    userId: dto.userId,
  };
}
