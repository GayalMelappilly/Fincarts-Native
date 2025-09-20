
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.EXPO_PUBLIC_SERVER_API : process.env.EXPO_PUBLIC_LOCAL_HOST_API

export const getOrders = async (id: string) => {

    try {
        const response = await fetch(`${apiUrl}/seller//native/order/get-orders/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })

        const data = await response.json();

        console.log("Get seller orders : ", data)
        
        return data;
    } catch (error) {
        console.error('Fetch seller orders error:', error);
        throw error;
    }
}