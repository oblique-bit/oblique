@Library('jeap-pipelinelibrary@feature/oblique4') _
nodejsPipelineTemplate {
	nexusPublishPath = './dist/oblique'
	nodeJsVersion = 18
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
