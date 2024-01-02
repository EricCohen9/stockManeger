pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('clean work space'){
            steps{
                script {
                    sh 'npm cache clean --force'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    echo 'Installing dependencies...'
                    sh 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                script {
                    echo 'Testing frontend....'
                    sh 'npm run test'
                }
            }
        }
    }
}
