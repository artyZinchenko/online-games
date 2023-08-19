import React, { useState, useEffect } from 'react';
import { checkAll } from './utils/checkBoard';
import Row from './Row';
import './ConnectFour.css';
import { Socket } from 'socket.io-client';
import { Typography } from '@mui/material';

interface Props {
    player: Player | null;
    opponent: Player | null;
    socket: Socket;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}

const Game = ({ player, opponent, socket, gameOver, setGameOver }: Props) => {
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [board, setBoard] = useState<Board>([]);

    const togglePlayer = () => (currentPlayer === 1 ? 2 : 1);

    const initBoard = () => {
        let newBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
        setBoard(newBoard);
    };

    useEffect(() => {
        initBoard();
    }, []);

    if (player === null || opponent === null) {
        return null;
    }

    socket.on('register_move', (data) => {
        setBoard(data.move);
        setCurrentPlayer(togglePlayer());
    });

    const play = (c: number) => {
        if (gameOver) return;
        if (player.playsX && currentPlayer !== 1) return;
        if (!player.playsX && currentPlayer !== 2) return;

        let newBoard = [...board];
        for (let r = 5; r >= 0; r--) {
            if (!newBoard[r][c]) {
                newBoard[r][c] = currentPlayer;
                break;
            }
        }

        let result = checkAll(newBoard);
        if (result === 1) {
            setBoard(newBoard);
            if (player.playsX) {
                socket.emit('move', { player, move: newBoard });
                if (!gameOver) socket.emit('win');
            }
        } else if (result === 2) {
            setBoard(newBoard);
            if (!player.playsX) {
                socket.emit('move', { player, move: newBoard });
                if (!gameOver) socket.emit('win');
            }
        } else if (result === 'draw') {
            if (!gameOver) {
                socket.emit('draw');
                setGameOver(true);
            }
            setBoard(newBoard);
        } else {
            setBoard(newBoard);
            socket.emit('move', { player, move: newBoard });
            setCurrentPlayer(togglePlayer());
        }
    };

    let message;
    if (
        (player.playsX && currentPlayer === 1) ||
        (!player.playsX && currentPlayer === 2)
    ) {
        message = 'Your move';
    } else if (
        (player.playsX && currentPlayer === 2) ||
        (!player.playsX && currentPlayer === 1)
    ) {
        message = opponent.username + "'s move";
    }

    return (
        <div className='connect-four flex-vertical'>
            <Typography variant='h6'>{message}</Typography>
            <table>
                <thead></thead>
                <tbody>
                    {board.map((row, i) => (
                        <Row key={i} row={row} play={play} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Game;
