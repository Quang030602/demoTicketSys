import authorizedAxiosInstance from '../utils/authorizeAxios'
import { API_ROOT } from '../utils/constants'
import { toast } from 'react-toastify'

export const registerUserAPI = async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
    toast.success('Account created! Please verify your email.', { theme: 'colored' })
    return response.data
}
  
export const verifyUserAPI = async (data) => {
const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
toast.success('Account verified!', { theme: 'colored' })
return response.data
}

export const refreshTokenAPI = async () => {
const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/refresh_token`)
return response.data
}