import { BrowserRouter } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import Main from './components/Main';
import './App.css';
import { ThemeProvider } from '@mui/material';
import { customTheme } from './components/theme/customTheme';

interface Props {
    socket: Socket;
}

function App({ socket }: Props) {
    return (
        <div className='App'>
            <BrowserRouter>
                <ThemeProvider theme={customTheme}>
                    <Main socket={socket} />
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
