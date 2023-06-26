import React, { useContext } from 'react';
import cn from 'classnames';
import BoardContext from '../../context';
import styles from './style.module.scss';

function Ranks() {
  const { isFlipped, showCoordinates, ranksPosition } = useContext(BoardContext);

  if (!showCoordinates) {
    return null;
  }

  return (
    <div className={cn(styles.BoardRanks, { [styles.BoardFlipped]: isFlipped, [styles.RankRight]: ranksPosition === 'right' } )}>
      <div className={styles.Rank}>8</div>
      <div className={styles.Rank}>7</div>
      <div className={styles.Rank}>6</div>
      <div className={styles.Rank}>5</div>
      <div className={styles.Rank}>4</div>
      <div className={styles.Rank}>3</div>
      <div className={styles.Rank}>2</div>
      <div className={styles.Rank}>1</div>
    </div>
  );
}

export default Ranks;
