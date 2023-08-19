interface Props {
    key: number;
    value: number | null;
    columnIndex: number;
    play: (c: number) => void;
}

const Cell = ({ value, columnIndex, play }: Props) => {
    let color = 'white';
    if (value === 1) {
        color = 'red';
    } else if (value === 2) {
        color = 'yellow';
    }

    return (
        <td>
            <div className='cell' onClick={() => play(columnIndex)}>
                <div className={color}></div>
            </div>
        </td>
    );
};

export default Cell;
