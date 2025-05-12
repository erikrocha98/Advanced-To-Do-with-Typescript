// region Imports
import { Recurso } from '../config/recursos';
import { todoSch, ITodo } from './todoSch';
import { userprofileServerApi } from '/imports/modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';

// endregion

class TodoServerApi extends ProductServerBase<ITodo> {
	constructor() {
		super('todo', todoSch, {
			resources: Recurso
			// saveImageToDisk: true,
		});

		const self = this;

		this.addTransformedPublication(
			'todoList',
			(filter = {}) => {
				return this.defaultListCollectionPublication(filter, {
					projection: { title: 1, type: 1, typeMulti: 1, createdat: 1 }
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
					contacts: 1,
					title: 1,
					description: 1,
					type: 1,
					typeMulti: 1,
					date: 1,
					files: 1,
					chip: 1,
					statusRadio: 1,
					statusToggle: 1,
					slider: 1,
					check: 1,
					address: 1,
				}
			});
		});

		/* this.addRestEndpoint(
			'view',
			(params, options) => {
				console.log('Params', params);
				console.log('options.headers', options.headers);
				return { status: 'ok' };
			},
			['post']
		);

		this.addRestEndpoint(
			'view/:todoId',
			(params, _options) => {
				console.log('Rest', params);
				if (params.todoId) {
					return self
						.defaultCollectionPublication(
							{
								_id: params.todoId
							},
							{}
						)
						.fetch();
				} else {
					return { ...params };
				}
			},
			['get']
		);*/
		this.registerMethod('showRecentTasks', this.showRecentTasks.bind(this));
		this.registerMethod('showAllTasks', this.showAllTasks.bind(this));
		this.registerMethod('updateTask', this.updateTask.bind(this))
		this.registerMethod('removeTask', this.removeTask.bind(this));
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

	showAllTasks(): ITodo[] {
		return this.getCollectionInstance().find(
			{},
			{
				sort: { createdat: 1 },
			}
		).fetch();
	}

	async updateTask(taskId: string, status: boolean): Promise<boolean> {
		console.log(`Atualizando tarefa: taskId=${taskId}, novoStatus=${status}`);
		const TaskCollection = await this.getCollectionInstance();
		const tarefa = TaskCollection.findOne(taskId);
		const usuario = Meteor.user();

		if (tarefa.createdby!= usuario?._id){
			throw new Meteor.Error('Acesso negado', 'Você não é o criador desta tarefa');
		}

		const result = await TaskCollection.updateAsync(
			{ _id: taskId },
			{
				$set: {
					statusTask: status
				}
			}
		)
		console.log('Atualizando tarefa:', {
			taskId,
			status,
			typeOfNewStatus: typeof status
		});
		return result > 0;
	}

	async removeTask (taskId: string) {
		const TaskCollection = await this.getCollectionInstance();
		const tarefa = TaskCollection.findOne(taskId);
		const usuario = Meteor.user();

		if (tarefa.createdby!= usuario?._id){
			throw new Meteor.Error('Acesso negado', 'Você não é o criador desta tarefa');
		}

		return TaskCollection.removeAsync(taskId);
	}
}

export const todoServerApi = new TodoServerApi();
