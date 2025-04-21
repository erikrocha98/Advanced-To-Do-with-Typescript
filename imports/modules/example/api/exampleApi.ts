// region Imports
import { ProductBase } from '../../../api/productBase';
import { exampleSch, IExample } from './exampleSch';

class ExampleApi extends ProductBase<IExample> {
	constructor() {
		super('example', exampleSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}

	showRecentTasks = (callback: (error:Meteor.Error, result:IExample[])=>void) => this.callMethod('showRecentTasks', {}, callback);
}

export const exampleApi = new ExampleApi();
