export const salesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [3400, 2900, 3100, 4200, 4800, 3800, 4100]
};

export const pieData = [
    { name: "Pending", count: 25, color: "#FBBF24" },
    { name: "Processing", count: 18, color: "#60A5FA" },
    { name: "Shipped", count: 42, color: "#34D399" },
    { name: "Delivered", count: 87, color: "#1E40AF" }
];

export const progressData = [
    { label: "Sales Target", value: 0.8, color: "#1E40AF" },
    { label: "Customer Growth", value: 0.6, color: "#60A5FA" },
    { label: "Revenue Goal", value: 0.9, color: "#34D399" }
];

export const topProducts = [
    { name: "Atlantic Salmon", sales: 125, amount: "$3,750", growth: 12.5 },
    { name: "Fishing Rod Pro", sales: 98, amount: "$4,900", growth: 8.2 },
    { name: "Premium Bait Set", sales: 87, amount: "$1,305", growth: -2.1 },
    { name: "Fish Finder Device", sales: 76, amount: "$9,120", growth: 15.8 }
];

export const recentOrders = [
    { id: "123459", customer: "Michael Brown", status: "Pending", value: "$249.99" },
    { id: "123460", customer: "Jessica White", status: "Processing", value: "$189.50" },
    { id: "123461", customer: "Robert Taylor", status: "Shipped", value: "$345.75" },
    { id: "123462", customer: "Amanda Green", status: "Delivered", value: "$124.25" },
];

export const categoryData = [
    { name: "Seafood", value: 45, color: "#1E40AF" },
    { name: "Equipment", value: 20, color: "#60A5FA" },
    { name: "Bait", value: 15, color: "#34D399" },
    { name: "Accessories", value: 12, color: "#FBBF24" },
    { name: "Other", value: 8, color: "#EF4444" }
];