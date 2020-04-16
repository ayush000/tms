import React from 'react';

import DataTable from '@components/DataTable';
import { Cell } from '@styled';
import { getFormattedTime, humanizeDuration } from '@utils/common';

const AggregatedTimelogs = ({ data }) => {
  const columns = [
    {
      Header: 'Date',
      accessor: 'loggedAt',
      Cell: (props) => <Cell>{getFormattedTime(props.value)}</Cell>,
      width: 150,
      sortable: false,
    },
    {
      Header: 'Total Time',
      accessor: 'totalTimeLogged',
      Cell: (props) => <Cell>{humanizeDuration(props.value)}</Cell>,
      width: 150,
      sortable: false,
    },
    {
      Header: 'Notes',
      accessor: 'aggregatedNotes',
      sortable: false,
      Cell: (props) => (
        <ul>
          {props.value.map((note, id) => (
            <li key={`notes_${props.viewIndex}_${id}`}>{note}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      showPagination={false}
      pageSize={(data || []).length}
    />
  );
};

export default AggregatedTimelogs;
