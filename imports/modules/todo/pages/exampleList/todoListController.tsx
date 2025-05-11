import React, { useCallback, useMemo, useState, useEffect } from 'react';
import TodoListView from './todoListView';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { ISchema } from '/imports/typings/ISchema';
import { ITodo } from '../../api/todoSch';
import { todoApi } from '../../api/todoApi';



interface IInitialConfig {
	sortProperties: { field: string; sortAscending: boolean };
	filter: Object;
	searchBy: string | null;
	viewComplexTable: boolean;
}

interface ITodoListContollerContext {
	onAddButtonClick: () => void;
	onDeleteButtonClick: (row: any) => void;
	todoList: ITodo[];
	schema: ISchema<any>;
	loading: boolean;
	onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onChangeCheckbox: (taskId: string, value: boolean) => void;
	onDeleteTask : (taskId: string) => void;
}

export const TodoListControllerContext = React.createContext<ITodoListContollerContext>(
	{} as ITodoListContollerContext
);

const initialConfig = {
	sortProperties: { field: 'createdat', sortAscending: true },
	filter: {},
	searchBy: null,
	viewComplexTable: false
};

const TodoListController = () => {
	const [config, setConfig] = React.useState<IInitialConfig>(initialConfig);

	const { title, type, typeMulti } = todoApi.getSchema();
	const todoSchReduzido = { title, type, typeMulti, createdat: { type: Date, label: 'Criado em' } };
	const navigate = useNavigate();

	const { sortProperties, filter } = config;
	const sort = {
		[sortProperties.field]: sortProperties.sortAscending ? 1 : -1
	};

	const { loading, todos } = useTracker(() => {
		const subHandle = todoApi.subscribe('todoList', filter, {
			sort
		});
		const todos = subHandle?.ready() ? todoApi.find(filter, { sort }).fetch() : [];
		return {
			todos,
			loading: !!subHandle && !subHandle.ready(),
			total: subHandle ? subHandle.total : todos.length
		};
	}, [config]);

	

	const onChangeCheckbox = (taskId: string, value: boolean) => {
		todoApi.updateTask(taskId, value, (error, result) => {
			if (error) {
				console.error('Erro ao atualizar tarefa:', error.reason);
			} else if (result) {
				console.log('Tarefa atualizada com sucesso');

			} else {
				console.warn('Nenhuma tarefa foi modificada');
			}
		});
	};
	const onDeleteTask = (taskId: string) => {
		todoApi.removeTask(taskId, (error) => {
			if (error) {
				console.error('Erro ao deletar a tarefa:', error.reason);
			} else {
				console.warn('Tarefa deletada com sucesso!');
			}
		});
	}
	const onAddButtonClick = useCallback(() => {
		const newDocumentId = nanoid();
		navigate(`/todo/create/${newDocumentId}`);
	}, []);

	const onDeleteButtonClick = useCallback((row: any) => {
		todoApi.remove(row);
	}, []);

	const onChangeTextField = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const delayedSearch = setTimeout(() => {
			setConfig((prev) => ({
				...prev,
				filter: { ...prev.filter, title: { $regex: value.trim(), $options: 'i' } }
			}));
		}, 1000);
		return () => clearTimeout(delayedSearch);
	}, []);

	const onSelectedCategory = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		if (!value) {
			setConfig((prev) => ({
				...prev,
				filter: {
					...prev.filter,
					type: { $ne: null }
				}
			}));
			return;
		}
		setConfig((prev) => ({ ...prev, filter: { ...prev.filter, type: value } }));
	}, []);

	const providerValues: ITodoListContollerContext = useMemo(
		() => ({
			onAddButtonClick,
			onDeleteButtonClick,
			todoList: todos,
			schema: todoSchReduzido,
			loading,
			onChangeTextField,
			onChangeCategory: onSelectedCategory,
			onChangeCheckbox,
			onDeleteTask
		}),
		[todos, loading]
	);

	return (
		<TodoListControllerContext.Provider value={providerValues}>
			<TodoListView />
		</TodoListControllerContext.Provider>
	);
};

export default TodoListController;
