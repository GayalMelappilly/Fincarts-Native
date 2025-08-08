// // Add product
// export const addProduct = async (productData: FishProduct) => {

//     console.log("Product details : ",productData)


//     const accessToken = localStorage.getItem('sellerAccessToken') as string
//     try {
//         const response = await fetchWithAuth(`${apiUrl}/seller/product/add-product`, {
//             method: 'POST',
//             body: JSON.stringify(productData)
//         },accessToken, 'seller')

//         console.log("RESPONSE : ",response)

//         const data = await response

//         console.log("DATA : ",data)

//         if (!data.success) {
//             throw new Error('Failed to fetch user profile');
//         }
//         return data;

//     } catch (error) {
//         console.error('Error add new fish to the list : ', error);
//         throw error;
//     }

// }

// // Edit product
// export const editProduct = async (productData: FishProduct) => {

//     console.log("Product details : ",productData)
//     const accessToken = localStorage.getItem('sellerAccessToken') as string

//     try {
//         const response = await fetchWithAuth(`${apiUrl}/seller/product/edit-product/${productData.id}`, {
//             method: 'PUT',
//             body: JSON.stringify(productData)
//         },accessToken, 'seller')

//         console.log("RESPONSE : ",response)

//         const data = await response

//         console.log("DATA : ",data)

//         if (!data.success) {
//             throw new Error('Product edit error');
//         }
//         return data;

//     } catch (error) {
//         console.error('Error edit fish : ', error);
//         throw error;
//     }

// }

// // Delete product
// export const deleteProduct = async (productId: string) => {
//     const accessToken = localStorage.getItem('sellerAccessToken') as string

//     try {
//         const response = await fetchWithAuth(`${apiUrl}/seller/product/delete-product/${productId}`, {
//             method: 'DELETE',
//         },accessToken, 'seller')

//         console.log("RESPONSE : ",response)

//         const data = await response

//         console.log("DATA : ",data)

//         if (!data.success) {
//             throw new Error('Product edit error');
//         }
//         return data;

//     } catch (error) {
//         console.error('Error edit fish : ', error);
//         throw error;
//     }
// }

// // Get seller profile
// export const getSellerProducts = async () => {

//     console.log("Get seller products")
//     const accessToken = localStorage.getItem('sellerAccessToken') as string

//     try {

//         const response = await fetchWithAuth(`${apiUrl}/seller/products`, {
//             method: 'GET'
//         }, accessToken, 'seller')

//         const data = await response

//         console.log('Seller list : ', data)

//         if (!data.success) {
//             throw new Error('Failed to fetch user profile');
//         }

//         return data;

//     } catch (error) {
//         console.error('Error fetching the seller list : ', error);
//         throw error;
//     }
// }

// // Update seller profile
// export const updateSellerProfile = async (updatedData: SellerData) => {
//     console.log("Product details : ",updatedData)
//     const accessToken = localStorage.getItem('sellerAccessToken') as string

//     try {
//         const response = await fetchWithAuth(`${apiUrl}/seller/update-profile`, {
//             method: 'PUT',
//             body: JSON.stringify(updatedData)
//         },accessToken, 'seller')

//         console.log("RESPONSE : ",response)

//         const data = await response

//         console.log("DATA : ",data)

//         if (!data.success) {
//             throw new Error('Profile update error');
//         }
//         return data;

//     } catch (error) {
//         console.error('Error updating the profile : ', error);
//         throw error;
//     }
// }

// export interface PasswordForm {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// // Update seller password
// export const updateSellerPassword = async (form: PasswordForm) => {
//     console.log('passwords : ',form.currentPassword, form.confirmPassword)
//     const accessToken = localStorage.getItem('sellerAccessToken') as string

//     try {
//         const response = await fetchWithAuth(`${apiUrl}/seller/update-password`, {
//             method: 'PUT',
//             body: JSON.stringify(form)
//         },accessToken, 'seller')

//         console.log("RESPONSE : ",response)

//         const data = await response

//         if (!data.success) {
//             throw new Error('Password update error');
//         }
//         return data;

//     } catch (error) {
//         console.error('Error updating password : ', error);
//         throw error;
//     }
// }

// type changePasswordType = {
//   newPassword: string,
//   confirmPassword: string
// }
// // Change seller password (Forgot password)
// export const changeSellerPassword = async (passwordData: changePasswordType) => {
//     if (!passwordData.newPassword || !passwordData.confirmPassword) {
//     return Error('Password must be provided')
//   }

//   let verificationToken;
//   if (typeof window !== 'undefined') {
//     verificationToken = localStorage.getItem('fpvt')
//   }

//   try {
//     const response = await fetch(`${apiUrl}/seller/change-password/`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({verificationToken, newPassword: passwordData.newPassword})
//     })

//     const data = await response.json()
//     console.log("data :", data)
//     return data
//   } catch (error) {
//     console.error('Change seller password error : ', error)
//     throw error;
//   }
// }