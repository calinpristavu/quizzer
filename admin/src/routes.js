import React from 'react';
import DefaultLayout from 'containers/DefaultLayout';

const Breadcrumbs = React.lazy(() => import('views/Base/Breadcrumbs/Breadcrumbs'));
const QuestionTemplates = React.lazy(() => import('views/Quiz/QuestionTemplates/QuestionTemplates'));
const QuizTemplates = React.lazy(() => import('views/Quiz/QuizTemplates/QuizTemplates'));
const Cards = React.lazy(() => import('views/Base/Cards/Cards'));
const Carousels = React.lazy(() => import('views/Base/Carousels/Carousels'));
const Collapses = React.lazy(() => import('views/Base/Collapses/Collapses'));
const Dropdowns = React.lazy(() => import('views/Base/Dropdowns/Dropdowns'));
const Forms = React.lazy(() => import('views/Base/Forms/Forms'));
const Jumbotrons = React.lazy(() => import('views/Base/Jumbotrons/Jumbotrons'));
const ListGroups = React.lazy(() => import('views/Base/ListGroups/ListGroups'));
const Navbars = React.lazy(() => import('views/Base/Navbars/Navbars'));
const Navs = React.lazy(() => import('views/Base/Navs/Navs'));
const Paginations = React.lazy(() => import('views/Base/Paginations/Pagnations'));
const Popovers = React.lazy(() => import('views/Base/Popovers/Popovers'));
const ProgressBar = React.lazy(() => import('views/Base/ProgressBar/ProgressBar'));
const Switches = React.lazy(() => import('views/Base/Switches/Switches'));
const Tables = React.lazy(() => import('views/Base/Tables/Tables'));
const Tabs = React.lazy(() => import('views/Base/Tabs/Tabs'));
const Tooltips = React.lazy(() => import('views/Base/Tooltips/Tooltips'));
const Charts = React.lazy(() => import('views/Charts/Charts'));
const Dashboard = React.lazy(() => import('views/Dashboard/Dashboard'));
const Users = React.lazy(() => import('views/Users/Users'));
const User = React.lazy(() => import('views/Users/User'));
const Results = React.lazy(() => import('views/Quiz/Results/Results'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/quiz/question-templates', name: 'Question Templates', component: QuestionTemplates },
  { path: '/quiz/quiz-templates', name: 'Quiz Templates', component: QuizTemplates },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/quiz/results', exact: true,  name: 'Results', component: Results },
  // { path: '/results/:id', exact: true, name: 'User Details', component: User },




  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/forms', name: 'Forms', component: Forms },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/charts', name: 'Charts', component: Charts },
];

export default routes;
