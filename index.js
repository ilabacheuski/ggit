var getOneLineLog = require('./src/get-one-line-log');

module.exports = {
	getOneLineLog: getOneLineLog,
	cloneRepo: require('./src/clone-repo'),
	exec: require('./src/exec'),
	blame: require('./src/blame'),
	isTracked: require('./src/is-file-tracked'),
	hasChanges: require('./src/has-changes'),
	commit: require('./src/commit'),
	push: require('./src/push')
};

if (!module.parent) {
	getOneLineLog({
		n: 4,
		remote: 'origin',
		branch: 'master'
	})
	.done(function (stdout) {
		console.log(stdout);
	}, function (err) {
		console.error(err);
	});
}
