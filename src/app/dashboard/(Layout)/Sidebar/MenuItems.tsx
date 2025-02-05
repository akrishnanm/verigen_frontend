import DashboardIcon from '@mui/icons-material/Dashboard';
import ClouduploadIcon from '@mui/icons-material/CloudUpload';

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
  {
    id: uniqueId(),
    title: 'Upload',
    icon: ClouduploadIcon,
    href: 'dashboard/upload',
  },
];

export default Menuitems;
