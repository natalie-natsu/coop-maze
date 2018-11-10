import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { slide as Menu } from 'react-burger-menu';
import { decorator as reduxBurgerMenu, action as toggleMenu } from 'redux-burger-menu';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faCircle from '@fortawesome/fontawesome-free-solid/faCircle';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebook';
import faTwitter from '@fortawesome/fontawesome-free-brands/faTwitter';
import faYoutube from '@fortawesome/fontawesome-free-brands/faYoutube';

import { routes } from '../../helpers/routes';

import './Drawer.css';
import Languages from '../Languages';
import DrawerSeparator from './Separator/index';

function fixBody(menuState) {
  const body = document.querySelector('body');

  if (menuState.isOpen) body.classList.add('fixed');
  else body.classList.remove('fixed');
}

function close(dispatch) {
  dispatch(toggleMenu(false));
}

const Drawer = ({ dispatch, isOpen, t }) => (
  <Menu
    isOpen={isOpen}
    pageWrapId="page"
    outerContainerId="app"
    onStateChange={(menuState) => {
      fixBody(menuState);
      if (isOpen !== menuState.isOpen) {
        dispatch(toggleMenu(menuState.isOpen));
      }
    }}
  >
    <nav id="drawer-nav">
      <header>
        <Link to={routes.home} className="nav-link" onClick={() => close(dispatch)}>
          <h3>{t('project.title')}</h3>
        </Link>
      </header>
      <section>
        <ul className="fa-ul">
          <li className="nav-item">
            <Link className="nav-link" to="/noMatch" onClick={() => close(dispatch)}>
              <FontAwesomeIcon icon={faCircle} listItem />
              &nbsp;No match
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={routes.notAllowed} onClick={() => close(dispatch)}>
              <FontAwesomeIcon icon={faCircle} listItem />
              &nbsp;Not Allowed
            </Link>
          </li>
        </ul>
      </section>
      <section>
        <DrawerSeparator>Separator</DrawerSeparator>
        <ul className="fa-ul">
          <li className="nav-item">
            <Link className="nav-link" to={routes.home} onClick={() => close(dispatch)}>
              <FontAwesomeIcon icon={faCircle} listItem />
              &nbsp;Link
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={routes.home} onClick={() => close(dispatch)}>
              <FontAwesomeIcon icon={faCircle} listItem />
              &nbsp;Link
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={routes.home} onClick={() => close(dispatch)}>
              <FontAwesomeIcon icon={faCircle} listItem />
              &nbsp;Link
            </Link>
          </li>
        </ul>
      </section>
      <section>
        <DrawerSeparator>Separator</DrawerSeparator>
        <Languages />
      </section>
      <footer>
        <a className="nav-link" href="/" target="_blank">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a className="nav-link" href="/" target="_blank">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a className="nav-link" href="/" target="_blank">
          <FontAwesomeIcon icon={faYoutube} />
        </a>
        <Link className="nav-link" to="/" onClick={() => close(dispatch)}>
          <FontAwesomeIcon icon={faEnvelope} />
        </Link>
      </footer>
    </nav>
  </Menu>
);

Drawer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default translate([])(connect(
  () => ({}),
  dispatch => ({ dispatch }),
)(reduxBurgerMenu(Drawer)));
