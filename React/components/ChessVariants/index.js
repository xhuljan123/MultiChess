import React, { useMemo, forwardRef } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import styles from './style.module.scss';

const ChessVariantsRef = forwardRef(
  function ChessVariants({ selectFirst, chess, ...extraProps }, ref) {
    const variants = useMemo(() => {
      const getVariants = chess.getVariants();

      return Object.keys(getVariants).map(v => ({
        value: v,
        label: getVariants[v].name
      }));
    }, []);

    return (
      <Select
        ref={ref}
        options={variants}
        placeholder="Select variant"
        isSearchable={true}
        className={styles.Select}
        defaultValue={selectFirst ? variants[0] : undefined}
        {...extraProps}
      />
    );
  }
);

ChessVariantsRef.propTypes = {
  selectFirst: PropTypes.bool,
  chess: PropTypes.object.isRequired
};

export default ChessVariantsRef;
