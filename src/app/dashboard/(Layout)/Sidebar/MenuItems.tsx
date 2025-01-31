import DashboardIcon from '@mui/icons-material/Dashboard';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: DashboardIcon,
    href: '/',
  },
];

export default Menuitems;
