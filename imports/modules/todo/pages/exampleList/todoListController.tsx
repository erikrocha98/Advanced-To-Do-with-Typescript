import React, { useCallback, useMemo, useState, useEffect, useContext } from 'react';
import TodoListView from './todoListView';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { ISchema } from '/imports/typings/ISchema';
import { ITodo } from '../../api/todoSch';
import { todoApi } from '../../api/todoApi';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface IInitialConfig {
	sortProperties: { field: string; sortAscending: boolean };
	filter: Object;
	searchBy: string | null;
	viewComplexTable: boolean;
}

interface ITodoListContollerContext {
	onAddButtonClick: () => void;
	todoList: ITodo[];
	schema: ISchema<any>;
	loading: boolean;
	onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onChangeCheckbox: (taskId: string, value: boolean) => void;
	onDeleteTask: (taskId: string, tarefa: ITodo) => void;
	onEditButtonClick: (tarefa: ITodo) => void
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
	const sysLayoutContext = useContext<IAppLayoutContext>(AppLayoutContext);

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



	const onChangeCheckbox = async (taskId: string, value: boolean) => {
		todoApi.updateTask(taskId, value, (error, result) => {
			if (error) {
				sysLayoutContext.showNotification({
					type: "error",
					message: 'Acesso Negado: Você não é o criador dessa tarefa!'
				});
			} else if (result) {
				sysLayoutContext.showNotification({
					type: "success",
					message: 'Tarefa atualizada com sucesso!'
				});

			} else {
				console.warn('Nenhuma tarefa foi modificada');
			}
		});

	};
	const onDeleteTask = async (taskId: string, tarefa: ITodo) => {
		const usuario = await Meteor.userAsync();
		if (tarefa.createdby !== usuario?._id) {
			sysLayoutContext.showNotification({
				type: "error",
				message: 'Acesso negado: você não é o criador dessa tarefa!'
			});
			throw new Meteor.Error("Acesso negado");
		}
		else {
			todoApi.removeTask(taskId, (error) => {
				if (error) {
					console.error('Erro ao deletar a tarefa:', error.reason);
				} else {
					sysLayoutContext.showNotification({
						type: "success",
						message: 'Tarefa removida com sucesso!'
					});
				}
			});
		}
	};
	const onAddButtonClick = useCallback(() => {
		const newDocumentId = nanoid();
		navigate(`/todo/create/${newDocumentId}`);
	}, []);

	const onEditButtonClick = async (tarefa: ITodo) => {
		try {
			const usuario = await Meteor.userAsync();
			if (tarefa.createdby !== usuario?._id) {
				sysLayoutContext.showNotification({
					type: "error",
					message: 'Acesso negado: você não é o criador dessa tarefa!'
				});
				throw new Meteor.Error("Acesso negado");
			}
			navigate(`/todo/edit/${tarefa._id}`);
		} catch (err) {
			console.error(err);
		}
	};

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

	const providerValues: ITodoListContollerContext = useMemo(
		() => ({
			onAddButtonClick,
			todoList: todos,
			schema: todoSchReduzido,
			loading,
			onChangeTextField,
			onChangeCheckbox,
			onDeleteTask,
			onEditButtonClick
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
