import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { action as toggleMenu } from 'redux-burger-menu';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';

import { routes } from '../../helpers/routes';
import './MainHeader.css';
import Languages from '../Languages';

class MainHeader extends React.Component {
  componentDidMount() {
    const { onMount } = this.props;
    if (onMount) { onMount(); }
  }

  render() {
    const { burgerMenu, dispatch, t } = this.props;

    return (
      <header id="main-header">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container position-relative">
            <Link to={routes.home} className="navbar-brand mb-0 h1 d-none d-md-inline">
              {t('project.title')}
            </Link>
            <div className="btn-drawer my-2 ml-2 ml-sm-0 mr-2 mr-sm-3">
              <button
                className="btn"
                type="button"
                aria-expanded="false"
                aria-label={t('accessibility.aria-label.toggleNav')}
                onClick={() => dispatch(toggleMenu(!burgerMenu.isOpen))}
                onKeyPress={() => dispatch(toggleMenu(!burgerMenu.isOpen))}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
            <span className="d-none d-md-inline mr-3">
              <Languages />
            </span>
            <p id="title-dom" className="navbar-text mr-auto" />
            <div id="side-action-dom" />
          </div>
        </nav>
      </header>
    );
  }
}

MainHeader.propTypes = {
  burgerMenu: PropTypes.shape({
    isOpen: PropTypes.bool.required,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  onMount: PropTypes.func,
  t: PropTypes.func.isRequired,
};

MainHeader.defaultProps = {
  onMount: () => false,
};

export default translate(['common', 'component', 'form', 'route'])(connect(
  state => ({ burgerMenu: state.burgerMenu }),
  dispatch => ({ dispatch }),
)(MainHeader));
