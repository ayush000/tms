import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faUserEdit,
  faTrashAlt,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';

import { getUsers, deleteUser } from '@api/user';
import DataTable from '@components/DataTable';
import { ModalContainer } from '@components/Modal';
import { ToasterContainer } from '@components/Toaster';
import {
  Wrapper,
  Summary,
  Header,
  TableWrapper,
  ActionButtons as ActionItems,
  Cell,
} from '@styled';
import { getUserProfile, ROLES } from '@utils/auth';
import { humanizeDuration } from '@utils/common';
import CreateUserForm from './CreateUserForm';

const Dashboard = () => {
  const { loadModal } = ModalContainer.useContainer();
  const { loadToaster } = ToasterContainer.useContainer();
  const [users, setUsers] = useState({});
  const history = useHistory();
  const redirectToUserPage = (id) => history.push(`/user/${id}`);
  const { role } = getUserProfile();
  const pageSize = 5;

  const columns = [
    {
      Header: 'Employee ID',
      accessor: 'employeeId',
    },
    {
      Header: 'Name',
      accessor: 'firstName',
      Cell: (props) => (
        <Cell>{`${props.original.firstName} ${props.original.lastName}`}</Cell>
      ),
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Role',
      accessor: 'role',
    },
    {
      Header: 'Preferred Working Hours Per Day',
      accessor: 'preferredWorkingHourPerDay',
      Cell: (props) => (
        <Cell>{props.value ? humanizeDuration(props.value) : '-'}</Cell>
      ),
      width: 300,
    },
    {
      Header: '',
      Cell: (props) => {
        return (
          <ActionItems>
            <FontAwesomeIcon
              icon={faUserEdit}
              onClick={() => openCreateUserModal(props.original)}
            />
            {role === ROLES.ADMIN && props.original.role === ROLES.BASIC && (
              <FontAwesomeIcon
                icon={faEye}
                onClick={() => redirectToUserPage(props.original.id)}
              />
            )}
            <FontAwesomeIcon
              icon={faTrashAlt}
              onClick={() => openDeleteUserModal(props.original.id)}
            />
          </ActionItems>
        );
      },
      width: 100,
    },
  ];
  // componentDidMount
  useEffect(() => {
    onFetchData({ page: 0 });
  }, []);

  const deleteUserEntry = (userId) => () => {
    const success = (data) => {
      loadToaster({ state: 'SUCCESS', body: data.message });
      history.push('/');
    };
    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };

    deleteUser(userId, success, failure);
  };

  const renderCreateUserForm = (user) => (closeModal) => (
    <CreateUserForm closeModal={closeModal} history={history} user={user} />
  );

  const openCreateUserModal = (user = null) => {
    loadModal({
      header: <div>Create User</div>,
      body: renderCreateUserForm(user),
      type: 'form',
    });
  };

  const openDeleteUserModal = (userId) => {
    loadModal({
      body: () => 'Do you really want to delete this user?',
      onSubmit: deleteUserEntry(userId),
    });
  };

  const onFetchData = (state) => {
    const success = (users) => {
      setUsers(users);
    };
    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };

    getUsers({ page: state.page + 1, limit: pageSize }, success, failure);
  };

  const onPageChange = (pageIndex) => {
    onFetchData({ page: pageIndex });
  };

  return (
    <Wrapper>
      <Summary>
        <Header>Users ({users.count})</Header>
        <Button onClick={() => openCreateUserModal()}>
          <FontAwesomeIcon icon={faUserPlus} />
          Create User
        </Button>
      </Summary>
      <TableWrapper>
        <DataTable
          data={users.rows}
          columns={columns}
          onPageChange={onPageChange}
          pageSize={users.rows ? users.rows.length : Math.min(pageSize, 0)}
          pages={
            Math.floor(users.count / pageSize) +
            (users.count % pageSize !== 0 ? 1 : 0)
          }
        ></DataTable>
      </TableWrapper>
    </Wrapper>
  );
};

export default Dashboard;
