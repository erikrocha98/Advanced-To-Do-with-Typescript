// region Imports
import { Recurso } from '../config/recursos';
import { todoSch, ITodo } from './todoSch';
import { getUserServer, userprofileServerApi } from '/imports/modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { IContext } from '/imports/typings/IContext';

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
					projection: { title: 1, type: 1, typeMulti: 1, createdat: 1, createdby: 1 }
				});
			},
			async (doc: ITodo) => {
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
					isPersonal: 1,

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
		this.registerMethod('updateTask', this.updateTask.bind(this));
		this.registerMethod('removeTask', this.removeTask.bind(this));
		this.registerMethod('searchTask', this.searchTask.bind(this));
		this.registerMethod('getUsernameById', this.getUsernameById.bind(this));
	}


	async showRecentTasks(): Promise<ITodo[]> {
		const userId = await getUserServer();

		const visibilityFilter = {
			$or: [
				{ isPersonal: { $ne: true } }, // Tarefas não pessoais (públicas)
				{ createdby: userId._id }          // Tarefas criadas pelo usuário atual
			]
		};

		return this.getCollectionInstance().find(
			visibilityFilter,
			{
				sort: { createdat: -1 },
				limit: 5
			}
		).fetch();
	}

	async showAllTasks(): Promise<ITodo[]> {
		const userId = await getUserServer();

		const visibilityFilter = {
			$or: [
				{ isPersonal: { $ne: true } }, // Tarefas não pessoais (públicas)
				{ createdby: userId._id }          // Tarefas criadas pelo usuário atual
			]
		};
		console.log('userId:', userId);
		console.log('Filtro de visibilidade:', JSON.stringify(visibilityFilter, null, 2));

		return this.getCollectionInstance().find(
			visibilityFilter,
			{
				sort: { createdat: 1 },
			}
		).fetch();
	}

	async updateTask(taskId: string, status: boolean): Promise<boolean> {
		console.log(`Atualizando tarefa: taskId=${taskId}, novoStatus=${status}`);
		const TaskCollection = await this.getCollectionInstance();
		const tarefa = await TaskCollection.findOneAsync(taskId);
		const usuario = await getUserServer();

		if (tarefa.createdby != usuario?._id) {
			throw new Meteor.Error('Acesso negado', 'Você não é o criador desta tarefa');
		}
		else {
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



	}

	async removeTask(taskId: string) {
		const TaskCollection = await this.getCollectionInstance();
		const tarefa = await TaskCollection.findOneAsync({ _id: taskId });
		const usuario = await getUserServer();

		console.log('ID da tarefa:', taskId);
		console.log('Tarefa encontrada:', tarefa);
		console.log('ID do usuário atual:', usuario?._id);
		console.log('usuário criador da tarefa:', tarefa?.createdby);
		if (tarefa.createdby != usuario?._id) {
			throw new Meteor.Error('Acesso negado', 'Você não é o criador desta tarefa');
		}
		else {
			console.log('Tarefa excluída com sucesso');
			return TaskCollection.removeAsync(taskId);
		}

	}

	async searchTask(searchText: string) {
		const TaskCollection = await this.getCollectionInstance();
		const userId = await getUserServer();

		// Configure o filtro de visibilidade para busca
		const visibilityFilter = {
			$or: [
				{ isPersonal: { $ne: true } }, // Tarefas não pessoais (públicas)
				{ createdby: userId._id }          // Tarefas criadas pelo usuário atual
			]
		};

		// Combine o filtro de pesquisa com o filtro de visibilidade
		const searchFilter = {
			description: { $regex: searchText, $options: 'i' }
		};

		const finalFilter = { ...searchFilter, ...visibilityFilter };

		return TaskCollection.find(finalFilter).fetch();
	}

	async getUsernameById(userId: string): Promise<string> {
		// Primeiro tenta buscar no userprofile
		const userProfile = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: userId });
		if (userProfile?.username) return userProfile.username;

		// Se não achar, tenta no Meteor.users
		const user = await Meteor.users.findOneAsync({ _id: userId });
		return user?.username ?? "";
	};

}



export const todoServerApi = new TodoServerApi();
