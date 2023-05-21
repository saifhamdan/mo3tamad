import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import store from 'store';
import Index from 'pages';
import AuthContextProvider from 'store/auth-context';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e77917',
      light: '#f3bc8b',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <title>{`Mo3tamad`}</title>
      <meta name='description' />
      <link rel='icon' href='/favicon.ico' />
      <Provider store={store}>
        <BrowserRouter>
          <AuthContextProvider>
            <Index />
          </AuthContextProvider>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
