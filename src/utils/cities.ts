import { Category } from '../types';

export const INDIAN_CITIES = [
  'All India',
  'Bengaluru',
  'Mumbai',
  'Delhi-NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Anantapur',
  'Chandigarh',
  'Kochi',
  'Indore',
  'Bhopal',
  'Patna',
  'Coimbatore',
  'Visakhapatnam',
  'Surat',
  'Nagpur',
  'Bhubaneswar',
  'Thiruvananthapuram',
  'Guwahati',
  'Vadodara',
  'Varanasi'
] as const;

export interface CategoryMeta {
  key: Category;
  label: string;
  tagline: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  Civic: {
    key: 'Civic',
    label: 'Civic',
    tagline: 'Garbage, roads, water, electricity & municipal services',
    color: '#0284C7',
    bgColor: '#E0F2FE'
  },
  Money: {
    key: 'Money',
    label: 'Money',
    tagline: 'Banking, UPI glitches, loans, taxes & financial fraud',
    color: '#16A34A',
    bgColor: '#DCFCE7'
  },
  Job: {
    key: 'Job',
    label: 'Job',
    tagline: 'Hiring, toxic workplace, bonds, layoff & career dilemmas',
    color: '#D97706',
    bgColor: '#FEF3C7'
  },
  Consumer: {
    key: 'Consumer',
    label: 'Consumer',
    tagline: 'Defective products, ecommerce refunds, customer service',
    color: '#9333EA',
    bgColor: '#F3E8FF'
  },
  Personal: {
    key: 'Personal',
    label: 'Personal',
    tagline: 'Landlord issues, family, relationships & life hurdles',
    color: '#E11D48',
    bgColor: '#FFE4E6'
  }
};
