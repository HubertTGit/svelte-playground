// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as functions from 'firebase-functions';

let ssrServerServer: (
	arg0: functions.https.Request,
	arg1: functions.Response<any>
) => void | PromiseLike<void>;

exports.ssrServer = functions.region('us-central1').https.onRequest(async (request, response) => {
	if (!ssrServerServer) {
		functions.logger.info('Initialising SvelteKit SSR entry');
		ssrServerServer = require('./ssrServer/index').default;
		functions.logger.info('SvelteKit SSR entry initialised!');
	}
	functions.logger.info('Requested resource: ' + request.originalUrl);
	return ssrServerServer(request, response);
});
