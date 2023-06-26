import React, { useContext, useState } from 'react';
import BoardContext from '../../context';
import Collapse from '../../../../components/Collapse';
import Notification from '../../../../components/Notification';
import { copyToClipboard } from '../../../../components/utils';
import { ReactComponent as CogSvg } from '../../assets/icons/cog.svg';
import { ReactComponent as ChessSvg } from '../../assets/icons/chess.svg';
import { ReactComponent as FlipSvg } from '../../assets/icons/flip.svg';
import { ReactComponent as CoordinatesSvg } from '../../assets/icons/coordinates.svg';
import { ReactComponent as EditSvg } from '../../assets/icons/edit.svg';
import styles from './style.module.scss';

export const BOARD_ACTIONS = ['coordinates', 'flip', 'letters', 'ranks', 'edit'];
export const GAME_ACTIONS = ['undo', 'randomMove', 'bestMove', 'restart', 'fen', 'pgn', 'ascii', 'history'];

function Actions() {
  const {
    chess,
    useBoardActions,
    useGameActions,
    hideBoardActions,
    hideGameActions,
    showCoordinates,
    setShowCoordinates,
    setIsFlipped,
    setLettersPosition,
    setRanksPosition,
    editorMode,
    setEditorMode
  } = useContext(BoardContext);

  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState('info');

  if (!useBoardActions && !useGameActions) {
    return null;
  }

  function showNotification(message, type = 'info') {
    setNotificationType(type);
    setNotificationMessage(message);
  }

  function copy(text) {
    copyToClipboard(text, { output: true, onCopy: showNotification('Copied to clipboard') });
  }

  function hasBoardAction(action) {
    if (Array.isArray(hideBoardActions) && hideBoardActions.includes(action)) {
      return false;
    }

    if (useBoardActions === true || (Array.isArray(useBoardActions) && useBoardActions.includes(action))) {
      return true;
    }

    return false;
  }

  function hasGameAction(action) {
    if (Array.isArray(hideGameActions) && hideGameActions.includes(action)) {
      return false;
    }

    if (useGameActions === true || (Array.isArray(useGameActions) && useGameActions.includes(action))) {
      return true;
    }

    return false;
  }

  return (
    <>
      <div className={styles.BoardActions}>
        {Boolean(useBoardActions === true || useBoardActions.length) && (
          <Collapse
            button={<CogSvg width={20} />}
            classNameContainer={styles.Actions}
            toggleOnContainerClick={false}
          >
            {hasBoardAction('coordinates') && (
              <div className={styles.Item} onClick={() => setShowCoordinates(prev => !prev)}>
                <CoordinatesSvg height="16" /> {showCoordinates ? 'Hide' : 'Show'} coordinates
              </div>
            )}
            {hasBoardAction('flip') && (
              <div className={styles.Item} onClick={() => setIsFlipped(prev => !prev)}>
                <FlipSvg height="16" /> Flip board
              </div>
            )}
            {hasBoardAction('letters') && (
              <div className={styles.Item} onClick={() => setLettersPosition(prev => prev === 'bottom' ? 'top' : 'bottom')}>
                <FlipSvg height={16} /> Flip letters
              </div>
            )}
            {hasBoardAction('ranks') && (
              <div className={styles.Item} onClick={() => setRanksPosition(prev => prev === 'left' ? 'right' : 'left')}>
                <FlipSvg height={16} /> Flip ranks
              </div>
            )}
            {hasBoardAction('edit') && !editorMode && (
              <div className={styles.Item} onClick={() => setEditorMode(prev => !prev)}>
                <EditSvg height={16} /> Edit board
              </div>
            )}
          </Collapse>
        )}
        {Boolean(useGameActions === true || useGameActions.length) && (
          <Collapse
            button={<ChessSvg width={20} />}
            classNameContainer={styles.Actions}
            toggleOnContainerClick={false}
          >
            {hasGameAction('undo') && (
              <div className={styles.Item} onClick={() => chess.undoMove().catch(err => showNotification(err.message, 'error'))}>
                Undo move
              </div>
            )}
            {hasGameAction('randomMove') && (
              <div className={styles.Item} onClick={() => chess.makeAiMove(0)}>
                Random move
              </div>
            )}
            {hasGameAction('bestMove') && (
              <div className={styles.Item} onClick={() => chess.makeAiMove(10)}>
                Make best move
              </div>
            )}
            {hasGameAction('restart') && (
              <div className={styles.Item} onClick={() => chess.restart()}>
                Restart
              </div>
            )}
            {hasGameAction('fen') && (
              <div className={styles.Item} onClick={() => chess.getFen().then(copy)}>
                Copy FEN
              </div>
            )}
            {hasGameAction('pgn') && (
              <div className={styles.Item} onClick={() => chess.getPgn().then(copy)}>
                Copy PGN
              </div>
            )}
            {hasGameAction('ascii') && (
              <div className={styles.Item} onClick={() => chess.getAscii().then(copy)}>
                Copy ASCII
              </div>
            )}
            {hasGameAction('history') && (
              <div className={styles.Item} onClick={() => chess.getHistory().then(history => copy(JSON.stringify(history)))}>
                Copy history
              </div>
            )}
          </Collapse>
        )}
      </div>
      <Notification
        message={notificationMessage}
        onClose={setNotificationMessage}
        type={notificationType}
      />
    </>
  );
}

export default Actions;
