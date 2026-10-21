import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().optional(),
  address1: z.string(),
  address2: z.string().optional(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  zipcode: z.string(),
  phone: z.string(),
});

const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  brand: z.string(),
  category: z.string(),
});

export type TestUser = z.infer<typeof UserSchema>;
export type TestProduct = z.infer<typeof ProductSchema>;

function loadJSON<T>(file: string, schema: z.ZodSchema<T>): T {
  const fullPath = path.resolve('test-data', file);
  const raw = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  return schema.parse(raw);
}

export const users = loadJSON('users.json', z.array(UserSchema));
export const products = loadJSON('products.json', z.array(ProductSchema));

export function getUser(role: 'valid' | 'invalid' = 'valid'): TestUser {
  return role === 'valid' ? users[0] : users[1];
}

export function getRandomProduct(): TestProduct {
  return products[Math.floor(Math.random() * products.length)];
}