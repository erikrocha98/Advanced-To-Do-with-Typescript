import { IAppMenu, IModuleHub, IRoute } from './modulesTypings';
import Example from './example/config';
import Aniversario from './aniversario/config';
import UserProfile from './userprofile/config';
import Todo from './todo/config';

const pages: Array<IRoute | null> = [
	...UserProfile.pagesRouterList,
	...Example.pagesRouterList,
	...Todo.pagesRouterList
];

const menuItens: Array<IAppMenu | null> = [
	...Example.pagesMenuItemList, 
	...UserProfile.pagesMenuItemList,
	...Todo.pagesMenuItemList
];

const Modules: IModuleHub = {
	pagesMenuItemList: menuItens,
	pagesRouterList: pages
};

export default Modules;
