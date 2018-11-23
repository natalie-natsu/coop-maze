import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import Title from '../../components/MainHeader/Title';
import GameCreate from '../../components/Game/Create';

import './Home.css';
import ScreenEffect from '../../components/ScreenEffect';

const Home = ({ t }) => (
  <div id="home">
    <Title>{t('project.credo')}</Title>
    <ScreenEffect>
      <div className="vertical-center">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title">
                <span className="title-word">Alien</span>
                <span className="title-word">CPU</span>
                <span className="title-word">mod.1</span>
              </h1>
            </div>
            <div className="col-md-6">
              <h2 className="mt-3">{t('page:Home.title')}</h2>
              <p>{t('page:Home.text')}</p>
              <GameCreate />
            </div>
          </div>
        </div>
      </div>
    </ScreenEffect>
  </div>
);

Home.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate([])(Home);
