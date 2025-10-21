pipeline {
    agent any
    tools { nodejs 'Node18' }

    stages {
        stage('Install dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm install'
            }
        }

        stage('Run linters (Prettier + ESLint)') {
            steps {
                echo 'Running Prettier and ESLint checks...'
                sh 'npm run prettier:check'
                sh 'npm run lint'
            }
        }

        stage('Run UI tests') {
            steps {
                echo 'Running all UI tests using @ui tag...'
                sh 'npm run test:ui'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished for UI tests'
        }
    }
}