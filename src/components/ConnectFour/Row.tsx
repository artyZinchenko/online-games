import Cell from './Cell';

interface Props {
    row: (number | null)[];
    play: (c: number) => void;
}

const Row = ({ row, play }: Props) => {
    return (
        <tr>
            {row.map((cell, i) => (
                <Cell key={i} value={cell} columnIndex={i} play={play} />
            ))}
        </tr>
    );
};

export default Row;
