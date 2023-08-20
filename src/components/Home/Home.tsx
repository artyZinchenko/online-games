import {
    Box,
    Button,
    Input,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import './Home.css';

interface Props {
    socket: Socket;
    setIsWaiting: React.Dispatch<React.SetStateAction<boolean>>;
    player: Player | null;
    setList: React.Dispatch<React.SetStateAction<Game[]>>;
    list: Game[];
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const Home = ({
    socket,
    setIsWaiting,
    player,
    list,
    setList,
    setPlayer,
}: Props) => {
    const [text, setText] = useState('');
    const [username, setUsername] = useState<string | null>(() => {
        if (player?.username) return player.username;
        return null;
    });

    useEffect(() => {
        const inputElement = document.getElementById('myInput');

        function saveUsername(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                setUsername(text);
                setPlayer({ id: socket.id, username: text });
            }
        }

        inputElement?.addEventListener('keydown', saveUsername);
        return () => inputElement?.removeEventListener('keydown', saveUsername);
    }, [text]);

    useEffect(() => {
        socket.emit('get_games');
    }, [socket]);

    const handleJoinById = (game: Game) => {
        socket.emit('join_game_byId', {
            id: game.id,
            username: game.username,
            gameName: game.gameName,
            socketUsername: username,
        });
        const newList = list.filter((g) => g.id !== game.id);
        setList(newList);
    };

    const playTicTacToe = () => {
        setIsWaiting(true);
        socket.emit('create_game', { username, gameName: 'tictactoe' });
    };

    const playConnectFour = () => {
        setIsWaiting(true);
        socket.emit('create_game', { username, gameName: 'connect-four' });
    };

    return (
        <div>
            {username ? (
                <div className='flex-vertical py'>
                    <Box className='flex-vertical'>
                        <Typography variant='h6' sx={{ paddingBlock: '1em' }}>
                            Player: {username}
                        </Typography>
                        <Button
                            disabled={!username}
                            onClick={playTicTacToe}
                            variant='contained'
                        >
                            New Tic-Tac-Toe Game
                        </Button>
                        <Button
                            disabled={!username}
                            onClick={playConnectFour}
                            variant='contained'
                        >
                            New Connect Four Game
                        </Button>
                    </Box>
                    {list.length > 0 && (
                        <Paper
                            sx={{
                                padding: '2em',
                                backgroundColor: 'rgba(0,0,0,.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                            variant='outlined'
                        >
                            <Typography variant='h6'>Current games</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Game</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {list.map((game: Game) => {
                                        return (
                                            <TableRow
                                                className='clickable-row'
                                                onClick={() =>
                                                    handleJoinById(game)
                                                }
                                                key={game.id}
                                            >
                                                <TableCell>
                                                    <Typography>
                                                        {game.username}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {game.gameName ===
                                                        'tictactoe'
                                                            ? 'Tic-Tac-Toe'
                                                            : 'Connect Four'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    )}
                </div>
            ) : (
                <Box className='flex-vertical gap py'>
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Enter username'
                        type='text'
                        id='myInput'
                    />
                    <Button
                        onClick={() => {
                            setPlayer({ id: socket.id, username: text });
                            setUsername(text);
                        }}
                        variant='contained'
                    >
                        Save username
                    </Button>
                </Box>
            )}
        </div>
    );
};

export default Home;
