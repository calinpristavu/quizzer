import Noty from 'noty';
import '../node_modules/noty/lib/noty.css';
import '../node_modules/noty/lib/themes/bootstrap-v4.css';

Noty.overrideDefaults({
  layout   : 'topRight',
  theme    : 'bootstrap-v4',
  closeWith: ['click'],
  timeout: 5000,
});
