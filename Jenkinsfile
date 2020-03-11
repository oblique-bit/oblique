@Library('jeap-pipelinelibrary@oblique') _
nodejsPipelineTemplate {
	testEngine = 'jest'
	versionNumberType = 'none'
	replacePackageJsonVersion = false
	nexusPublishPath = './dist/oblique'
	npmRegistry = 'https://registry.npmjs.org/'
	deployCloudFoundry = [
		'develop': ['space': 'dev', 'configuration': 'production']
	]
}
