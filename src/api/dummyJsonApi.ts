import { z } from 'zod';

// Product schemas - list items have fewer fields than single product
export const ProductListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
});

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  price: z.number(),
  discountPercentage: z.number().optional(),
  rating: z.number().optional(),
  stock: z.number().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  isDeleted: z.boolean().optional(),
  deletedOn: z.string().optional(),
});

export const ProductsListSchema = z.object({
  products: z.array(ProductListItemSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

// User schemas - list items have fewer fields
export const UserListItemSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  username: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  image: z.string().url().optional(),
});

export const UsersListSchema = z.object({
  users: z.array(UserListItemSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const AuthLoginSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  image: z.string().url(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const CartSchema = z.object({
  id: z.number(),
  products: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      price: z.number(),
      quantity: z.number(),
      total: z.number(),
      discountPercentage: z.number(),
      discountedPrice: z.number(),
      thumbnail: z.string().url(),
    })
  ),
  total: z.number(),
  discountedTotal: z.number(),
  userId: z.number(),
  totalProducts: z.number(),
  totalQuantity: z.number(),
});

export type ProductListItem = z.infer<typeof ProductListItemSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductsList = z.infer<typeof ProductsListSchema>;
export type UserListItem = z.infer<typeof UserListItemSchema>;
export type User = z.infer<typeof UserSchema>;
export type UsersList = z.infer<typeof UsersListSchema>;
export type AuthLogin = z.infer<typeof AuthLoginSchema>;
export type Cart = z.infer<typeof CartSchema>;