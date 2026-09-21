@Library('jeap-pipelinelibrary@feature/oblique9') _
nodejsPipelineTemplate {
	nodeJsVersion = 24
	npmRepository = [
		'repository': 'registry.npmjs.com',
		'email': 'oblique@bit.admin.ch',
		'userNamePasswordCredentialId': 'obliqueDeploymentUnamePassword',
		'npmCredentialId': 'npmDeploymentTokenOblique'
	]
	branches = [
		'*': [
			'lint': 'npm run lint',
			'test': 'npm run test-ci --workspaces',
			'build': 'npm run build --workspaces'
		],
		'release/major_16.0.0': [
			'gitPush': [
				'credentialId': 'githubObliqueCredentials',
				'repository': 'https://github.com/oblique-bit/oblique.git',
			]
		],
		master: [
			'gitPush': [
				'credentialId': 'githubObliqueCredentials',
				'repository': 'https://github.com/oblique-bit/oblique.git',
			]
		]
	]
}
