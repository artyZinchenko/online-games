import { useEffect, useState } from 'react';
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import Home from './Home/Home';
import TicTacToe from './TicTacToe/TicTacToe';
import { Socket } from 'socket.io-client';
import AppBar from './AppBar/AppBar';
import Waiting from './modals/Waiting';
import EndOfMatch from './modals/EndOfMatch';
import ConnectFour from './ConnectFour/ConnectFour';

interface Props {
    socket: Socket;
}

const Main = ({ socket }: Props) => {
    const [isPlaying, setIsPlaying] = useState<string | null>(null);
    const [isWaiting, setIsWaiting] = useState(false);
    const [gameNumber, setGameNumber] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [player, setPlayer] = useState<Player | null>(null);
    const [opponent, setOpponent] = useState<Player | null>(null);
    const [condition, setCondition] = useState<string | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [list, setList] = useState<Game[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    socket.removeAllListeners();

    useEffect(() => {
        if (location.pathname === '/home') {
            setOpponent(null);
            if (!gameOver) {
                setIsPlaying(null);
                setGameOver(true);
                socket.emit('leave');
            }
        }
    }, [location]);

    useEffect(() => {
        if (!opponent) {
            navigate('home');
        }
    }, [opponent]);

    useEffect(() => {
        window.addEventListener('unload', function () {
            if (!gameOver) {
                socket.emit('leave');
            }
        });
    }, []);

    socket.on('you_lose', () => {
        setCondition('lose');
        setModalOpen(true);
        setGameOver(true);
    });

    socket.on('you_win', () => {
        setCondition('win');
        setModalOpen(true);
        setGameOver(true);
    });

    socket.on('you_draw', () => {
        setCondition('draw');
        setModalOpen(true);
        setGameOver(true);
    });

    socket.on('recieve_games', (data: Game[]) => {
        const newList = data.filter((g) => g.id !== socket.id);
        setList(newList);
    });

    socket.on('game_created', (game: Game) => {
        setList([...list, game]);
    });

    socket.on('game_cancelled', (id: string) => {
        const newList = list.filter((g) => g.id !== id);
        setList(newList);
    });

    socket.on('opponent_disconnected', () => {
        setCondition('opponent_disconnected');
        setGameOver(true);
        setModalOpen(true);
    });

    socket.on('opponent_joined', (data) => {
        socket.emit('start_game', data);
    });

    socket.on('started_game', (data) => {
        const [players, gameName]: [players: Player[], gameName: string] = data;
        for (const p of players) {
            p.id === socket.id ? setPlayer(p) : setOpponent(p);
        }

        setGameOver(false);
        setModalOpen(false);
        setIsPlaying(gameName);
        setIsWaiting(false);
        setGameNumber(gameNumber + 1);
        if (gameName === 'tictactoe') {
            navigate('tictactoe');
        } else {
            navigate('connectfour');
        }
    });

    return (
        <div style={{ height: '100%', backgroundColor: '#312e2b' }}>
            <AppBar
                player={player}
                socket={socket}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
            />

            <Routes>
                <Route path='*' element={<Navigate to='home' replace />} />
                <Route
                    path='/tictactoe'
                    element={
                        <TicTacToe
                            gameNumber={gameNumber}
                            socket={socket}
                            player={player}
                            opponent={opponent}
                            setModalOpen={setModalOpen}
                            gameOver={gameOver}
                            setGameOver={setGameOver}
                        />
                    }
                />
                <Route
                    path='/connectfour'
                    element={
                        <ConnectFour
                            gameNumber={gameNumber}
                            socket={socket}
                            player={player}
                            opponent={opponent}
                            setModalOpen={setModalOpen}
                            gameOver={gameOver}
                            setGameOver={setGameOver}
                        />
                    }
                />
                <Route
                    path='/home'
                    element={
                        <Home
                            socket={socket}
                            setIsWaiting={setIsWaiting}
                            player={player}
                            list={list}
                            setList={setList}
                        />
                    }
                />
            </Routes>
            <Waiting
                socket={socket}
                isWaiting={isWaiting}
                setIsWaiting={setIsWaiting}
            />
            <EndOfMatch
                modalOpen={modalOpen}
                condition={condition}
                socket={socket}
                setIsPlaying={setIsPlaying}
                isPlaying={isPlaying}
                setModalOpen={setModalOpen}
            />
        </div>
    );
};

export default Main;
