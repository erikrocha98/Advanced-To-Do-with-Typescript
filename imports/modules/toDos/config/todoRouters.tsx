import React from "react";
import { IRoute } from "../../modulesTypings";
import { RecursoTodo } from "./recursos";
import {TodoContainer} from "../todoContainer";

export const todoRouterList: (IRoute| null)[]=[
    {
        path: '/todo',
        component: TodoContainer,
        isProtected: true,
        resources: [RecursoTodo.TODO_VIEW]
    }
]