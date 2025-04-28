import React from 'react';
import { todoRouterList } from './todoRouters';
import { todoAppMenuItemList } from './todoAppMenu';
import { IModuleHub } from '../../modulesTypings';

const ToDos: IModuleHub = {
    pagesRouterList: todoRouterList,
    pagesMenuItemList: todoAppMenuItemList
};