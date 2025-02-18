@Library('jeap-pipelinelibrary@feature/oblique9') _
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
		'release/major_*': [
			'cloudFoundry': [
				['project': 'sds', 'space': 'dev'],
				['project': 'sandbox', 'space': 'dev']
			]
		],
		'release/minor_*': [
			'cloudFoundry': [
				['project': 'sds', 'space': 'dev'],
				['project': 'sandbox', 'space': 'dev']
			]
		],
		'release/patch_*': [
			'cloudFoundry': [
				['project': 'sandbox', 'space': 'patch']
			]
		],
		'release/OUI-3612-release-oblique-13.0.0-rc.6': [
			publish: [
				'@oblique/oblique',
				'@oblique/cli',
				'@oblique/service-navigation-web-component'
			],
			gitTag: true
		],
		master: [
			'publish': [
				'@oblique/oblique',
				'@oblique/cli',
				'@oblique/service-navigation-web-component'
			],
			'gitTag': true,
			'gitPush': [
				'credentialId': 'githubObliqueCredentials',
				'repository': 'https://github.com/oblique-bit/oblique.git',
			],
			'cloudFoundry': [
				['project': 'sds', 'space': 'prod']
			],
			securityScan: [
				apps: [[project: 'sds', space: 'prod']]
			]
		]
	]
}
