import Loadable from 'react-loadable';

import Loader from '../Loader';

export default (loader) =>
  Loadable({
    loader,
    loading: Loader,
  });
