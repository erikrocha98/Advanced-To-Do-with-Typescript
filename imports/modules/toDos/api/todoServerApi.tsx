import React from 'react';
import { todoSchema, ITodo } from './todoSchemaApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { RecursoTodo } from '../config/recursos';
import { userprofileServerApi } from '../../userprofile/api/userProfileServerApi';

class TodoServerApi extends ProductServerBase<ITodo> {
    constructor() {
        super('todo', todoSchema, {
            resources: RecursoTodo
        });
        const self = this;

        this.addTransformedPublication(
            'todoList',
            (filter = {}) => {
                return this.defaultListCollectionPublication(filter, {
                    projection: { description: 1, createdat: 1 }
                });
            },
            async (doc: ITodo & { nomeUsuario: string }) => {
                const userProfileDoc = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: doc.createdby });
                return { ...doc };
            }

        );
        this.addPublication('todoDetail', (filter = {}) => {
            return this.defaultDetailCollectionPublication(filter, {
                projection: {
                    description: 1,
                    createdat: 1,
                    status: 1
                }
            });
        });
        this.registerMethod('showRecentTasks', this.showRecentTasks.bind(this));
    }
    showRecentTasks(): ITodo[] {
        return this.getCollectionInstance().find(
            {},
            {
                sort: { createdat: -1 },
                limit: 5
            }
        ).fetch();
    }
}

export const todoServerApi = new TodoServerApi();