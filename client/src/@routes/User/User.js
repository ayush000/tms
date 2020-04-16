import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrashAlt,
  faClock,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';

import { getTimelogs, deleteTimelog } from '@api/timelog';
import { getUser } from '@api/user';
import DataTable from '@components/DataTable';
import { ModalContainer } from '@components/Modal';
import { ToasterContainer } from '@components/Toaster';
import {
  Wrapper,
  Summary,
  Header,
  TableWrapper,
  ActionItems,
  ActionButtons,
  Cell,
} from '@styled';
import { getUserProfile } from '@utils/auth';
import { humanizeDuration, getFormattedTime } from '@utils/common';
import TimelogForm from './TimelogForm';
import { getAggregatedTimelogs } from '../../@api/timelog';
import printPage from '../../@components/PrintPage';
import AggregatedTimelogs from './AggregatedTimelogs';

const User = () => {
  const { loadModal } = ModalContainer.useContainer();
  const { loadToaster } = ToasterContainer.useContainer();
  const { userId } = useParams();
  // To get user id from either url params or from local storage.
  const getUserId = () => userId || getUserProfile().id;
  const pageSize = 5;
  const [user, setUser] = useState({});

  const [timelogs, setTimelogs] = useState({});
  const columns = [
    {
      Header: 'Date',
      accessor: 'loggedAt',
      Cell: (props) => <Cell>{getFormattedTime(props.value)}</Cell>,
      width: 150,
    },
    {
      Header: 'Total Time',
      accessor: 'duration',
      Cell: (props) => <Cell>{humanizeDuration(props.value)}</Cell>,
      width: 150,
    },
    {
      Header: 'Notes',
      accessor: 'notes',
    },
    {
      Header: '',
      Cell: (props) => {
        return (
          <ActionItems>
            <FontAwesomeIcon
              icon={faEdit}
              onClick={() => openTimelogModal(props.original)}
            />
            <FontAwesomeIcon
              icon={faTrashAlt}
              onClick={() => openDeleteTimelogModal(props.original.id)}
            />
          </ActionItems>
        );
      },
      width: 100,
    },
  ];

  // componentDidMount
  useEffect(() => {
    const success = (user) => {
      setUser(user);
    };
    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };

    getUser(getUserId(), success, failure);
    onFetchData({ page: 0 });
  }, []);

  const renderTimelogForm = (timelog) => (closeModal) => (
    <TimelogForm
      closeModal={closeModal}
      timelog={timelog}
      userId={getUserId()}
    />
  );

  const deleteTimelogEntry = (timelogId) => () => {
    const success = (data) => {
      loadToaster({ state: 'SUCCESS', body: data.message });
      window.location.reload();
    };
    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };

    deleteTimelog(getUserId(), timelogId, success, failure);
  };

  const openTimelogModal = (timelog = null) => {
    loadModal({
      header: timelog ? <div>Edit Time Log Entry</div> : <div>Log Time</div>,
      body: renderTimelogForm(timelog),
      type: 'form',
    });
  };

  const openDeleteTimelogModal = (timelogId) => {
    loadModal({
      body: () => 'Do you really want to delete this time log?',
      onSubmit: deleteTimelogEntry(timelogId),
    });
  };

  const onFetchData = (state) => {
    const success = (timelogs) => {
      setTimelogs(timelogs);
    };
    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };
    getTimelogs(
      { page: state.page + 1, limit: pageSize },
      getUserId(),
      success,
      failure
    );
  };

  const onPageChange = (pageIndex) => {
    onFetchData({ page: pageIndex });
  };

  const getBackground = (row) => {
    if (user.preferredWorkingHourPerDay) {
      return row._original.totalTimeLogged >= user.preferredWorkingHourPerDay
        ? '#89E894'
        : '#FA897B';
    }
  };

  const printTable = () => {
    const success = (data) => {
      printPage(
        <AggregatedTimelogs data={data} />,
        'Print: Aggregated timelogs'
      );
    };
    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };
    getAggregatedTimelogs({}, getUserId(), success, failure);
  };

  return (
    <Wrapper>
      <Summary>
        <Header>Timelog Entries ({timelogs.count})</Header>
        <ActionButtons>
          <Button onClick={() => openTimelogModal()}>
            <FontAwesomeIcon icon={faClock} />
            Log Time
          </Button>
          <Button onClick={printTable}>
            <FontAwesomeIcon icon={faPrint} />
            Print Preview
          </Button>
        </ActionButtons>
      </Summary>
      <TableWrapper>
        <DataTable
          data={timelogs.rows}
          columns={columns}
          onPageChange={onPageChange}
          pageSize={
            timelogs.rows ? timelogs.rows.length : Math.min(pageSize, 0)
          }
          pages={
            Math.floor(timelogs.count / pageSize) +
            (timelogs.count % pageSize !== 0 ? 1 : 0)
          }
          getTrProps={(state, rowInfo, column) => {
            if (rowInfo) {
              return {
                style: {
                  background: getBackground(rowInfo.row),
                },
              };
            } else {
              return {};
            }
          }}
        ></DataTable>
      </TableWrapper>
    </Wrapper>
  );
};

export default User;
