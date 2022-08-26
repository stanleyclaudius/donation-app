import ReduxProvider from './redux/store'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <ReduxProvider>
    <App />
  </ReduxProvider>
)