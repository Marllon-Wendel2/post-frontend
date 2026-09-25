import api from './api';
import type { Product, ProductResponseDto, User, UserResponseDto, UserUpdatedDto } from './types';

export interface ProfileStats {
  productsCount: number;
}

export interface ProfileData {
  user: User;
  stats: ProfileStats;
  products: Product[];
}

export async function getProfile(userId: string): Promise<ProfileData> {
  if (!userId) throw new Error('userId não definido');

  const [userResponse, productResponse] = await Promise.all([
    api.get<UserResponseDto>(`/users/${userId}`),
    api.get<ProductResponseDto[]>(`/products/user/${userId}`),
  ]);

  const userData = userResponse.data;
  const user: User = {
    id: userData.id,
    name: userData.sellerName,
    email: userData.email,
    phone: userData.phoneNumber,
  };

  const products: Product[] = productResponse.data.map((dto) => ({
    id: dto.id,
    title: dto.title,
    price: dto.price,
    imageUrl: dto.imageUrl,
    isActive: dto.isActive,
    userId: dto.userId,
  }));

  return {
    user,
    stats: { productsCount: products.length },
    products,
  };
}

export async function updateProfile(
  userId: string,
  data: { name?: string; phone?: string }
): Promise<{ success: boolean; message: string }> {
  try {
    const updateDto: UserUpdatedDto = {};
    if (data.name !== undefined) updateDto.sellerName = data.name;
    if (data.phone !== undefined) updateDto.phoneNumber = data.phone;
    await api.patch(`/users/${userId}`, updateDto);
    return { success: true, message: 'Perfil atualizado!' };
  } catch {
    return { success: false, message: 'Erro ao atualizar perfil.' };
  }
}
