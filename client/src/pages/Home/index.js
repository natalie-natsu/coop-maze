import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import Title from '../../components/MainHeader/Title';

const Home = ({ t }) => (
  <div id="home">
    <Title>{t('test')}</Title>
    <div className="container">
      <div className="jumbotron">
        <h1 className="display-4">Hello, world!</h1>
        <p className="lead">
          This is a simple hero unit, a simple jumbotron-style component for calling extra attention to
          featured content or information.
        </p>
        <hr className="my-4" />
        <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
        <a className="btn btn-primary btn-lg" href="/" role="button">Learn more</a>
      </div>
    </div>
  </div>
);

Home.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate([])(Home);
