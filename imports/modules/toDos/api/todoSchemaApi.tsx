import React from "react";
import { IDoc } from "/imports/typings/IDoc";
import { ISchema } from "/imports/typings/ISchema";

export interface ITodo extends IDoc{
    description: string;
    status: string;
    date:Date;
    statusToggle: boolean;
}

export const todoSchema: ISchema<ITodo> ={
    description : {
        type: String,
        label: 'Descrição',
        defaultValue: '',
        optional: true
    },
    status : {
        type: String,
        label: 'Status',
        defaultValue: '',
        optional: true
    },
    date :{
        type: Date,
        label: 'Data',
        defaultValue: new Date(),
        optional: true
    },
    statusToggle : {
        type: Boolean,
        label: 'Status Toggle',
        defaultValue: false,
        optional: true
    }

}