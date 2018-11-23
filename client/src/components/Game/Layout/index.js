import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import { getRouteDesc, getRouteName } from '../../../helpers/routes';
import './Layout.css';
import Drawer from '../../Drawer';
import DrawerButton from './DrawerButton';

const Layout = ({ children, i18n, location, t }) => (
  <div id="game-layout">
    <Helmet>
      {getRouteName(location.pathname) ? (
        <title>{t(getRouteName(location.pathname))} | {t('project.title')}</title>
        ) : (<title>{t('project.title')}</title>)}
      <meta name="language" content={i18n.language} />
      {getRouteDesc(location.pathname) && (
      <meta name="description" content={getRouteDesc(location.pathname)} />
        )}
    </Helmet>
    <Drawer />
    <DrawerButton />
    <main>{children}</main>
  </div>
);

Layout.propTypes = {
  i18n: PropTypes.shape({ language: PropTypes.string }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
  t: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
};

export default withRouter(translate(['common', 'route'])(Layout));
