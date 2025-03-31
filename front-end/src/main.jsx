import CssBaseline from '@mui/material/CssBaseline'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import GlobalStyles from '@mui/material/GlobalStyles'
import theme from './theme'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
// Cấu hình Redux Store
import { store } from '~/redux/store' //Redux store của bạn, nơi lưu trữ toàn bộ trạng thái ứng dụng.
import { Provider } from 'react-redux' //Bao bọc ứng dụng để cho phép truy cập store từ mọi component.

// Cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from 'react-router-dom'

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Câu hình MUI DIALOG
import { ConfirmProvider } from 'material-ui-confirm'

// Cấu hình Redux- Persist
import { PersistGate } from 'redux-persist/integration/react' // Chặn giao diện hiển thị cho đến khi Redux Store được khôi phục từ LocalStorage.
import { persistStore } from 'redux-persist' //Tạo một "persistor" giúp lưu Redux state vào LocalStorage.

// kỹ thuật InjectStore: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from '~/utils/authorizeAxios'
 
injectStore(store)//Kỹ thuật InjectStore giúp truyền store đến các module bên ngoài
injectStore(store)
const persistor = persistStore(store)
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            dialogProps: { maxWidth: 'xs' },
            confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
            cancellationButtonProps: { color: 'inherit' },
            buttonOrder: ['confirm', 'cancel']
          }}>
            <GlobalStyles styles={{ //hiết lập CSS toàn cục, trong trường hợp này là bỏ gạch chân của thẻ a
              a: { textDecoration:'none' }
            }}/>
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-left' autoClose={2000} />
          </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
