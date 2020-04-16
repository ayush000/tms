import ReactDOMServer from 'react-dom/server';

const printPage = (component, title) => {
  const printWindow = window.open('about:blank', '_blank');
  const staticMarkup = ReactDOMServer.renderToStaticMarkup(component);
  const printString = `
    <html>
      <head>
        <title>${title || 'Print Page'}</title>
        <link rel="stylesheet" href="../react-table.min.css">
      </head>
      <body id='print-body'>${staticMarkup}</body>
    </html>
  `;
  printWindow.document.write(printString);
  printWindow.document.close();
};

export default printPage;
