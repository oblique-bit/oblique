@Library('jeap-pipelinelibrary@feature/oblique3') _
nodejsPipelineTemplate {
	testEngine = 'jest'
	versionNumberType = 'none'
	replacePackageJsonVersion = false
	nexusPublishPath = './dist/oblique'
	nodeJsVersion = 18
	singleCFConfig = true
	fetchTags = true
	safeModeWhitelist = ['esbuild']
	gitPush = [
		'credentialId': 'githubObliqueCredentials',
		'repository': 'https://github.com/oblique-bit/oblique.git',
		'branches': ['master'],
		'tags': ['master']
	]
	npmRepository = [
		'repository': 'registry.npmjs.com',
		'email': 'oblique@bit.admin.ch',
		'userNamePasswordCredentialId': 'obliqueDeploymentUnamePassword',
		'npmCredentialId': 'npmDeploymentTokenOblique'
	]
	deployCloudFoundry = [
        'release/major_*': ['space': 'dev', 'configuration': 'production']
	]
	securityScan = [
		'branchName': ['master']
	]
}
