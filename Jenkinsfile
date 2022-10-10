@Library('jeap-pipelinelibrary@feature/oblique2') _
nodejsPipelineTemplate {
	testEngine = 'jest'
	versionNumberType = 'none'
	replacePackageJsonVersion = false
	nexusPublishPath = './dist/oblique'
	nodeJsVersion = 14
	singleCFConfig = true
	fetchTags = true
	safeModeWhitelist = ['esbuild']
	masterBranchName = 'release/patch_8.2.4'
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
		'develop': ['space': 'dev', 'configuration': 'production']
	]
}
