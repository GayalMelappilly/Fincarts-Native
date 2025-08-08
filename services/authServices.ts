export interface SellerDataCreate {
  business_name: string;
  business_type: string;
  email: string;
  phone: string;
  alternate_phone: string | null;
  gstin: string | null;
  pan_card: string | null;
  legal_business_name: string;
  display_name: string;
  store_description: string | null;
  logo_url: string | null;
  website_url: string | null;
  address: {
    address_line1: string;
    address_line2: string | null;
    landmark: string | null;
    pin_code: string;
    city: string;
    state: string;
    country: string;
  };
  bank_details: {
    account_number: string | null;
    ifsc_code: string | null;
    account_holder_name: string | null;
  };
  password: string;
}

const apiUrl = process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SERVER_API : process.env.NEXT_PUBLIC_LOCAL_HOST_API

// Create seller profile
export const createSellerProfile = async (formData: SellerDataCreate) => {

    console.log("FORM DATA : ", formData)
    console.log("REACHED")

    try {
        const response = await fetch(`/api/seller/create-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return {
            success: true
        }

    } catch (error) {
        console.error('Registration error : ', error)
        throw error;
    }
}

// Get seller details
// export const getSellerDetails = async (accessToken: string) => {

//     try {
//         const response = await fetchWithAuth(`${apiUrl}/seller/get-current-seller`, {
//             method: 'GET',
//         }, accessToken, 'seller')

//         const data = await response;

//         if (!data.success) {
//             throw new Error('Failed to fetch user profile');
//         }
//         return data;
//     } catch (error) {
//         console.error('Fetch user profile error:', error);
//         throw error;
//     }
// }

interface FormData {
    identifier: string;
    password: string;
}

// Login seller
export const loginSeller = async (formData: FormData) => {
    console.log("FORM DATA : ", formData)
    console.log("REACHED")

    try {
        const response = await fetch(`${apiUrl}/seller/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })

        // if (!response.ok) {
        //     throw new Error('Login failed');
        // }

        const data = await response.json()

        console.log("data :", data)

        return data
    } catch (error) {
        console.error('Login error : ', error)
        throw error;
    }
}

// Verify seller email
export const verifySellerEmail = async (email: string) => {
  const res = await fetch(`${apiUrl}/seller/verify-email`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email }),
    credentials: "include"
  })

  const response = await res.json()
  console.log(response)
  return response
}

type OtpDataType = {
  code: string,
  type: string
}

// Confirm seller OTP
export const confirmSellerOtp = async (data: OtpDataType) => {

  const code = data.code

  let token;
  if (data.type === 'auth') {
    token = typeof window !== 'undefined' ? localStorage.getItem('svt') : null
  } else if (data.type === 'forgotPassword') {
    token = typeof window !== 'undefined' ? localStorage.getItem('fpvt') : null
  }

  console.log("tokken : ",token)

  if (!token) {
    console.log("No token found")
    return
  }

  const res = await fetch(`${apiUrl}/seller/confirm-verification-code`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code, token }),
    credentials: "include"
  })

  const response = await res.json()
  console.log(response)
  return response
}

// Logout seller
// export const logoutSeller = async (accessToken: string) => {

//     console.log("Logout seller")

//     try {
//         const response = await fetchWithAuth(`${apiUrl}/seller/logout`, {
//             method: 'GET',
//         }, accessToken, 'seller')

//         const data = await response;

//         await fetch('/api/seller/logout', {
//             credentials: 'include',
//         })

//         if (!data.success) {
//             throw new Error('Failed to fetch user profile');
//         }
//         return data;
//     } catch (error) {
//         console.error('Fetch user profile error:', error);
//         throw error;
//     }
// }