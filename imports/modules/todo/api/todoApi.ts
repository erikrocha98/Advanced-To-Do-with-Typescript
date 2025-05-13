// region Imports
import { ProductBase } from '../../../api/productBase';
import { todoSch, ITodo } from './todoSch';

class TodoApi extends ProductBase<ITodo> {
	constructor() {
		super('todo', todoSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
	showRecentTasks = (callback: (error:Meteor.Error, result:ITodo[])=>void) => this.callMethod('showRecentTasks', {}, callback);
	showAllTasks = (callback: (error:Meteor.Error, result:ITodo[])=>void) => this.callMethod('showAllTasks', {}, callback);
	updateTask = (taskId: string, newStatus: boolean, callback: (error: Meteor.Error, result: boolean) => void) => {
		this.callMethod('updateTask', taskId, newStatus , callback);
	};
	removeTask = (taskId: string, callback: (error: Meteor.Error) => void) => {
		this.callMethod('removeTask', taskId , callback);
	};
	searchTask = (searchText: string, callback: (error: Meteor.Error) => void) => {
		this.callMethod('searchTask', searchText , callback);
	};
}

export const todoApi = new TodoApi();
