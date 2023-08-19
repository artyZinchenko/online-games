import { Socket } from 'socket.io-client';
import Square from './Square';
import { calculateWinner } from './utils/calculateWinner';
import { getWinner } from './utils/getWinner';
import { nextPlayer } from './utils/nextPlayer';
import { Typography } from '@mui/material';

interface Props {
    onPlay: (arg0: Array<null | string>) => void;
    squares: Array<null | string>;
    xIsNext: boolean;
    player: Player;
    opponent: Player;
    socket: Socket;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    history: (string | null)[][];
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}

const Board = ({
    xIsNext,
    squares,
    onPlay,
    player,
    socket,
    opponent,
    history,
    setGameOver,
    gameOver,
}: Props) => {
    socket.on('register_move', (data) => {
        const i = data.move;

        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
            onPlay(nextSquares);
        } else {
            nextSquares[i] = 'O';
            onPlay(nextSquares);
        }
    });

    const handleClick = (i: number) => {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();

        if (xIsNext && player.playsX) {
            nextSquares[i] = 'X';
            onPlay(nextSquares);
            socket.emit('move', { player: player, move: i });
        }

        if (!xIsNext && !player.playsX) {
            nextSquares[i] = 'O';
            onPlay(nextSquares);
            socket.emit('move', { player: player, move: i });
        }
    };

    const winner = calculateWinner(squares);

    let status;
    const nextName = nextPlayer(xIsNext, player, opponent);

    if (winner) {
        const winnerObj = getWinner(winner, player, opponent);
        if (winnerObj.id === player.id && !gameOver) socket.emit('win');

        status = 'Winner: ' + winnerObj.username;
    } else {
        status = 'Waiting for player: ' + nextName;
    }

    if (history.length === 10 && !winner) {
        if (!gameOver) {
            socket.emit('draw');
            setGameOver(true);
        }
    }

    return (
        <>
            <Typography variant='h6' className='status'>
                {status}
            </Typography>
            <div className='board-row'>
                <Square
                    value={squares[0]}
                    onSquareClick={() => handleClick(0)}
                />
                <Square
                    value={squares[1]}
                    onSquareClick={() => handleClick(1)}
                />
                <Square
                    value={squares[2]}
                    onSquareClick={() => handleClick(2)}
                />
            </div>
            <div className='board-row'>
                <Square
                    value={squares[3]}
                    onSquareClick={() => handleClick(3)}
                />
                <Square
                    value={squares[4]}
                    onSquareClick={() => handleClick(4)}
                />
                <Square
                    value={squares[5]}
                    onSquareClick={() => handleClick(5)}
                />
            </div>
            <div className='board-row'>
                <Square
                    value={squares[6]}
                    onSquareClick={() => handleClick(6)}
                />
                <Square
                    value={squares[7]}
                    onSquareClick={() => handleClick(7)}
                />
                <Square
                    value={squares[8]}
                    onSquareClick={() => handleClick(8)}
                />
            </div>
        </>
    );
};

export default Board;
