@Library('jeap-pipelinelibrary@feature/oblique6') _
nodejsPipelineTemplate {
	nodeJsVersion = '18.19.0'
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
			'publish': './dist/oblique',
			'gitTag': true,
			'gitPush': [
				'credentialId': 'githubObliqueCredentials',
				'repository': 'https://github.com/oblique-bit/oblique.git',
			]
		],
			'release/major_11.0.0-beta.1': [
            'publish': './dist/oblique'
        ]
	]
}
