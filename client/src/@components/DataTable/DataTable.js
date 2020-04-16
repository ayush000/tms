import React, { useState } from 'react';
import ReactTable from 'react-table-v6';
import styled from 'styled-components';
import Loader from '../Loader';

const DataTable = ({ data, columns, ...rest }) => {
  const [page, setPage] = useState(0);

  return (
    <Wrapper>
      <ReactTable
        {...rest}
        onPageChange={(pageIndex) => {
          setPage(pageIndex);
          rest.onPageChange(pageIndex);
        }}
        page={page}
        data={data}
        columns={columns}
        LoadingComponent={({ loading }) => {
          return loading ? <LoaderWrapper><Loader /></LoaderWrapper> : null;
        }}
      />
    </Wrapper>
  );
};

export default DataTable;

DataTable.defaultProps = {
  data: [],
  defaultPageSize: 10,
  showPageSizeOptions: false,
  showPaginationBottom: false,
  showPaginationTop: true,
  resizable: false,
  manual: true,
  noDataText: 'Nothing to display',
};

const Wrapper = styled.div`
  .rt-noData {
    position: static;
    transform: none;
    text-align: center;
    border: 1px solid #e5e5e5;
    padding: 12px;
  }

  .ReactTable {
    .-pagination {
      box-shadow: none;
      border: 1px solid #e5e5e5;
    }

    .rt-thead {
      box-shadow: none;
      border-bottom: 1px solid #e5e5e5;

      .rt-tr {
        text-align: left;
        font-weight: 500;
      }

      .rt-th {
        padding: 20px;
        border-right: 1px solid #e5e5e5;
        outline: none;
      }
    }

    .rt-th,
    .rt-td {
      font-size: 14px;
      box-shadow: none;
    }

    .rt-td {
      padding: 10px 20px;
      border: none;
      white-space: pre-wrap;
    }
  }
`;

const LoaderWrapper = styled.div`
  position: relative;
`;
