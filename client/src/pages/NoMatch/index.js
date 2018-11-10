import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft';

import { routes } from '../../helpers/routes';
import SideAction from '../../components/MainHeader/SideAction';

const NoMatch = ({ history, message, t }) => (
  <div id="noMatch">
    {history && (
      <SideAction>
        <div className="btn-side-action mx-2 mx-sm-3">
          <button type="button" className="btn" onClick={() => history.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
      </SideAction>
    )}
    <div className="container">
      <div className="row">
        <div className="col-lg-5 col-md-6 mx-auto">
          <div className="card border-primary animated bounceIn">
            <div className="card-body">
              <h4 className="card-title text-primary">
                404 <small>{t('page:NoMatch.card.title')}</small>
              </h4>
              <p className="card-text text-primary">
                {message || t('page:NoMatch.card.text')}
              </p>
              <Link
                to={routes.home}
                className="btn btn-outline-primary float-right btn-block btn-previous-down"
              >
                <FontAwesomeIcon icon={faHome} /> {t('page:NoMatch.card.button')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

NoMatch.propTypes = {
  history: PropTypes.shape({ goBack: PropTypes.func.isRequired }),
  message: PropTypes.string,
  t: PropTypes.func.isRequired,
};

NoMatch.defaultProps = {
  history: null,
  message: null,
};

export default translate(['page'])(NoMatch);
