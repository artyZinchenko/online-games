import {
    Modal,
    Box,
    CircularProgress,
    Typography,
    Button,
} from '@mui/material';
import { Socket } from 'socket.io-client';

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
    socket: Socket;
    setIsWaiting: React.Dispatch<React.SetStateAction<boolean>>;
    isWaiting: boolean;
}

const Waiting = ({ socket, setIsWaiting, isWaiting }: Props) => {
    const stopWait = () => {
        socket.emit('cancel_waiting');
        setIsWaiting(false);
    };

    return (
        <Modal open={isWaiting}>
            <Box sx={style} className='flex-vertical'>
                <CircularProgress size={100} />
                <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Waiting for opponent...
                </Typography>
                <Button onClick={stopWait} variant='contained'>
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
};
export default Waiting;

//  const leave = () => {
//      if (!opponentLeft) {
//          socket.emit('leave');
//      }
//      setAsked(false);
//      setSuggested(false);
//      setIsPlaying(null);
//      setModalOpen(false);
//      navigate('home');
//  };

//  const playAgain = () => {
//      if (suggested) {
//          socket.emit('confirm_again', isPlaying);
//          setSuggested(false);
//          return;
//      }
//      setAsked(true);
//      setDisabled(true);
//      socket.emit('request_again');
//  };
