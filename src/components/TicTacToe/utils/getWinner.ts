export function getWinner(
    winner: string | null,
    player: Player,
    opponent: Player
) {
    let winnerObj;
    if (winner === 'X') {
        player.playsX ? (winnerObj = player) : (winnerObj = opponent);
    } else {
        !player.playsX ? (winnerObj = player) : (winnerObj = opponent);
    }
    return winnerObj;
}
