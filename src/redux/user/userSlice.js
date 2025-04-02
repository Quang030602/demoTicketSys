import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '../../utils/authorizeAxios'
import { API_ROOT } from '../../utils/constants'
import { toast } from 'react-toastify'


// Khởi tạo giá trị State của một Slice trong redux
const initialState = {
  currentUser: null
}
// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux
// dùng Middleware createAsyncThunk đi kèm với extraReducers

export const loginUserAPI = createAsyncThunk(
  "user/loginUserAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authorizedAxiosInstance.post(
        `${API_ROOT}/v1/users/login`,
        data
      );

      // ✅ Debug response từ server
      //console.log("Login Response:", response.data);

      // ✅ Kiểm tra nếu userId không tồn tại
      if (!response.data?.userId) {
        throw new Error("userId is missing from response");
      }

      return response.data;
    } catch (error) {
      console.error("Login API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)
export const loginWithQRAPI = createAsyncThunk('user/loginWithQR', async (qrData, { rejectWithValue }) => {
  try {
    console.log("QR Data API slice:", qrData); // Debug QR data
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login-with-qr`, qrData);
    console.log("Login with QR Response:", response.data); // Debug response từ server
    return response.data; // Trả về userId, userRole từ API
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});
export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logout successfully!', { theme: 'colored' })
    }
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk (
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return response.data
  }
)
// Khởi tạo một Slice trong redux store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  // extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) =>
    {
    // action.payload là response.data từ API trả về
      const user = action.payload

      state.currentUser = user
    })
    .addCase(loginWithQRAPI.fulfilled, (state, action) => {
      state.user = action.payload;
    })
    .addCase(loginWithQRAPI.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(logoutUserAPI.fulfilled, (state) =>
    {
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) =>
    {
      const user = action.payload

      state.currentUser = user
    })
  }
})

// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch()
// tới nó để cập nhật lại dữ liệu thông qua reducer ( chạy đồng bộ)
// export const {} = userSlice.actions

// Selectors là nơi dành cho các components bên dưới gọi bằng useSelector()
// để lấy dữ liệu từ store về
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}
export const { setCurrentUser } = userSlice.actions
// cái file này tên là activeBoardSlice nhưng chúng ta sẽ export 1 thứ tên là Reducer
// export default activeBoardSlice.reducer
export const userReducer = userSlice.reducer