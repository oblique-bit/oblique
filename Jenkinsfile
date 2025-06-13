@Library('jeap-pipelinelibrary@feature/oblique9') _
nodejsPipelineTemplate {
	nodeJsVersion = 22
	npmRepository = [
		'repository': 'registry.npmjs.com',
		'email': 'oblique@bit.admin.ch',
		'userNamePasswordCredentialId': 'obliqueDeploymentUnamePassword',
		'npmCredentialId': 'npmDeploymentTokenOblique'
	]
	branches = [
		'*': [
			'lint': 'npm run lint',
			'test': 'npm run test-ci -ws',
			'build': 'npm run build -ws',
			'sonar': [
				'./projects/design-system',
				'./projects/cli',
				'./projects/oblique',
				'./projects/sandbox',
				'./projects/sandbox-ssr',
				'./projects/sds',
				'./projects/service-navigation-web-component'
			]
		],
		master: [
			'publish': [
				'@oblique/oblique',
				'@oblique/cli',
				'@oblique/service-navigation-web-component'
			],
		]
	]
}
