#!groovy
pipeline {
	//Run everything on a agent with the docker daemon
	agent {
		node {
			label 'docker'
		}
	}

	options {
		buildDiscarder(logRotator(numToKeepStr: '3'))
	}

	stages {

		stage('Lint, test & build dist') {
			steps {
				script {
					docker.withRegistry('https://repo.bit.admin.ch:8444', 'nexusCredentials') {
						def node = docker.image('bit/openjdk:8-jdk-node')
						node.pull()
						node.inside('-u root') {
							sh  '''
									node -v
									npm -v
								'''
							sh 'npm i'
							sh 'npm run ci-build'
						}
					}
				}
			}
		}

	}

	post {
		always {
			script {
				if ((currentBuild.result == null || currentBuild.result == 'SUCCESS')
					&& currentBuild.previousBuild != null && currentBuild.previousBuild.result != 'SUCCESS') {
					emailext(body: "${env.JOB_NAME} [${env.BUILD_NUMBER}] is back to normal",
						subject: "${currentBuild.fullDisplayName} - Back to normal",
						to: emailextrecipients([[$class: 'CulpritsRecipientProvider'],
												[$class: 'RequesterRecipientProvider']]))
				}
			}
			retry(3) {
				sh "docker run --rm -v \$(pwd):/workspace busybox chown -R \"\$(id -u):\$(id -g)\" /workspace"
				deleteDir()
			}
		}
		failure {
			emailext(body: '${DEFAULT_CONTENT}', mimeType: 'text/html',
				attachLog: true,
				subject: '${DEFAULT_SUBJECT}',
				to: emailextrecipients([[$class: 'CulpritsRecipientProvider'],
										[$class: 'RequesterRecipientProvider']]))
		}
	}
}
