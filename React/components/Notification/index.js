import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { ReactComponent as InfoSvg } from './assets/icons/info-circle.svg';
import styles from './style.module.scss';

function Notification(props) {
  const {
    message,
    time = 5000,
    closeClick = true,
    onClose,
    type = 'info'
  } = props;
  const [isOpen, setIsOpen] = useState(null);
  const timeout = useRef(null);

  function close() {
    if (closeClick) {
      clearTimeout(timeout.current);
      setIsOpen(false);

      if (typeof onClose === 'function') {
        onClose(null);
      }
    }
  }

  useEffect(() => {
    clearTimeout(timeout.current);
    setIsOpen(message);

    if (message && time > 0) {
      timeout.current = setTimeout(() => {
        close();
      }, time);
    }

    return () => clearTimeout(timeout.current);
  }, [message]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={cn(styles.Notification, styles[type])} onClick={close}>
      <InfoSvg width="20" />
      <div>{isOpen}</div>
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string,
  time: PropTypes.number,
  closeClick: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.oneOf(['info', 'error']),
};

export default Notification;
