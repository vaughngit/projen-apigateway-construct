//import path from 'path';
//import { RemovalPolicy, Stack, Tags, CfnOutput, Fn } from 'aws-cdk-lib';
import { App, Stack, Tags, CfnOutput } from 'aws-cdk-lib';
import { LambdaIntegration, PassthroughBehavior, JsonSchemaVersion, JsonSchemaType } from 'aws-cdk-lib/aws-apigateway';
import { PowerToolsLambdaConstruct } from 'vt-lambda-construct';
import { VTApi } from '../';

// import {
//   RestApi, LambdaIntegration, Deployment, Stage, MethodLoggingLevel, LogGroupLogDestination,
//   AccessLogFormat, AccessLogField, AuthorizationType,
// } from 'aws-cdk-lib/aws-apigateway';

// import * as iam from 'aws-cdk-lib/aws-iam';

//import { AttributeType, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
//import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
//import { Construct } from 'constructs';
//import { DemoStackProps } from '../types';
//import { CognitoSetup } from "@demo/constructs/cognito-construct";
//import { LambdaSetup } from "@demo/constructs/lambda-construct";


const aws_region = 'us-east-2';
const solution = 'ApiGatewayConstructIntegrationTest';
const environment = 'dev';
const costcenter = 'tnc';

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
    const hello_world_lambda = new PowerToolsLambdaConstruct(stack, 'HelloWorldLambdaConstruct-Integration-Test', {
    //new PowerToolsLambdaConstruct(stack, 'HelloWorldLambdaConstruct-Integration-Test', {
      solutionName: solution,
      description: 'Integration Test of Lambda construct',
      functionName: 'IntegrationTestlambda',
      sourceCodedirPath: '../lib/lambda-ts',

      timeout: 50,
    });

    // API Gateway ============================================
    const testApi = new VTApi(stack, 'Api', {
      restApiName: 'IntegrationTestApi',
      description: 'API Integration Test',
    });


     // Lambda integration props for API methods
     const lambdaIntegrationProps = {
      proxy: false,
      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: {
            // "application/json": "{\"statusCode\": 200}"
            //"application/json": '$input.headers, $input.body',
            'application/json': '$input.body',

          },
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            //'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            //'method.response.header.Access-Control-Allow-Credentials': "'true'",
            //'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
        {
          selectionPattern: '.*:4\\d{2}.*',
          statusCode: '400',
          responseTemplates: {
            'application/json': `
                            #set ($errorMessageObj = $util.parseJson($input.path('$.errorMessage')))
                            {
                                "errorMessage" : "$errorMessageObj.message",
                                "requestId" : "$errorMessageObj.requestId"
                            }`,
          },
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            //'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            //'method.response.header.Access-Control-Allow-Credentials': "'true'",
            //'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
        {
          selectionPattern: '.*:5\\d{2}.*',
          statusCode: '500',
          responseTemplates: {
            'application/json': `
                            #set ($errorMessageObj = $util.parseJson($input.path('$.errorMessage')))
                            {
                                "errorMessage" : "Internal Error",
                                "requestId" : "$errorMessageObj.requestId"
                            }`,
          },
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            //'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            //'method.response.header.Access-Control-Allow-Credentials': "'true'",
            //'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },

      ],
      passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,

    };



    //tie lambda to new api gateway lambda integration:
    const helloLambdaIntegration = new LambdaIntegration(hello_world_lambda.function, {
      // ...customIntegrationProps,
      ...lambdaIntegrationProps, 
      requestTemplates: {
        'application/json': `{
                    "correlationId": "$input.params('correlationId')",
                    "idpToken": "$input.params('idpToken')",
                    "throwError": $input.json('$.throwError'),
                    "reqcontext": {
                        "requestId" : "$context.requestId",
                        "httpMethod" : "$context.httpMethod"
                    }
                }`,
      },

      requestParameters: {
        'integration.request.querystring.correlationId': 'method.request.querystring.correlationId',
        'integration.request.querystring.idpToken': 'method.request.querystring.idpToken',
      },

    });


    //create new api gateway resource:
    const helloWorldResource = testApi.api.root.addResource('hello');
    // testApi.api.root.addResource('hello');

    // Response model for Method Responses
    const jsonResponseModel = testApi.api.addModel('JsonResponse', {
      contentType: 'application/json',
      schema: {
        schema: JsonSchemaVersion.DRAFT7,
        title: 'JsonResponse',
        type: JsonSchemaType.OBJECT,
        properties: {
          state: { type: JsonSchemaType.STRING },
          greeting: { type: JsonSchemaType.STRING },
        },
      },
    });

    // method responses
    const functionMethodProps = {
      methodResponses: [
        {
          statusCode: '200',
          //            responseModels: {
          //     'application/json': jsonResponseModel,
          // },
          responseParameters: {
            //  'method.response.header.Access-Control-Allow-Headers': true,
            // 'method.response.header.Access-Control-Allow-Methods': true,
            // 'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
        {
          statusCode: '400',
          responseModels: {
            'application/json': jsonResponseModel,
          },
          responseParameters: {
            //  'method.response.header.Access-Control-Allow-Headers': true,
            // 'method.response.header.Access-Control-Allow-Methods': true,
            // 'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
        {
          statusCode: '500',
          responseModels: {
            'application/json': jsonResponseModel,
          },
          responseParameters: {
            //  'method.response.header.Access-Control-Allow-Headers': true,
            // 'method.response.header.Access-Control-Allow-Methods': true,
            // 'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
    };


    //const helloMethod = helloWorldResource.addMethod('GET', helloLambdaIntegration,
    helloWorldResource.addMethod('GET', helloLambdaIntegration,
      {
      // authorizationType: AuthorizationType.IAM,
      // /*                 methodResponses:[{
      //             statusCode: '200',
      //             responseParameters: {
      //               //  'method.response.header.Access-Control-Allow-Headers': true,
      //                // 'method.response.header.Access-Control-Allow-Methods': true,
      //                // 'method.response.header.Access-Control-Allow-Credentials': true,
      //                 'method.response.header.Access-Control-Allow-Origin': true,
      //             },
      //             }] 
      //*/
       ...functionMethodProps,
      requestParameters: {
        'method.request.querystring.correlationId': true,
        'method.request.querystring.idpToken': true,
      },
      },

    );

    this.stack = [stack];


    Tags.of(stack).add('solution', solution);
    Tags.of(stack).add('environment', environment);
    Tags.of(stack).add('costcenter', costcenter);

  }
}

new IntegTesting();