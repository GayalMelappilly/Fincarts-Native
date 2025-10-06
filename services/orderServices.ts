
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.EXPO_PUBLIC_SERVER_API : process.env.EXPO_PUBLIC_LOCAL_HOST_API

interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  sort?: string;
  startDate?: string;
  endDate?: string;
}

export const getOrders = async (id: string, params?: OrderQueryParams) => {

    console.log("id : ", id)

    try {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        const response = await fetch(`${apiUrl}/seller/native/order/get-orders/${id}?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })

        const data = await response.json();

        console.log("Get seller orders : ", data.data.orders)

        return data;
    } catch (error) {
        console.error('Fetch seller orders error:', error);
        throw error;
    }
}

type actionData = {
    action: string,
    orderId: string,
    receipt: string | null  
}

export const orderAction = async ({ action, orderId, receipt }: actionData) => {
    if (!action || !orderId) {
        throw new Error('Action and orderId must be provided');
    }

    try {
        // Build query parameters
        const queryParams = new URLSearchParams({
            action,
            orderId,
            ...(receipt && { receipt }) // Only add receipt if it exists
        }).toString();

        const response = await fetch(`${apiUrl}/seller/native/order/order-action?${queryParams}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        const data = await response.json();

        console.log("ORDER ACTION RESPONSE : ", data);

        if (!data.success) {
            throw new Error('Order action failed');
        }
        
        return data;
    } catch (error) {
        console.error('Order action error : ', error);
        throw error;
    }
};