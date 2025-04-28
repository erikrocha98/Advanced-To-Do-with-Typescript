import React from 'react';
import { IAppMenu } from '../../../modules/modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';

export const todoAppMenuItemList: (IAppMenu | null)[]=[
    {
        path: '/todo',
        name: 'To Do',
        icon: <SysIcon name={'dashboard'} />
    },
]
