import React, { useContext, useState, useEffect } from 'react';
import cn from 'classnames';
import BoardContext from '../../context';
import Piece from '../Piece';
import { convertTime } from '../../utils';
import styles from './style.module.scss';

function PlayerTimes() {
  const { chess, isFlipped, useTime } = useContext(BoardContext);
  const [time, setTime] = useState({
    white: 0,
    black: 0,
  });
  const [hasTime, setHasTime] = useState(false);

  useEffect(() => {
    const startEventId = chess.on('start', async () => {
      setHasTime(await chess.hasTime());
    });
    let timeUpdateId;

    if (useTime) {
      timeUpdateId = chess.on('timeUpdate', (data) => {
        if (data.white && data.black) {
          setTime(data);
        }
      });
    }

    return () => {
      chess.clearEvent('start', startEventId);
      chess.clearEvent('timeUpdate', timeUpdateId);
    };
  }, [useTime]);

  if (!useTime) {
    return null;
  }

  const timeWhite = time?.white || 0;
  const timeBlack = time?.black || 0;

  return (
    <div className={cn(styles.BoardTimes, { [styles.BoardFlipped]: isFlipped })}>
      <div className={styles.BoardTime}>
        <Piece name="king" color="white" size={16} /> {hasTime ? convertTime(timeWhite) : '--:--'}
      </div>
      <div className={styles.BoardTime}>
        <Piece name="king" color="black" size={16} /> {hasTime ? convertTime(timeBlack) : '--:--'}
      </div>
    </div>
  );
}

export default PlayerTimes;
