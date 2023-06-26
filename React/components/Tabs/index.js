import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './style.module.scss';

function Tabs({ items, active = 0, keepContent = true }) {
  const [activeTab, setActiveTab] = useState(active);
  const calledFunctions = useRef({});

  useEffect(() => {
    const onActive = items[activeTab]?.onActive;

    if (typeof onActive === 'function') {
      const isFirst = calledFunctions.current[activeTab] || false;

      onActive(isFirst);

      if (!isFirst) {
        calledFunctions.current[activeTab] = true;
      }
    }
  }, [items, activeTab]);

  if (!items.length) {
    return null;
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        {items.map((tab, index) => {
          const { title } = tab;

          return (
            <div
              key={title}
              className={cn(styles.TabItem, { [styles.active]: index === activeTab })}
              onClick={() => setActiveTab(index)}
            >
              {title}
            </div>
          );
        })}
      </div>
      <div className={styles.Content}>
        {keepContent ? items.map((item, index) => {

          return (
            <div key={index} style={{ display: activeTab === index ? 'block' : 'none' }}>
              {item?.content}
            </div>
          );
        }) : items[activeTab]?.content}
      </div>
    </div>
  );
}

Tabs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.node,
    onActive: PropTypes.func
  })).isRequired,
  active: PropTypes.number,
  keepContent: PropTypes.bool
};

export default Tabs;
