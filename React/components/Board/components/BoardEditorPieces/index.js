import React, { useContext, useState, useEffect } from 'react';
import cn from 'classnames';
import BoardContext from '../../context';
import Button from '../../../Button';
import Piece from '../Piece';
import { ReactComponent as CloseSvg } from '../../assets/icons/close.svg';
import { ReactComponent as RestartSvg } from '../../assets/icons/restart.svg';
import styles from './style.module.scss';

function BoardEditorPieces() {
  const { chess, editorMode, setEditorMode } = useContext(BoardContext);
  const [pieces, setPieces] = useState([]);
  const [chessState, setChessState] = useState({
    fen: null,
    variant: null,
  });

  function dragAndDropData(e, piece, color) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData('text', JSON.stringify({
      id: chess.id,
      type: 'put',
      piece,
      color
    }));
  }

  const renderPieces = (color) => {
    return (
      <>
        {pieces.map((piece) => {
          return (
            <div key={`${piece}-${color}`}>
              <Piece
                className={styles.Piece}
                name={piece}
                color={color}
                draggable
                onDragStart={(e) => dragAndDropData(e, piece, color)}
              />
            </div>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    // get all pieces in case game is not started
    setPieces(Object.keys(chess.getPiecesSymbol().white));
  }, []);

  useEffect(() => {
    if (editorMode) {
      const startEventId = chess.on('start', async () => {
        const availablePieces = await chess.getAvailablePieces();
        const { key: variant } = await chess.getCurrentVariant();
        const fen = await chess.getFen();

        setPieces(availablePieces);
        setChessState({ variant, fen });
      });

      const putEventId = chess.on('put', (data) => {
        const { variant, fen } = data;

        setChessState({ variant, fen });
      });

      return () => {
        chess.clearEvent('start', startEventId);
        chess.clearEvent('put', putEventId);
      };
    }
  }, [editorMode]);

  if (!editorMode || !pieces.length) {
    return null;
  }

  return (
    <div className={styles.Root}>
      <div className={cn(styles.Item, styles.Pieces)}>
        <div className={styles.PiecesContainer}>
          {renderPieces('white')}
        </div>
        <div className={styles.PiecesContainer}>
          {renderPieces('black')}
        </div>
      </div>
      <div className={cn(styles.Item, styles.Actions)}>
        <CloseSvg
          onClick={() => chess.put({ variant: chessState.variant })}
          className={styles.ActionsIcons}
        />
        <RestartSvg
          onClick={() => chess.start({ variant: chessState.variant })}
          className={styles.ActionsIcons}
        />
        <Button
          type="info"
          className={styles.Button}
          fullSize
          onClick={() => {
            setEditorMode(false);
            chess.start(chessState);
          }}
        >
          Start from here
        </Button>
      </div>
    </div>
  );
}

export default BoardEditorPieces;
