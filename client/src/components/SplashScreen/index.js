import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faCircleNotch from '@fortawesome/fontawesome-free-solid/faCircleNotch';
import './SplashScreen.css';
import ScreenEffect from '../ScreenEffect';

const SplashScreen = ({ t, text, translated }) => (
  <div className="splashScreen">
    <ScreenEffect navbar={false}>
      <div className="svg-container">
        <FontAwesomeIcon icon={faCircleNotch} spin />
        <p className="mt-2">{(text && (translated ? text : t(text))) || t('splashLoading')}</p>
      </div>
    </ScreenEffect>
  </div>
);

SplashScreen.propTypes = {
  t: PropTypes.func.isRequired,
  text: PropTypes.string,
  translated: PropTypes.bool,
};


SplashScreen.defaultProps = {
  text: null,
  translated: false,
};

export default translate()(SplashScreen);
