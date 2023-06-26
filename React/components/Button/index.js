import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { ITEM_TYPES } from '../../constants';
import styles from './style.module.scss';

function Button(props) {
  const {
    children,
    className,
    type = 'primary',
    disabled = false,
    fullSize = false,
    link = null,
    linkProps,
    center = false,
    ...extraProps
  } = props;

  const buttonHtml = (
    <button
      className={cn(
        styles.Button,
        styles[`Btn-${type}`],
        {
          [styles.FullSize]: fullSize,
          [styles.Center]: center
        },
        className
      )}
      disabled={disabled}
      {...extraProps}
    >
      {children}
    </button>
  );

  if (link && typeof link === 'string') {
    return (
      <a href={link} {...linkProps}>
        {buttonHtml}
      </a>
    );
  }

  return buttonHtml;
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(ITEM_TYPES),
  fullSize: PropTypes.bool,
  link: PropTypes.string,
  linkProps: PropTypes.object,
  center: PropTypes.bool
};

export default Button;
