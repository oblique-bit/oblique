@Library('jeap-pipelinelibrary@oblique') _
nodejsPipelineTemplate {
	testEngine = 'jest'
	versionNumberType = 'none'
	replacePackageJsonVersion = false
	nexusPublishPath = './dist/oblique'
	npmRegistry = 'true'
	nodeJsVersion = 14
	deployCloudFoundry = [
		'develop': ['space': 'dev', 'configuration': 'production']
	]
}
