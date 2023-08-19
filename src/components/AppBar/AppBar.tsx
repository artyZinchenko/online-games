import {
    Box,
    Toolbar,
    Typography,
    Button,
    AppBar as MuiAppBar,
    useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface Props {
    player: Player | null;
    socket: Socket;
    isPlaying: string | null;
    setIsPlaying: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppBar = ({ socket, player, isPlaying, setIsPlaying }: Props) => {
    const navigate = useNavigate();
    const matches = useMediaQuery('(min-width:40em)');

    const handleHome = () => {
        socket.emit('leave');
        setIsPlaying(null);
        navigate('home');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <MuiAppBar
                position='static'
                sx={{ backgroundColor: 'rgba(0,0,0,.2)' }}
            >
                <Toolbar>
                    <Typography
                        variant='h6'
                        component='div'
                        sx={{ flexGrow: 1 }}
                    >
                        {matches
                            ? 'Play Tic-Tac-Toe or Connect Four'
                            : 'Play Online'}
                    </Typography>
                    {isPlaying && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1em',
                            }}
                        >
                            <Typography variant='h6'>
                                {matches
                                    ? `Player: ${player?.username}`
                                    : player?.username}
                            </Typography>
                            <Button
                                variant='contained'
                                sx={{ color: 'white' }}
                                onClick={handleHome}
                            >
                                Home
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </MuiAppBar>
        </Box>
    );
};
export default AppBar;
