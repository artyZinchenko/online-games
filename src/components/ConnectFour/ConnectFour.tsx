import { Socket } from 'socket.io-client';
import Game from './Game';
import { Paper, Typography, useMediaQuery } from '@mui/material';

interface Props {
    socket: Socket;
    player: Player | null;
    opponent: Player | null;
    gameNumber: number;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConnectFour = ({
    socket,
    player,
    opponent,
    gameNumber,
    setModalOpen,
    gameOver,
    setGameOver,
}: Props) => {
    const matches = useMediaQuery('(min-width:40em)');
    return (
        <div className={`${matches ? 'flex gap' : 'flex-vertical'}`}>
            {matches && (
                <div className='flex-vertical'>
                    <Paper
                        className='flex-vertical'
                        sx={{
                            backgroundColor: 'rgba(0,0,0,.2)',
                            padding: '1em',
                        }}
                    >
                        <Typography variant='h6'>
                            {player?.playsX ? 'Plays Red' : 'Plays Yellow'}
                        </Typography>
                        <Typography variant='h6'>{player?.username}</Typography>
                    </Paper>
                </div>
            )}
            <Game
                player={player}
                opponent={opponent}
                socket={socket}
                setModalOpen={setModalOpen}
                key={gameNumber}
                gameOver={gameOver}
                setGameOver={setGameOver}
            />
            {matches && (
                <div className='flex-vertical'>
                    <Paper
                        className='flex-vertical'
                        sx={{
                            backgroundColor: 'rgba(0,0,0,.2)',
                            padding: '1em',
                        }}
                    >
                        <Typography variant='h6'>
                            {opponent?.playsX ? 'Plays Red' : 'Plays Yellow'}
                        </Typography>
                        <Typography variant='h6'>
                            {opponent?.username}
                        </Typography>
                    </Paper>
                </div>
            )}
            {!matches && (
                <Typography>Opponent: {opponent?.username}</Typography>
            )}
        </div>
    );
};

export default ConnectFour;
