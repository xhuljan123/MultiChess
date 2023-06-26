import React, { useContext, useState, useEffect } from 'react';
import BoardContext from '../../context';
import styles from './style.module.scss';

function GameEndedMessage() {
  const { chess, useGameEndedMessage } = useContext(BoardContext);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const eventsId = chess.on(['start', 'finish'], () => {
      chess.isGameFinished().then(res => {
        setIsFinished(res);
      });
    });

    return () => {
      eventsId.then((events) => {
        for (let ev in events) {
          chess.clearEvent(ev, events[ev]);
        }
      });
    };
  }, []);

  if (!useGameEndedMessage || !isFinished?.type) {
    return null;
  }

  function getMessage() {
    switch (isFinished?.type) {
      case 'win':

        return (
          <>
            {isFinished?.winBy} win - <b>{isFinished?.name}</b>
          </>
        );

      case 'draw':

        return (
          <>
            Game draw - <b>{isFinished?.name}</b>
          </>
        );

      default:

        return (
          <>
            Game aborted - <b>{isFinished?.name}</b>
          </>
        );
    }
  }

  return (
    <div className={styles.GameFinished}>
      {getMessage()}
    </div>
  );
}

export default GameEndedMessage;
