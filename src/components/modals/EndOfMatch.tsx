import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface Props {
    modalOpen: boolean;
    condition: string | null;
    socket: Socket;
    setIsPlaying: React.Dispatch<React.SetStateAction<string | null>>;
    isPlaying: string | null;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EndOfMatch = ({
    modalOpen,
    condition,
    socket,
    setIsPlaying,
    isPlaying,
    setModalOpen,
}: Props) => {
    const [text, setText] = useState<string | null>(null);
    const [disabled, setDisabled] = useState(false);
    const [asked, setAsked] = useState(false);
    const [suggested, setSuggested] = useState(false);
    const [opponentLeft, setOpponentLeft] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        switch (condition) {
            case 'win':
                setText('You won!');
                setDisabled(false);
                setOpponentLeft(false);
                setAsked(false);
                break;
            case 'lose':
                setText('You lost :(');
                setDisabled(false);
                setOpponentLeft(false);
                setAsked(false);
                break;
            case 'draw':
                setText("It's a draw!");
                setDisabled(false);
                setOpponentLeft(false);
                setAsked(false);
                break;
            case 'opponent_disconnected':
                setText('Opponent left the game...');
                setOpponentLeft(true);
                setDisabled(true);
                setAsked(false);
                break;
            default:
                setText(null);
                setOpponentLeft(false);
                setDisabled(true);
        }
    }, [condition, modalOpen]);

    const playAgain = () => {
        if (suggested) {
            socket.emit('confirm_again', isPlaying);
            setSuggested(false);
            return;
        }
        setAsked(true);
        setDisabled(true);
        socket.emit('request_again');
    };

    const leave = () => {
        if (!opponentLeft) {
            socket.emit('leave');
        }
        setAsked(false);
        setSuggested(false);
        setIsPlaying(null);
        setModalOpen(false);
        navigate('home');
    };

    socket.on('suggest_again', () => {
        setSuggested(true);
        setDisabled(false);
    });

    return (
        <Modal open={modalOpen}>
            <Box sx={style} className='flex-vertical'>
                <div className='close'>
                    <CloseIcon
                        onClick={() => setModalOpen(false)}
                        sx={{ cursor: 'pointer' }}
                    />
                </div>
                <Typography id='modal-modal-title' variant='h5' component='h2'>
                    {text}
                </Typography>
                <Typography variant='body2'>
                    {condition === 'opponent_disconnected'
                        ? ''
                        : suggested
                        ? 'Opponent asked for rematch'
                        : asked
                        ? 'Waiting for opponent'
                        : 'Ask for rematch?'}
                </Typography>
                <div className='flex gap'>
                    <Button
                        onClick={playAgain}
                        disabled={disabled}
                        variant='contained'
                    >
                        Rematch
                    </Button>

                    <Button onClick={leave} variant='contained'>
                        Home
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default EndOfMatch;
