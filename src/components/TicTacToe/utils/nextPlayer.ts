export function nextPlayer(xIsNext: boolean, player: Player, opponent: Player) {
    let nextPlayer;
    if (xIsNext) {
        player.playsX ? (nextPlayer = 'You') : (nextPlayer = opponent.username);
    } else {
        !player.playsX
            ? (nextPlayer = 'You')
            : (nextPlayer = opponent.username);
    }
    return nextPlayer;
}
