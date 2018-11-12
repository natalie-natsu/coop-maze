import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import Title from '../../components/MainHeader/Title';
import GameCreate from '../../components/Game/Create';

const Home = ({ t }) => (
  <div id="home">
    <Title>{t('test')}</Title>
    <div className="container">
      <div className="jumbotron">
        <h1 className="display-4">{t('page:Home.title')}</h1>
        <p className="lead">
          {t('page:Home.subtitle')}
        </p>
        <hr className="my-4" />
        <p>{t('page:Home.text')}</p>
        <GameCreate />
      </div>
    </div>
  </div>
);

Home.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate([])(Home);
