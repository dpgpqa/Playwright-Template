import { faker } from '@faker-js/faker';

export interface SignupData {
  title: 'Mr' | 'Mrs';
  name: string;
  email: string;
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export function createSignupData(overrides: Partial<SignupData> = {}): SignupData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    title: faker.datatype.boolean() ? 'Mr' : 'Mrs',
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }),
    password: faker.internet.password({ length: 12 }),
    day: String(faker.number.int({ min: 1, max: 28 })).padStart(2, '0'),
    month: String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0'),
    year: String(faker.number.int({ min: 1950, max: 2005 })),
    firstName,
    lastName,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: 'United States',
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.phone.number(),
    ...overrides,
  };
}

export interface AddressData {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  phone: string;
}

export function createAddressData(overrides: Partial<AddressData> = {}): AddressData {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: 'United States',
    state: faker.location.state(),
    city: faker.location.city(),
    zip: faker.location.zipCode(),
    phone: faker.phone.number(),
    ...overrides,
  };
}

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export function createPaymentData(overrides: Partial<PaymentData> = {}): PaymentData {
  return {
    nameOnCard: faker.finance.accountName(),
    cardNumber: '4111111111111111', // Valid test Visa
    cvc: '123',
    expiryMonth: '12',
    expiryYear: String(new Date().getFullYear() + 5),
    ...overrides,
  };
}

export interface DummyJSONProduct {
  title: string;
  price: number;
  category: string;
}

export function createDummyJSONProduct(overrides: Partial<DummyJSONProduct> = {}): DummyJSONProduct {
  return {
    title: faker.commerce.productName(),
    price: faker.number.float({ min: 1, max: 500, fractionDigits: 2 }),
    category: faker.commerce.department(),
    ...overrides,
  };
}