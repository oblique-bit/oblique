@Library('jeap-pipelinelibrary@feature/oblique3') _
nodejsPipelineTemplate {
	testEngine = 'jest'
	versionNumberType = 'none'
	replacePackageJsonVersion = false
	nexusPublishPath = './dist/oblique'
	nodeJsVersion = 14
	singleCFConfig = true
	fetchTags = true
	safeModeWhitelist = ['esbuild']
	gitPush = [
		'credentialId': 'githubObliqueCredentials',
		'repository': 'https://github.com/oblique-bit/oblique.git',
		'branches': ['master', 'develop'],
		'tags': ['master']
	]
	npmRepository = [
		'repository': 'registry.npmjs.com',
		'email': 'oblique@bit.admin.ch',
		'userNamePasswordCredentialId': 'obliqueDeploymentUnamePassword',
		'npmCredentialId': 'npmDeploymentTokenOblique'
	]
	deployCloudFoundry = [
		'OUI-1730-release-oblique-9.0.0': ['space': 'dev', 'configuration': 'production']
	]
}
