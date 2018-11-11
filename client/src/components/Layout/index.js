import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import { getRouteDesc, getRouteName } from '../../helpers/routes';
import './Layout.css';
import ScrollToTop from '../ScrollToTop';
import Drawer from '../Drawer';
import MainHeader from '../MainHeader';
import Loader from '../Loader';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contentCanBeLoaded: false };
  }

  render() {
    const { children, i18n, location, t } = this.props;
    return (
      <div id="layout">
        <Helmet>
          {getRouteName(location.pathname) ? (
            <title>
              {t(getRouteName(location.pathname))} | {t('project.title')}
            </title>
          ) : (
            <title>{t('project.title')}</title>
          )}
          <meta name="robots" content="all" />
          <meta name="language" content={i18n.language} />
          {getRouteDesc(location.pathname) && (
            <meta name="description" content={getRouteDesc(location.pathname)} />
          )}
        </Helmet>
        <ScrollToTop />
        <Drawer />
        <MainHeader onMount={() => this.setState({ contentCanBeLoaded: true })} />
        <main id="page" className="content-wrapper">
          {this.state.contentCanBeLoaded ? children : <Loader />}
        </main>
      </div>
    );
  }
}

Layout.propTypes = {
  i18n: PropTypes.shape({ language: PropTypes.string }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
  t: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default withRouter(translate(['common', 'route'])(Layout));
