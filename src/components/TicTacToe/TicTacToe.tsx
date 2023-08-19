import { Socket } from 'socket.io-client';
import Game from './Game';
import './TicTacToe.css';
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

const TicTacToe = ({
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
        <div className={`${matches ? 'flex' : 'flex-vertical'}`}>
            {matches && (
                <Paper
                    className='flex-vertical'
                    sx={{ backgroundColor: 'rgba(0,0,0,.2)', padding: '1em' }}
                >
                    <Typography variant='h6'>
                        {player?.playsX ? 'Plays with X' : 'Plays with O'}
                    </Typography>
                    <Typography variant='h6'>{player?.username}</Typography>
                </Paper>
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
            {!matches && (
                <Typography>Opponent: {opponent?.username}</Typography>
            )}
            {matches && (
                <Paper
                    className='flex-vertical'
                    sx={{ backgroundColor: 'rgba(0,0,0,.2)', padding: '1em' }}
                >
                    <Typography variant='h6'>
                        {opponent?.playsX ? 'Plays with X' : 'Plays with O'}
                    </Typography>
                    <Typography variant='h6'>{opponent?.username}</Typography>
                </Paper>
            )}
        </div>
    );
};

export default TicTacToe;
