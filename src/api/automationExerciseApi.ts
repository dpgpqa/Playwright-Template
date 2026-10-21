import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  brand: z.string(),
  category: z.object({
    usertype: z.object({ usertype: z.string() }),
    category: z.string(),
  }),
});

export const ProductsListSchema = z.object({
  responseCode: z.number(),
  products: z.array(ProductSchema),
});

export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  title: z.enum(['Mr', 'Mrs']),
  birth_date: z.string(),
  birth_month: z.string(),
  birth_year: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  company: z.string().optional(),
  address1: z.string(),
  address2: z.string().optional(),
  country: z.string(),
  zipcode: z.string(),
  state: z.string(),
  city: z.string(),
  mobile_number: z.string(),
});

export const APIResponseSchema = z.object({
  responseCode: z.number(),
  message: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductsList = z.infer<typeof ProductsListSchema>;
export type User = z.infer<typeof UserSchema>;
export type APIResponse = z.infer<typeof APIResponseSchema>;