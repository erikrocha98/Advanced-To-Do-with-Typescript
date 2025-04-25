import React, { useCallback, useMemo } from 'react';
import TodoListView from './todoListView';
import { nanoid } from 'nanoid';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';

interface IInitialConfig{
    sortProperties: { field: string; sortAscending: boolean };
    filter: Object;
    searchBy: string | null;
}
interface ITodoListContollerContext {
    onAddButtonClick: () => void;
    onDeleteButtonClick: (row: any) => void;
    todoList: any[];
    schema: any;
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

    /* Nesse Espaço desestruturaremos campos do esquema implementado no lado do servidor
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
    */
    const {sortProperties, filter} = config;
    const sort ={
        [sortProperties.field]: sortProperties.sortAscending ? 1: -1
    }
    /* Nesse Espaço faremos o subscribe para pegar os dados do banco de dados
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
        -------------------------------------------------------------------------------
    */
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
