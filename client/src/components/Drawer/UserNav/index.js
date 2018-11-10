import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { routes } from '../../../helpers/routes';
import './UserNav.scss';

const UserNav = ({ handleClick, firstName, lastName, picture }) => (
  <div className="user-nav media">
    <Link to={routes.me.exact} className="mr-3 align-self-center" onClick={handleClick}>
      <img className="rounded-circle" src={picture} alt={`${firstName} ${lastName}`} />
    </Link>
    <div className="media-body align-self-center">
      <p className="mb-0">
        <Link to={routes.me.exact} className="nav-link" onClick={handleClick}>
          {`${firstName} ${lastName}`}
        </Link>
      </p>
    </div>
  </div>
);

UserNav.propTypes = {
  handleClick: PropTypes.func,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  picture: PropTypes.string.isRequired,
};

UserNav.defaultProps = {
  handleClick: () => false,
  firstName: null,
  lastName: null,
};

export default UserNav;
