interface SellerStats {
  totalSales: number;
  completedOrders: number;
  pendingOrders: number;
  totalReviews: number;
  averageRating: number;
}

interface SellerProfile {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string;
  coverImage: string;
  memberSince: string;
  stats: SellerStats;
}

export const sellerProfile: SellerProfile = {
    id: "seller123",
    name: "Tyrion Lannister",
    businessName: "Lannister's Farm",
    email: "tyrion@got.com",
    phone: "+91 1023456789",
    address: "Casterly Rock, King's Landing",
    bio: "Bringing royal flair to ornamental fish, one fin at a time.",
    avatar: "https://static.tvtropes.org/pmwiki/pub/images/got_tyrion_lannister.png",
    coverImage: "https://www.tallengestore.com/cdn/shop/products/Art_From_Game_Of_Thrones_-_The_Imp_-_Tyrion_Lannister_And_Drogon_065253ef-120a-4d3f-a6ec-9732c15df541.jpg?v=1480415684",
    memberSince: "Apr 2025",
    stats: {
      totalSales: 1256,
      completedOrders: 248,
      pendingOrders: 12,
      totalReviews: 178,
      averageRating: 4.8
    }
  };