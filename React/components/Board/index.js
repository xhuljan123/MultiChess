import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import BoardContext from './context';
import {
  PlayerTimes,
  Ranks,
  Letters,
  Squares,
  Promote,
  PlayerBanks,
  Actions,
  BoardEditor,
  BoardEditorActions,
  GameEndedMessage
} from './components';
import { BOARD_ACTIONS, GAME_ACTIONS } from './components/Actions';
import styles from './style.module.scss';

function Board(props) {
  const {
    chess,
    width = 500,
    useTime = true,
    useBank = true,
    usePromote = true,
    useBoardActions = true,
    useGameActions = true,
    hideBoardActions = [],
    hideGameActions = [],
    flipped = false,
    coordinates = false,
    lettersPosition: lettersPositionDef = 'bottom',
    ranksPosition: ranksPositionDef = 'left',
    center = true,
    disabled = false,
    editMode = false,
    useGameEndedMessage = true
  } = props;

  const [isFlipped, setIsFlipped] = useState(flipped);
  const [showCoordinates, setShowCoordinates] = useState(coordinates);
  const [lettersPosition, setLettersPosition] = useState(lettersPositionDef);
  const [ranksPosition, setRanksPosition] = useState(ranksPositionDef);
  const [validMoves, setValidMoves] = useState([]);
  const [editorMode, setEditorMode] = useState(editMode);

  if (!chess) {
    return null;
  }

  const context = {
    chess,
    useTime: useTime && !editorMode,
    useBank: useBank && !editorMode,
    useGameEndedMessage: useGameEndedMessage && !editorMode,
    usePromote,
    useBoardActions,
    useGameActions: editorMode ? false : useGameActions,
    hideBoardActions,
    hideGameActions,
    disabled: disabled && !editorMode,
    // extra state
    isFlipped,
    setIsFlipped,
    showCoordinates,
    setShowCoordinates,
    lettersPosition,
    setLettersPosition,
    ranksPosition,
    setRanksPosition,
    validMoves: editorMode ? [] : validMoves,
    setValidMoves,
    editorMode,
    setEditorMode
  };

  const useActions = useBoardActions || useGameActions;

  return (
    <BoardContext.Provider value={context}>
      <div className={cn(styles.Board, { [styles.BoardCenter]: center, [styles.BoardWithActions]: useActions })} style={{ width: width }}>
        <PlayerTimes />
        <GameEndedMessage />
        <BoardEditor />
        <div className={cn(styles.BoardContainer, { [styles.BoardFlipped]: isFlipped })}>
          <Squares />
          <Ranks />
          <Letters />
          <Actions/>
          <Promote />
        </div>
        <BoardEditorActions />
        <PlayerBanks />
      </div>
    </BoardContext.Provider>
  );
}

Board.propTypes = {
  chess: PropTypes.object.isRequired,
  width: PropTypes.number,
  useTime: PropTypes.bool,
  useBank: PropTypes.bool,
  usePromote: PropTypes.bool,
  useGameEndedMessage: PropTypes.bool,
  useBoardActions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOf(BOARD_ACTIONS)),
    PropTypes.bool
  ]),
  useGameActions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOf(GAME_ACTIONS)),
    PropTypes.bool
  ]),
  hideBoardActions: PropTypes.arrayOf(PropTypes.oneOf(BOARD_ACTIONS)),
  hideGameActions: PropTypes.arrayOf(PropTypes.oneOf(GAME_ACTIONS)),
  flipped: PropTypes.bool,
  coordinates: PropTypes.bool,
  lettersPosition: PropTypes.oneOf(['top', 'bottom']),
  ranksPosition: PropTypes.oneOf(['left', 'right']),
  center: PropTypes.bool,
  disabled: PropTypes.bool,
  editMode: PropTypes.bool
};

export default Board;
