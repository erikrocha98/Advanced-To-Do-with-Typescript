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
}

export const todoApi = new TodoApi();
