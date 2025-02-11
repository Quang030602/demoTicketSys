import { blue, lightBlue, grey ,white} from '@mui/material/colors';
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

// Tạo theme tùy chỉnh với tông màu xanh dương sáng
const theme = extendTheme({
  trelloCustom: {
    appBarHeight: '48px',
    boardBarHeight: '58px',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: lightBlue,  // Xanh dương nhạt
        secondary: white,  // Màu xám nhẹ để trung hòa
        background: {
          default: '#f0faff',  // Màu nền xanh rất nhẹ
          paper: '#ffffff',  // Màu nền cho card và bảng
        },
        text: {
          primary: '#003366',  // Xanh đậm để tạo độ tương phản
          secondary: '#005599', // Xanh trung bình cho tiêu đề phụ
        },
      },
    },
    dark: {
      palette: {
        primary: blue,  // Xanh dương đậm hơn cho chế độ tối
        secondary: grey,
        background: {
          default: '#001f3f',
          paper: '#002f5f',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0cfff',
        },
      },
    },
  },
});

export default theme;
