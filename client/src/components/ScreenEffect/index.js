import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './ScreenEffect.css';

const ScreenEffect = ({ children, navbar }) => (
  <div id="screen-effect" className={classNames({ navbar })}>{children}</div>
);

ScreenEffect.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  navbar: PropTypes.bool,
};

ScreenEffect.defaultProps = {
  navbar: true,
};

export default ScreenEffect;
