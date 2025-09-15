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
			'build': 'npm run build -ws'
		],
		'release/OUI-4032-release-oblique-14.0.0-rc.2': [
			publish: [
				'@oblique/oblique',
				'@oblique/cli',
				'@oblique/service-navigation-web-component',
				'@oblique/toolchain'
			],
			gitTag: true
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
