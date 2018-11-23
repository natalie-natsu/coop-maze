import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { action as toggleMenu } from 'redux-burger-menu';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faCog from '@fortawesome/fontawesome-free-solid/faCog';

import './DrawerButton.css';

const DrawerButton = ({ burgerMenu, dispatch, t }) => (
  <div className="btn-drawer">
    <button
      className="btn"
      type="button"
      aria-expanded="false"
      aria-label={t('accessibility.aria-label.toggleNav')}
      onClick={() => dispatch(toggleMenu(!burgerMenu.isOpen))}
      onKeyPress={() => dispatch(toggleMenu(!burgerMenu.isOpen))}
    >
      <FontAwesomeIcon icon={faCog} />
    </button>
  </div>
);

DrawerButton.propTypes = {
  burgerMenu: PropTypes.shape({
    isOpen: PropTypes.bool.required,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default translate()(connect(
  state => ({ burgerMenu: state.burgerMenu }),
  dispatch => ({ dispatch }),
)(DrawerButton));
