export const formatCurrency = (amount: number | null | undefined) => {
    if (amount == null || isNaN(Number(amount))) {
        return '₹0.00';
    }
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
        return '₹0.00';
    }
    return `₹${numericAmount.toFixed(2)}`;
};