import React, { useContext } from 'react';
import cn from 'classnames';
import BoardContext from '../../context';
import styles from './style.module.scss';

function Letters() {
  const { isFlipped, showCoordinates, lettersPosition } = useContext(BoardContext);

  if (!showCoordinates) {
    return null;
  }

  return (
    <div className={cn(styles.BoardLetters, { [styles.BoardFlipped]: isFlipped, [styles.LettersTop]: lettersPosition === 'top' })}>
      <div className={styles.Letter}>a</div>
      <div className={styles.Letter}>b</div>
      <div className={styles.Letter}>c</div>
      <div className={styles.Letter}>d</div>
      <div className={styles.Letter}>e</div>
      <div className={styles.Letter}>f</div>
      <div className={styles.Letter}>g</div>
      <div className={styles.Letter}>h</div>
    </div>
  );
}

export default Letters;
