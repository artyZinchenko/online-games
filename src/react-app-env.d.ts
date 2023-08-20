/// <reference types="react-scripts" />

interface Player {
    id?: string;
    username: string;
    playsX?: boolean;
}

type Board = Array<Array<number | null>>;

interface Game {
    id: string;
    username: string;
    gameName: string;
}
