// hooks/useAuth.js
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { loginUserAPI } from '../redux/user/userSlice'

export const useAuth = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    axios.get('http://localhost:4953/v1/users/refresh-token', {
      withCredentials: true
    }).then(res => {
      // Giả sử res.data chứa { userId, email,... }
      dispatch(loginUserAPI.fulfilled(res.data))
    }).catch(err => {
      console.warn("Refresh token failed:", err.message)
    })
  }, [dispatch])
}
