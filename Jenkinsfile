@Library('jeap-pipelinelibrary@feature/nodejsPipeline-extensions') _
nodejsPipelineTemplate {
	buildContainer = 'bit/karma-protractor:8'
	dockerContainerUser = 'root'
	npmBuildArguments = '--base-href=/oblique/${ARTIFACT_VERSION}/'
	pushVersionWithBuildNumber = true
	pushUrbanCode = ['bit-oblique2-reactive': './target']
	deployUrbanCode = ['master': ['REF']]
}
