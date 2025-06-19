const loggerTest = (req, res) => {
	req.logger.info('🧪═══════════════ TEST LOGGER START ════════════════🧪');
	req.logger.debug('  🟦 Debug log: Very detailed information, useful for development');
	req.logger.http('   🟪 HTTP log: Registration of incoming requests');
	req.logger.info('   🟩 Info log: Successful operation or informative event');
	req.logger.warning('🟨 Warning log: Something unexpected but not fatal');
	req.logger.error('  🟥 Error log: Something failed, but the app is still running');
	req.logger.fatal('  🟥❗ Fatal log: Critical error, should be investigated urgently');
	req.logger.info('🧪════════════════════ END ═════════════════════════🧪');

	res.send({ status: 'success', message: 'All log levels tested' });
};

const boomTest = (req, res) => {
	throw new Error('¡Exploded withouttry/catch!');
};

// const failPromiseTest = async (req, res, next) => {
// 	try {
// 		await Promise.reject(new Error('Promesa fallida'));
// 	} catch (error) {
// 		req.logger.error(`FailPromiseTest error: ${error.message}`, { stack: error.stack });
// 		res.status(500).json({
// 			error: true,
// 			message: 'Promise rejected and caught properly',
// 			payload: null,
// 		});
// 	}
// };

const failPromiseTest = (req, res, next) => {
	Promise.reject(new Error('Promesa fallida')).catch(next);
};

export default {
	boomTest,
	failPromiseTest,
	loggerTest,
};
