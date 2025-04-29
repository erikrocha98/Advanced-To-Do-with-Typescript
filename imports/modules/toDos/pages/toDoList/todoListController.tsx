import React, { useCallback, useMemo } from 'react';
import TodoListView from './todoListView';
import { nanoid } from 'nanoid';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { todoApi } from '../../api/todoApi';
import { ITodo } from '../../api/todoSchemaApi';
import { ISchema } from '/imports/typings/ISchema';


interface IInitialConfig{
    sortProperties: { field: string; sortAscending: boolean };
    filter: Object;
    searchBy: string | null;
}
interface ITodoListContollerContext {
    onAddButtonClick: () => void;
    onDeleteButtonClick: (row: any) => void;
    todoList: ITodo[];
    schema: ISchema<any>;
    loading: boolean;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TodoListControllerContext = React.createContext<ITodoListContollerContext>(
    {} as ITodoListContollerContext
)

const initialConfig = {
    sortProperties: { field: 'createdat', sortAscending: true },
    filter: {},
    searchBy: null
}

const TodoListController = () =>{
    const [config, setConfig] = React.useState<IInitialConfig>(initialConfig);
    const navigate = useNavigate();
    const {sortProperties, filter} = config;
    const sort ={
        [sortProperties.field]: sortProperties.sortAscending ? 1: -1
    }

    /* Nesse Espaço faremos o subscribe para pegar os dados do banco de dados*/
    const { loading, todoList } = useTracker(() => {
        const subHandle = todoApi.subscribe('todoList', filter, {
            sort
        });
        const todoList = subHandle?.ready() ? todoApi.find(filter, { sort }).fetch() : [];
        return {    
            todoList,
            loading: !!subHandle && !subHandle.ready(),
            total: subHandle ? subHandle.total : todoList.length
        };
    }, [config]);
    
    
    const onAddButtonClick = () => {}
    const onDeleteButtonClick = () =>{}
    const onChangeTextField = () => {}

    const providerValues: ITodoListContollerContext = useMemo(()=>
        ({
            onAddButtonClick,
            onDeleteButtonClick,
            todoList:[],
            schema:{},
            loading,
            onChangeTextField
        }),
        []
)
    return (
        <TodoListControllerContext.Provider value = {providerValues}>
            <TodoListView/>
        </TodoListControllerContext.Provider>
    )
}

export default TodoListController;
