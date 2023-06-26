import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Board from '../Board';

function Game(props) {
  const {
    chess = null,
    start = null, // game configuration
    board = {}, // board props
    onReady = null,
  } = props;

  useEffect(() => {
    if (chess) {
      chess.listen('error', (err) => {
        console.error(err);
      });

      if (start) {
        chess.start(start);
      }

      if (start) {
        chess.start(start);
      }

      if (typeof onReady === 'function') {
        onReady(chess);
      }
    }
  }, []);

  if (!chess) {
    return null;
  }

  return (
    <Board
      {...board}
      chess={chess}
    />
  );
}

Game.propTypes = {
  chess: PropTypes.object.isRequired,
  start: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  board: PropTypes.object,
  onReady: PropTypes.func
};

export default Game;
