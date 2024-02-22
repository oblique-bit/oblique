@Library('jeap-pipelinelibrary@feature/oblique7') _
nodejsPipelineTemplate {
	nodeJsVersion = 20
	npmRepository = [
		'repository': 'registry.npmjs.com',
		'email': 'oblique@bit.admin.ch',
		'userNamePasswordCredentialId': 'obliqueDeploymentUnamePassword',
		'npmCredentialId': 'npmDeploymentTokenOblique'
	]
	branches = [
		'*': [
			'lint': 'npm run lint',
			'test': 'npm test -ws',
			'build': 'npm run build -ws',
		],
		'release/major_*': [
			'cloudFoundry': [
				['project': 'sds', 'space': 'dev'],
				['project': 'sandbox', 'space': 'dev']
			]
		],
		master: [
			'publish': [
				'./dist/oblique',
				'./dist/service-navigation-web-component'
			],
			'gitTag': true,
			'gitPush': [
				'credentialId': 'githubObliqueCredentials',
				'repository': 'https://github.com/oblique-bit/oblique.git',
			],
			'cloudFoundry': [
				['project': 'sds', 'space': 'prod']
			]
		]
	]
}
