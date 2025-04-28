import React from "react";
import { ProductBase } from "/imports/api/productBase";
import { ITodo, todoSchema } from "./todoSchemaApi";

class TodoApi extends ProductBase<ITodo>{
    constructor (){
        super ('todo', todoSchema,{
            enableCallMethodObserver: true,
            enableSubscribeObserver: true
        })
    }
}

export const todoApi = new TodoApi();