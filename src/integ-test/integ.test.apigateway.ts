import { App, RemovalPolicy, Stack, Tags, CfnOutput } from 'aws-cdk-lib';
//import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { PowerToolsLambdaConstruct } from 'vt-lambda-construct';
import path from 'path';
//import { RemovalPolicy, Stack, Tags, CfnOutput, Fn } from 'aws-cdk-lib';

import {
  RestApi, LambdaIntegration, Deployment, Stage, MethodLoggingLevel, LogGroupLogDestination,
  AccessLogFormat, AccessLogField, AuthorizationType,
} from 'aws-cdk-lib/aws-apigateway';

import * as iam from 'aws-cdk-lib/aws-iam';

//import { AttributeType, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
//import { DemoStackProps } from '../types';
//import { CognitoSetup } from "@demo/constructs/cognito-construct";
//import { LambdaSetup } from "@demo/constructs/lambda-construct";



const aws_region = 'us-east-2';
const solution = 'testingconstruct';
const environment = 'dev';
const costcenter = 'bex';

export class IntegTesting {

  
  //public readonly cognitoidentityPoolId : CfnOutput;
  public readonly apiEndpoint!: CfnOutput;
  public readonly apiGatewayId!: CfnOutput;
  public readonly apiRootResourceId!: CfnOutput;

  readonly stack: Stack[];
  constructor() {

    const env = {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: aws_region || process.env.CDK_DEFAULT_REGION,
    };


    const app = new App();

    const stack = new Stack(app, 'ApiGatewayIntegrationTestStack', {
      env,
      tags: {
        solution,
        environment,
        costcenter,
      },
    });


    //lambda function integration
    new PowerToolsLambdaConstruct(stack, 'LambdaConstruct-ts-Test', {
      solutionName: 'projenIntegTesting',
      description: 'Integration Test of Lambda construct',
      functionName: 'IntegrationTestlambda',
      sourceCodedirPath: '../lib/lambda-ts',

      timeout: 50,
    });


    this.stack = [stack];

  }
}

new IntegTesting();