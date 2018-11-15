import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/en-gb';

import numeral from 'numeral';
import 'numeral/locales/fr';
import 'numeral/locales/en-gb';

import { routes } from '../../helpers/routes';
import { localeTo } from '../../helpers/locales';

import './App.css';

import Layout from '../Layout';

import NotAllowed from '../../pages/NotAllowed';
import NoMatch from '../../pages/NoMatch';
import Home from '../../pages/Home';
import Game from '../Game';

class App extends React.Component {
  componentDidMount() {
    moment.locale(localeTo(this.props.i18n.language, 'moment'));
    numeral.locale(localeTo(this.props.i18n.language, 'moment'));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n.language !== this.props.i18n.language) {
      moment.locale(localeTo(this.props.i18n.language, 'moment'));
      numeral.locale(localeTo(this.props.i18n.language, 'moment'));
    }
  }

  render() {
    const { gameId, socketId } = this.props;
    return (
      <div id="app">
        <ToastContainer />
        <BrowserRouter>
          <div>
            {socketId && gameId && <Redirect to={{ pathname: routes.game.replace(':id', gameId) }} />},
            <Switch>
              <Route exact path={routes.game} component={Game} />
              <Layout>
                <Route exact path={routes.home} component={Home} />
                <Route path={routes.notAllowed} component={NotAllowed} />
                <Route component={NoMatch} />
              </Layout>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

App.propTypes = {
  i18n: PropTypes.shape({ language: PropTypes.string }),
  gameId: PropTypes.string,
  socketId: PropTypes.string,
};
App.defaultProps = {
  i18n: { language: 'en' },
  gameId: null,
  socketId: null,
};

export default translate()(connect(
  state => ({
    gameId: state.global.gameId,
    socketId: state.global.socketId,
  }),
  dispatch => ({ dispatch }),
)(App));
