import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faCircleNotch from '@fortawesome/fontawesome-free-solid/faCircleNotch';
import './SplashScreen.css';

const SplashScreen = ({ t }) => (
  <div className="splashScreen">
    <div className="svg-container">
      <FontAwesomeIcon icon={faCircleNotch} spin />
      <p className="mt-2">{t('splashLoading')}</p>
    </div>
  </div>
);

SplashScreen.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate()(SplashScreen);
