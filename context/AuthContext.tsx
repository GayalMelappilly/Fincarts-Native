"use client";

import { createContext, useContext, useState } from "react";

// Type definitions
interface BusinessInfo {
  businessName: string;
  businessType: string;
  legalBusinessName: string;
  displayName: string;
  storeDescription: string;
  logoUrl: string;
  websiteUrl: string;
  gstin: string;
  status: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  alternatePhone: string;
}

interface Location {
  city: string | undefined;
  state: string | undefined;
  country: string | undefined;
  pinCode: string | undefined;
}

interface Address {
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  addressType: string;
  location: Location;
}

interface Metrics {
  totalSales: number;
  totalOrders: number;
  avgRating: number;
  totalListings: number;
  activeListings: number;
  lastCalculatedAt: Date;
  orderStatusCounts: {
    pending: number,
    processing: number,
    shipped: number,
    delivered: number
  },
}

interface Settings {
  autoAcceptOrders: boolean;
  defaultWarrantyPeriod: number;
  returnWindow: number;
  shippingProvider: string | null;
  minOrderValue: number;
}

interface PaymentSettings {
  paymentCycle: string;
  minPayoutAmount: number;
}

interface SalesHistory {
  dailySales: number;
  orderCount: number;
  newCustomers: number;
  cancellations: number;
  date: string;
}

interface RecentOrder {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

interface TopSellingProduct {
  id: string;
  name: string;
  image: string;
  sold: number;
  stock: number;
}

export interface TopFishListing {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantityAvailable: number;
  age: string;
  breed: string;
  color: string;
  size: string;
  stock: number;
  listingStatus: "active" | "draft" | "out_of_stock";
  careInstructions: Record<string, string>;
  dietaryRequirements: Record<string, string>;
  images: string[];
  isFeatured: boolean;
  viewCount: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface SalesChartData {
  month: string;
  sales: number;
}

export interface Business {
  id: string;
  businessInfo: BusinessInfo;
  contactInfo: ContactInfo;
  address: Address;
  metrics: Metrics;
  settings: Settings;
  paymentSettings: PaymentSettings;
  recentSales: SalesHistory[];
  recentOrders: RecentOrder[];
  topSellingProducts: TopSellingProduct[];
  topFishListings: TopFishListing[];
  salesChartData: SalesChartData[];
  commissionRate: string;
  createdAt: string;
  updatedAt: string;
}

type AuthContextType = {
  sellerData: Business | null,
  setSellerData: React.Dispatch<React.SetStateAction<Business | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  profileUrl: string | null;
  setProfileUrl: (profileUrl: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sellerData, setSellerData] = useState<Business | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [profileUrl, setProfileUrl] = useState<string | null>(null)

  return (
    <AuthContext.Provider value={{ sellerData, setSellerData, isLoggedIn, setIsLoggedIn, profileUrl, setProfileUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useSellerAuth must be used within AuthProvider");
  return context;
};
