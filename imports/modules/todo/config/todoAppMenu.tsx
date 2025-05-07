import React from 'react';
import { IAppMenu } from '/imports/modules/modulesTypings';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';

export const todoMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/todo',
		name: 'Todo Boilerplate',
		icon: <SysIcon name={'dashboard'} />
	}
];
