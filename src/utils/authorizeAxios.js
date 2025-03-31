import axios from 'axios'
import { interceptorLoadingElements } from '../utils/formatters'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '../apis'
import { logoutUserAPI } from '../redux/user/userSlice'


let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore}
// khởi tạo 1 đối tưởng Axios mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()

// thời gian chờ tối đa của 1 request
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: true cho phép axios tự động đính kèm và gửi cookie trong request tới BE
// phục vụ trường hợp nếu chúng ta sử dụng JWT Tokens (refresh & access) theo cơ chế httpOnly Cookie
authorizedAxiosInstance.defaults.withCredentials = true

// can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use((config) => {
  interceptorLoadingElements(true)

  const accessToken = localStorage.getItem('accessToken')
  const role = localStorage.getItem('userRole')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
let refreshTokenPromise = null


// can thiệp vào giữa những cái response nhận về từ API
authorizedAxiosInstance.interceptors.response.use((response) => {
  interceptorLoadingElements(false)
  return response
}, (error) => {

  interceptorLoadingElements(false)


  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  }
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // xử lý logout

  const originalRequests = error.config
  if (error?.response?.status === 410 && !originalRequests._retry) {
    originalRequests._retry = true

    if (!refreshTokenPromise) {
      refreshTokenPromise= refreshTokenAPI()
        .then(( data ) => {
          return data?.accessToken
        })
        .catch(( _error ) => {
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      return authorizedAxiosInstance(originalRequests)
    })
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance