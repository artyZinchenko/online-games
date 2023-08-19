import { useState } from 'react';
import Board from './Board';
import { Socket } from 'socket.io-client';

interface Props {
    player: Player | null;
    opponent: Player | null;
    socket: Socket;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}

const Game = ({
    player,
    opponent,
    socket,
    setModalOpen,
    gameOver,
    setGameOver,
}: Props) => {
    const [history, setHistory] = useState<Array<Array<null | string>>>([
        Array(9).fill(null),
    ]);
    const [currentMove, setCurrentMove] = useState<number>(0);
    const xIsNext: boolean = currentMove % 2 === 0;
    const currentSquares: Array<null | string> = history[currentMove];

    function handlePlay(nextSquares: Array<null | string>) {
        if (gameOver) return;
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    if (player === null || opponent === null) {
        return null;
    }

    return (
        <div className='game'>
            <div className='game-board'>
                <Board
                    player={player}
                    opponent={opponent}
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                    socket={socket}
                    setModalOpen={setModalOpen}
                    history={history}
                    gameOver={gameOver}
                    setGameOver={setGameOver}
                />
            </div>
        </div>
    );
};

export default Game;
