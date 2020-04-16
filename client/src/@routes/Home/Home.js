import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Redirect, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { getUser } from '@api/user';
import LoadComponent from '@components/LoadComponent';
import { ModalContainer } from '@components/Modal';
import PrivateRoute from '@components/PrivateRoute';
import { ToasterContainer } from '@components/Toaster';
import CreateUserForm from '@routes/Dashboard/CreateUserForm';
import { ROLES, logout, getUserProfile } from '@utils/auth';

const Dashboard = LoadComponent(() => import('../Dashboard'));
const User = LoadComponent(() => import('../User'));

const getUsername = () => {
  const userProfile = getUserProfile();

  return `${userProfile.firstName || ''} ${userProfile.lastName || ''}`;
};

const Home = () => {
  const { loadModal } = ModalContainer.useContainer();
  const { loadToaster } = ToasterContainer.useContainer();
  const [user, setUser] = useState({});

  const history = useHistory();
  const renderSettingsForm = (closeModal) => (
    <CreateUserForm closeModal={closeModal} history={history} user={user} />
  );

  //componentDidMount
  useEffect(() => {
    const success = (user) => {
      setUser(user);
    };
    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };

    getUser(getUserProfile().id, success, failure);
  }, []);

  const openSettingsModal = () => {
    loadModal({
      header: <div>Edit User Settings</div>,
      body: renderSettingsForm,
      type: 'form',
    });
  };

  return (
    <Wrapper>
      <Navbar variant="dark">
        <Navbar.Brand href="/">Time Management System</Navbar.Brand>
        <Nav>
          <NavDropdown title={getUsername()} id="basic-nav-dropdown">
            <NavDropdown.Item as="span" onClick={openSettingsModal}>
              <FontAwesomeIcon icon={faCog} />
              Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/" onClick={logout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
      <Switch>
        {/* ACL: Access Control List - Mention roles that case access a route */}
        <PrivateRoute
          exact
          path="/dashboard"
          component={Dashboard}
          acl={[ROLES.ADMIN, ROLES.MANAGER]}
        />
        <PrivateRoute exact path="/user" component={User} acl={[ROLES.BASIC]} />
        <PrivateRoute
          exact
          path="/user/:userId"
          component={User}
          acl={[ROLES.ADMIN]}
        />
        <Redirect from="/" to="/dashboard" />
      </Switch>
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div`
  .navbar {
    background-color: #5869ff;
    color: #ffffff;
    justify-content: space-between;

    &-nav {
      align-items: center;
    }
  }

  svg {
    margin-right: 5px;
  }

  .dropdown-item {
    cursor: pointer;
  }
`;
