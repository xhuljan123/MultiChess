import React, { useContext, useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import DragAndDropPolyfill from '../../utils/DragAndDropPolyfill';
import BoardContext from '../../context';
import { squares, flippedSquares, squareColors } from '../../constants';
import Piece from '../Piece';
import styles from './style.module.scss';

DragAndDropPolyfill();

function BoardSquares() {
  const {
    chess,
    isFlipped,
    disabled,
    validMoves,
    setValidMoves,
    editorMode
  } = useContext(BoardContext);
  const [board, setBoard] = useState({});
  const [canMove, setCanMove] = useState(true);
  const [isCheck, setIsCheck] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dragOverSquare, setDragOverSquare] = useState(null);
  const [chessState, setChessState] = useState({
    fen: null,
    variant: null,
  });
  const lastBoardEditor = useRef(null);

  function onRightClick(e, square) {
    e.preventDefault();

    if (editorMode) {
      chess.put({
        ...chessState,
        empty: square,
      });

      return;
    }

    if (canMove && !disabled) {
      const from = selected?.square;
      const to = square;

      if (from && to && from !== to) {
        chess.move(from, to);
      }
    }
  }

  function updateValidMoves(square) {
    if (!editorMode) {
      chess.getValidMoves(square).then(({ moves }) => setValidMoves(moves));
    }
  }

  function updateSelectedSquare(square, piece) {
    if (!editorMode) {
      setSelected({ square, piece });
    }
  }

  function updateCheckSquare() {
    chess.isCheck().then((isCheck) => {
      if (isCheck) {
        chess.getKingPosition().then(setIsCheck);
      }
      else {
        setIsCheck(false);
      }
    });
  }

  function onPieceClick(square, pieceName) {
    if (canMove && !disabled) {
      if (selected?.square === square) {
        setSelected(null);
        setValidMoves([]);
      }
      else {
        updateSelectedSquare(square, pieceName);
        updateValidMoves(square);
      }
    }
  }

  function onDragOver(e, square) {
    e.preventDefault();
    setDragOverSquare(square);
  }

  function onDragStart(e, square, pieceName, color) {
    e.dataTransfer.clearData();

    e.dataTransfer.setData('text', JSON.stringify({
      type: 'move',
      from: square,
      id: chess.id,
      piece: pieceName,
      color
    }));

    updateSelectedSquare(square, pieceName);
    updateValidMoves(square);
  }

  function onDragEnd() {
    setDragOverSquare(null);
  }

  function onDrop(e, to) {
    if (to) {
      try {
        const { type, piece, from, id, color } = JSON.parse(e.dataTransfer.getData('text'));

        if (chess.id !== id) {
          throw new Error('Can not drop on this board');
        }

        if (editorMode) {
          if (!(from && from === to)) {
            chess.put({
              ...chessState,
              empty: from,
              square: to,
              piece,
              color
            });
          }
        }
        else {
          if (type === 'bank') {
            chess.moveBank(piece, to);
          }
          else if (from && from !== to) {
            chess.move(from, to);
          }
        }
      }
      catch (error) {}
    }

    onDragEnd();
  }

  const htmlBoard = () => {
    const getSquares = isFlipped ? flippedSquares : squares;

    return getSquares.map(square => {
      const { name, color } = chess?.getPiecesSymbol().pieces[board?.[square]] || {};

      return (
        <div
          key={square}
          className={cn(
            styles.BoardSquare,
            styles[`Square-${squareColors[square]}`],
            {
              [styles.SquareSelected]: selected?.square === square,
              [styles.SquareValid]: (validMoves || [])?.includes(square),
              [styles.SquareCheck]: isCheck === square,
              [styles.SquareOver]: dragOverSquare === square
            }
          )}
          data-square={square}
          onContextMenu={(e) => onRightClick(e, square)}
          onDragOver={(e) => onDragOver(e, square)}
          onDrop={(e) => onDrop(e, square)}
        >
          {name && (
            <Piece
              name={name}
              color={color}
              draggable={Boolean(canMove && !disabled)}
              onClick={() => onPieceClick(square, name)}
              onDragStart={(e) => onDragStart(e, square, name, color)}
              onDragEnd={onDragEnd}
            />
          )}
        </div>
      );
    });
  };

  useEffect(() => {
    if (lastBoardEditor.current === true && !editorMode) {
      // start from current position
      chess.start(chessState);
    }

    lastBoardEditor.current = editorMode;

    if (editorMode) {
      setValidMoves([]);
      setCanMove(true);
      setSelected(null);
      setIsCheck(false);

      const startEventId = chess.on('start', async () => {
        const { key: variant } = await chess.getCurrentVariant();
        const fen = await chess.getFen();

        setChessState({ variant, fen });
        chess.getBoard().then(setBoard);
      });

      const putEventId = chess.on('put', (data) => {
        const { variant, fen, board } = data;

        setChessState({ variant, fen });
        setBoard(board);
      });

      return () => {
        chess.clearEvent('start', startEventId);
        chess.clearEvent('put', putEventId);
      };
    }
    else {
      const startEventId = chess.on('start', () => {
        chess.getBoard().then(setBoard);
        chess.isGameFinished().then((finished) => setCanMove(!finished));
        updateCheckSquare();
      });

      const allEvent = chess.on('all', (event, data) => {
        /*
          all, start, restart, boardUpdate, move, back, check, capture
          bankUpdate, promote, timeUpdate, aiThinking, aiMove, finish
          error
        */

        switch (event) {
          case 'boardUpdate':

            setSelected(null);
            setValidMoves([]);
            setBoard(data);
            updateCheckSquare();

            break;
          case 'check':

            updateCheckSquare();

            break;
          case 'finish':

            setCanMove(false);

            break;

          default:
            break;
        }
      });

      return () => {
        chess.clearEvent('start', startEventId);
        chess.clearEvent('all', allEvent);
      };
    }

  }, [editorMode]);

  return (
    <div className={styles.Squares}>
      <div className={styles.SquaresContainer}>
        {htmlBoard()}
      </div>
    </div>
  );
}

export default BoardSquares;
