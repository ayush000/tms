import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

// Listing styles
export const Wrapper = styled.div`
  padding: 15px;

  svg {
    margin-right: 10px;
    cursor: pointer;
  }
`;

export const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Header = styled.h4`
  margin: 0;
`;

export const TableWrapper = styled.div`
  margin-top: 25px;
`;

export const Cell = styled.span``;

export const ActionItems = styled.div`
  display: flex;
`;

export const ActionButtons = styled.div`
  display: flex;

  button {
    margin-left: 10px;
  }
`;
