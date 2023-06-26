import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import Select from 'react-select';
import BoardContext from '../../context';
import ChessVariants from '../../../ChessVariants';
import { copyToClipboard } from '../../../utils';
import styles from './style.module.scss';

const PLAYER_TURNS_OPTIONS = [
  {
    value: 'w',
    label: 'White'
  },
  {
    value: 'b',
    label: 'Black'
  }
];

const CASTLING_OPTIONS = [
  {
    value: 'K',
    label: 'White king side (O-O)'
  },
  {
    value: 'Q',
    label: 'White queen side (O-O-O)'
  },
  {
    value: 'k',
    label: 'Black king side (O-O)'
  },
  {
    value: 'q',
    label: 'Black queen side (O-O-O)'
  }
];

function BoardEditorActions() {
  const { chess, editorMode } = useContext(BoardContext);
  const [fen, setFen] = useState('');
  const [variant, setVariant] = useState('');
  const selectRef = useRef(null);

  const variants = useMemo(() => {
    const getVariants = chess.getVariants();

    return Object.keys(getVariants).map(v => ({
      value: v,
      label: getVariants[v].name
    }));
  }, []);

  function handleFenManualUpdate(newFen) {
    setFen(newFen);

    chess.getCurrentVariant().then(({ key: variant }) => {
      chess.start({
        fen: newFen,
        variant
      });
    })
      .catch(() => {
        chess.start({ fen: newFen });
      });
  }

  function getVariantValue(variant) {
    return variants[variants.findIndex(v => v.value === variant)];
  }

  useEffect(() => {
    if (editorMode) {
      const startEvent = chess.on('start', async () => {
        const { key: getVariant } = await chess.getCurrentVariant();
        setFen(await chess.getFen());
        setVariant(getVariant);
      });

      const putEventId = chess.on('put', (data) => {
        const { fen } = data;
        setFen(fen);
      });

      return () => {
        chess.clearEvent('start', startEvent);
        chess.clearEvent('put', putEventId);
      };
    }
  }, [editorMode]);

  useEffect(() => {
    if (variant && selectRef.current) {
      selectRef.current.setValue(getVariantValue(variant));
    }
  }, [variant]);

  if (!editorMode) {
    return null;
  }

  return (
    <div className={styles.Root}>
      <div className={styles.InputGroup}>
        <div className={styles.Text} onClick={() => copyToClipboard(fen)}>FEN</div>
        <input
          className={styles.Input}
          type="text"
          value={fen}
          onChange={(e) => handleFenManualUpdate(e.target.value)}
        />
      </div>
      <div className={styles.Actions}>
        <div className={styles.SelectBox}>
          <div className={styles.RowCell}>Variant</div>
          <div className={styles.RowCell}>
            <ChessVariants
              chess={chess}
              ref={selectRef}
              options={variants}
              placeholder="Select variant"
              onChange={({ value }) => {
                if (value !== variant) {
                  chess.start({ variant: value });
                }
              }}
              defaultValue={getVariantValue(variant)}
              isSearchable={true}
            />
          </div>
        </div>
        <div className={styles.SelectBox}>
          <div className={styles.RowCell}>Player to start</div>
          <div className={styles.RowCell}>
            <Select
              options={PLAYER_TURNS_OPTIONS}
              placeholder="-"
              onChange={({ value }) => {
                const split = fen.split(' ');

                split[1] = value;

                handleFenManualUpdate(split.join(' '));
              }}
            />
          </div>

        </div>
        <div className={styles.SelectBox}>
          <div className={styles.RowCell}>Castling</div>
          <div className={styles.RowCell}>
            <Select
              options={CASTLING_OPTIONS}
              placeholder="-"
              onChange={(selected) => {
                const castling = [];

                selected.forEach(c => {
                  castling.push(c.value);
                });

                const split = fen.split(' ');

                split[2] = castling.length ? castling.join('') : '-';

                handleFenManualUpdate(split.join(' '));
              }}
              isMulti
              closeMenuOnSelect={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardEditorActions;
