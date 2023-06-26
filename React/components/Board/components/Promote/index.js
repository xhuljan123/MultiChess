import React, { useEffect, useState, useContext } from 'react';
import cn from 'classnames';
import BoardContext from '../../context';
import Piece from '../Piece';
import { ReactComponent as CloseSvg } from '../../assets/icons/close.svg';
import styles from './style.module.scss';

function Promote() {
  const { chess, usePromote } = useContext(BoardContext);
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState('white');
  const [data, setData] = useState({});

  const { from, to, promotionPieces: pieces } = data;

  useEffect(() => {
    const moveEventId = chess.on('move', () => setIsOpen(false));
    let promoteEventId;

    if (usePromote) {
      promoteEventId = chess.on('promote', (data) => {
        chess.getTurn()
          .then(turn => {
            setColor(turn);
            setData(data);
            setIsOpen(true);
          });
      });
    }

    return () => {
      chess.clearEvent('move', moveEventId);
      chess.clearEvent('promote', promoteEventId);
    };
  }, [usePromote]);

  if (!isOpen || !usePromote || !pieces?.length || !from || !to) {
    return null;
  }

  return (
    <div className={cn(styles.Promote)}>
      <div className={cn(styles.Pieces, styles[`Pieces-${color}`])}>
        {pieces.map(name => {
          return (
            <Piece
              key={name}
              name={name}
              color={color}
              size={50}
              onClick={() => chess.move(from, to, name)}
            />
          );
        })}
        <div className={styles.Close} onClick={() => setIsOpen(false)}>
          <CloseSvg width={20} />
        </div>
      </div>
    </div>
  );
}

export default Promote;
