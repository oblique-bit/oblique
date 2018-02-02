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

	environment {
		DS_WEB_URL = 'https://intranet.ucd.bit.admin.ch'
		UCD_DEPLOYMENT_NAME = 'deploy'
		UCD_APPLICATION = 'bit-oblique'
		UCD_ENVIRONMENT = 'REF'
		UCD_COMPONENT = 'bit-oblique2-reactive'
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

		stage('Download and unzip udclient') {
			when {
				branch 'master'
			}
			steps {
				script {
					docker.withRegistry('https://repo.bit.admin.ch:8444', 'nexusCredentials') {
						def node = docker.image('bit/openjdk:8-jdk-node')
						node.pull()
						node.inside() {
							// get udclient
							sh 'curl -kLO ${DS_WEB_URL}/tools/udclient.zip'
							// unzip udclient
							sh 'unzip -o udclient.zip'
						}
					}
				}
			}
		}

		stage('Push Showcase to UCD') {
			when {
				branch 'master'
			}

			steps {
				script {
					def matcher = readFile('package.json') =~ '"version": "(.+?)"'
					env.VERSION_RELEASE = matcher[0][1]
				}
				echo "VERSION_RELEASE: ${VERSION_RELEASE}"
				echo "BUILD_NUMBER: ${BUILD_NUMBER}"
				script {
					docker.withRegistry('https://repo.bit.admin.ch:8444', 'nexusCredentials') {
						def node = docker.image('bit/openjdk:8-jdk-node')
						node.pull()
						node.inside('-u root') {
							sh 'npm run showcase-build -- --base-href=/oblique-reactive/${VERSION_RELEASE}/ --prod'
							sh 'npm run showcase-build-cleanup'

							sh 'echo "Pushing to UCD ${DS_WEB_URL} @ $(date)..."'
							withCredentials([string(credentialsId: 'ucdCredentials', variable: 'ucdToken')]) {
								sh './udclient/udclient -weburl ${DS_WEB_URL} -username jenkins -authtoken ${ucdToken} login'
								echo 'Successfully logged!'

								sh './udclient/udclient -weburl ${DS_WEB_URL} createVersion -component ${UCD_COMPONENT} -name ${VERSION_RELEASE}-${BUILD_NUMBER} -type INCREMENTAL'
								sh './udclient/udclient -weburl ${DS_WEB_URL} addVersionFiles -component ${UCD_COMPONENT} -version ${VERSION_RELEASE}-${BUILD_NUMBER} -base ./target'

								sh './udclient/udclient -weburl ${DS_WEB_URL} logout'
							}
							echo "Successfully pushed to UCD!"
						}
					}
				}
			}
		}

		stage('Deploy?') {
			when {
				branch 'master'
			}
			steps {
				timeout(time: 1, unit: 'DAYS') {
					input "Deploy on REF?"
				}
			}
		}

		stage('Deploy REF') {
			when {
				branch 'master'
			}
			steps {
				script {
					docker.withRegistry('https://repo.bit.admin.ch:8444', 'nexusCredentials') {
						def node = docker.image('bit/openjdk:8-jdk-node')
						node.pull()
						node.inside('-u root') {
							sh '''
cat > deploy-ref.json <<END
{
  "application": "${UCD_APPLICATION}",
  "applicationProcess": "deploy",
  "environment": "${UCD_ENVIRONMENT}",
  "onlyChanged": "false",
  "versions": [
    {
      "version": "newest",
      "component": "${UCD_COMPONENT}"
    }
  ]
}
END
                    '''
							sh 'cat deploy-ref.json'
							sh 'echo "start deployment on REF @ $(date)"'
							withCredentials([string(credentialsId: 'ucdCredentials', variable: 'ucdToken')]) {
								sh './udclient/udclient -weburl ${DS_WEB_URL} -username jenkins -authtoken ${ucdToken} login'
								echo 'Successfully logged!'

								sh './udclient/udclient -weburl ${DS_WEB_URL} requestApplicationProcess ./deploy-ref.json'
								sh './udclient/udclient -weburl ${DS_WEB_URL} logout'
							}
							echo "Successfully deployed!"
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
