@Library('jeap-pipelinelibrary@oblique') _
nodejsPipelineTemplate {
	versionNumberType = 'none'
	replacePackageJsonVersion = false
	nexusPublishPath = './dist/oblique'
	deployCloudFoundry = [
		'develop': ['space': 'dev', 'configuration': 'production']
	]
}
