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

export const loginUserAPI = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:4953/v1/users/login",
        userData,
        { withCredentials: true } // ✅ Đảm bảo gửi cookies nếu cần
      );
  
      // ✅ Debug dữ liệu trả về từ server
      //console.log("Login Response:", response.data);
  
      return response.data; // ✅ Trả về userId, accessToken,...
    } catch (error) {
      console.error("Login API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed!");
    }
};
  
export const logoutUserAPI = async () => {
const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
return response.data
}