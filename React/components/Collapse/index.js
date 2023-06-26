import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './style.module.scss';
import { ReactComponent as ArrowSvg } from './assets/icons/right-arrow.svg';

function Collapse(props) {
  const {
    open = false,
    button,
    children,
    className,
    classNameButton,
    classNameContainer,
    toggleOnContainerClick = false,
    closeOnOutsideClick = true,
    arrow = false,
    arrowSize = 16,
    arrowEnd = true
  } = props;
  const [isOpen, setIsOpen] = useState(open);

  const toggleOnClick = () => {
    if (toggleOnContainerClick) {
      setIsOpen(prev => !prev);
    }
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  if (!button) {
    return null;
  }

  return (
    <div className={className}>
      {closeOnOutsideClick && isOpen && (
        <div className={styles.OutsideContainer} onClick={() => setIsOpen(false)} />
      )}
      <div className={cn(styles.Button, classNameButton)} onClick={() => setIsOpen(prev => !prev)}>
        {button}
        {arrow && (
          <ArrowSvg className={cn(styles.Arrow, { [styles.open]: isOpen, [styles.end]: arrowEnd })} width={arrowSize} />
        )}
      </div>
      {isOpen && (
        <div className={classNameContainer} onClick={toggleOnClick}>
          {children}
        </div>
      )}
    </div>
  );
}

Collapse.propTypes = {
  open: PropTypes.bool,
  button: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  classNameButton: PropTypes.string,
  classNameContainer: PropTypes.string,
  toggleOnContainerClick: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  arrow: PropTypes.bool,
  arrowSize: PropTypes.number,
  arrowEnd: PropTypes.bool
};

export default Collapse;
