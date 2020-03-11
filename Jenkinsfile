@Library('jeap-pipelinelibrary@oblique') _
nodejsPipelineTemplate {
	testEngine = 'jest'
	versionNumberType = 'none'
	replacePackageJsonVersion = false
	nexusPublishPath = './dist/oblique'
	npmRegistry = 'true'
	deployCloudFoundry = [
		'develop': ['space': 'dev', 'configuration': 'production']
	]
}
