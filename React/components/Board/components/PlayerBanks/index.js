import React, { useContext, useState, useEffect } from 'react';
import cn from 'classnames';
import BoardContext from '../../context';
import Piece from '../Piece';
import styles from './style.module.scss';

function PlayerBanks() {
  const { chess, isFlipped, useBank, disabled, setValidMoves } = useContext(BoardContext);
  const [hasBank, setHasBank] = useState(false);
  const [bank, setBank] = useState({});
  const [availablePieces, setAvailablePieces] = useState([]);

  function dragAndDropData(e, piece) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData('text', JSON.stringify({
      type: 'bank',
      piece,
      id: chess.id
    }));

    chess.getBankMoves(piece).then(moves => {
      setValidMoves(moves);
    });
  }

  const generateBank = (color) => {
    return (
      <div className={styles.Bank}>
        {availablePieces.map(piece => {
          const pieceInBank = bank[color]?.[piece] || 0;

          return (
            <div className={cn(styles.BankPiece, { [styles.PieceDisabled]: pieceInBank === 0 })} key={`${piece}-${color}`}>
              <Piece
                className={styles.Piece}
                name={piece}
                color={color}
                draggable={Boolean(pieceInBank && !disabled)}
                onDragStart={(e) => dragAndDropData(e, piece)}
              />
              {pieceInBank > 0 && (
                <div className={styles.Counter}>{pieceInBank}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (useBank) {
      const starEventId = chess.on('start', async () => {
        // check if bank available
        const { white, black } = await chess.hasBank() || {};
        const bankAvailable = Boolean(white || black);
        setHasBank(bankAvailable);

        if (bankAvailable) {
          chess.getAvailablePieces()
            .then((pieces) => {
              setAvailablePieces(pieces.filter(piece => piece !== 'king'));
            });

          chess.getAvailableBank().then(setBank);
        }
      });

      const bankUpdateEventId = chess.on('bankUpdate', setBank);

      return () => {
        chess.clearEvent('start', starEventId);
        chess.clearEvent('bankUpdate', bankUpdateEventId);
      };
    }
  }, [useBank]);

  if (!useBank || !hasBank) {
    return null;
  }

  return (
    <div className={cn(styles.Banks, { [styles.BanksFlipped]: isFlipped })}>
      {generateBank('white')}
      {generateBank('black')}
    </div>
  );
}

export default PlayerBanks;
