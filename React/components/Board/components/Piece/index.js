import React from 'react';
import PropTypes from 'prop-types';
import IMAGES from './Images';

function Piece({ name, color, size, ...props }) {
  const piece = `${name}-${color}`;
  return (
    <img
      src={IMAGES[`${piece}.png`]}
      alt={piece}
      title={name}
      width={size}
      height={size}
      {...props}
    />
  );
}

Piece.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default Piece;
