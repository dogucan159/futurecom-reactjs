import { HomePage, TasksPage, UserProfilePage, EmailContentPage} from './pages';
import { withNavigationWatcher } from './contexts/navigation';
import { ConfigGroupsPage } from './pages/config-groups/config-groups';
import { ConfigsPage } from './pages/configs/configs';
import { EmailContentsPage } from './pages/email-contents/email-contents';

const routes = [
    {
        path: '/home',
        element: HomePage
    },
    {
        path: '/profile/:selectedUserId',
        element: UserProfilePage
    },    
    {
        path: '/tasks',
        element: TasksPage
    },    
    // {
    //     path: '/config-groups',
    //     element: ConfigGroupsPage
    // },  
    {
        path: '/configs',
        element: ConfigsPage
    }, 
    {
        path: '/email-contents',
        element: EmailContentsPage
    }, 
    {
        path: '/email-content/:selectedEmailContentId',
        element: EmailContentPage
    },              
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
