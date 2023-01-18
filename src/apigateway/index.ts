import { Stack, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';

/* import {
  RestApi, EndpointType, JsonSchemaType, JsonSchemaVersion, PassthroughBehavior,
  MethodLoggingLevel, LogGroupLogDestination, AccessLogFormat, AccessLogField,
  MethodOptions, LambdaIntegrationOptions,
} from 'aws-cdk-lib/aws-apigateway';
 */
import {
  RestApi, EndpointType, MethodLoggingLevel, LogGroupLogDestination, AccessLogFormat, AccessLogField,
} from 'aws-cdk-lib/aws-apigateway';

import {
  Color, GaugeWidget, IWidget, TextWidget,
} from 'aws-cdk-lib/aws-cloudwatch';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';


/**
 * This interface identified by `I` in its name
 * will be translated to a "regular" interface which needs to be implemented.
 *
 * @see https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#interfaces
 */

export interface IApiProps {
  /** Api Name */
  restApiName: string;
  /** Api Description */
  description: string;
};

/**
 * Creates an API Gateway instance with standard settings.
 */
export class VTApi extends Construct {
  /** API construct */
  api: RestApi;

  /** Lambda Default Integration Props */
  //integrationProps: LambdaIntegrationOptions;
  //customIntegrationProps: LambdaIntegrationOptions;

  /** Default Method Option Props */
  // methodProps: MethodOptions;
  //customMethodProps: MethodOptions;


  /** Dashboard Widgets */
  dashboardWidgets: IWidget[];

  /**
     * @param {Construct} parent
     * @param {string} name
     * @param {CustomApiProps} props
     */
  constructor(parent: Stack, name: string, props: IApiProps) {
    super(parent, name);

    const {
      restApiName,
      description,
      //  defaultCorsPreflightOptions,
    } = props;

    // API Gateway ============================================
    const api = new RestApi(this, 'MonitoredApi', {
      restApiName,
      description,
      // deploy: false,
      deployOptions: {
        stageName: 'Prodv1',
        description: 'Prod V1 Deployment',
        /**
         * Enable tracing and logging in JSON format for the API.
         */
        tracingEnabled: true,
        accessLogDestination: new LogGroupLogDestination(new LogGroup(this, 'AccessLog-Prod', {
          retention: RetentionDays.ONE_MONTH,
          removalPolicy: RemovalPolicy.DESTROY,
        })),
        accessLogFormat: AccessLogFormat.custom(JSON.stringify({
          requestTime: AccessLogField.contextRequestTime(),
          requestTimeEpoch: AccessLogField.contextRequestTimeEpoch(),
          requestId: AccessLogField.contextRequestId(),
          extendedRequestId: AccessLogField.contextExtendedRequestId(),
          sourceIp: AccessLogField.contextIdentitySourceIp(),
          method: AccessLogField.contextHttpMethod(),
          resourcePath: AccessLogField.contextResourcePath(),
          traceId: AccessLogField.contextXrayTraceId(),
        })),

        /**
         * Execution logs.
         * Only required for debugging.
         * Creates an additional log group that we cannot control.
         */
        loggingLevel: MethodLoggingLevel.OFF,

        /**
         * Enable Details Metrics. Additional costs incurred
         * Creates metrics at the method level.
         */
        metricsEnabled: false,

      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'x-amz-security-token',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },

      endpointTypes: [EndpointType.REGIONAL],
    });

    this.api = api;

    new CfnOutput(this, 'apiUrl', {  description: 'API URL',  value: api.url, });

    /*
    // Lambda integration props for API methods
    this.integrationProps = {
      proxy: false,
      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: {
            'application/json': '$input.body',
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
        },
      ],
      passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,
    };


    // Lambda integration props for API methods
    this.customIntegrationProps = {
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

 */

    /*
    // Response model for Method Responses
    const jsonResponseModel = api.addModel('JsonResponse', {
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


    // Default method responses
    this.methodProps = {
      methodResponses: [
        {
          statusCode: '200',
          responseModels: {
            'application/json': jsonResponseModel,
          },
        },
        {
          statusCode: '400',
          responseModels: {
            'application/json': jsonResponseModel,
          },
        },
        {
          statusCode: '500',
          responseModels: {
            'application/json': jsonResponseModel,
          },
        },
      ],
    };

    // method responses
    this.customMethodProps = {
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

 */
    // CloudWatch Metrics ====================================
    const integrationLatencyMetricAvg = api.metricIntegrationLatency({
      label: `${restApiName} Integration Latency Avg`,
      statistic: 'avg',
      dimensionsMap: {
        ApiName: restApiName,
      },
      color: Color.PURPLE,
    });
    const integrationLatencyMetricMax = api.metricIntegrationLatency({
      label: `${restApiName} Integration Latency Max`,
      statistic: 'max',
      dimensionsMap: {
        ApiName: restApiName,
      },
      color: Color.RED,
    });
    const integrationLatencyMetricMin = api.metricIntegrationLatency({
      label: `${restApiName} Integration Latency Min`,
      statistic: 'min',
      dimensionsMap: {
        ApiName: restApiName,
      },
      color: Color.GREEN,
    });

    // Dashboard Widgets
    const headerWidget = new TextWidget({
      markdown: `## ${restApiName} Metrics`,
      width: 24,
      height: 1,
    });
    const integrationLatencyAvgGauge = new GaugeWidget({
      title: `${restApiName} Average Integration Latency`,
      metrics: [integrationLatencyMetricAvg],
      leftYAxis: {
        min: 0,
        max: 29000,
      },
      height: 6,
    });
    const integrationLatencyMaxGauge = new GaugeWidget({
      title: `${restApiName} Max Integration Latency`,
      metrics: [integrationLatencyMetricMax],
      leftYAxis: {
        min: 0,
        max: 29000,
      },
      height: 6,
    });
    const integrationLatencyMinGauge = new GaugeWidget({
      title: `${restApiName} Min Integration Latency`,
      metrics: [integrationLatencyMetricMin],
      leftYAxis: {
        min: 0,
        max: 29000,
      },
      height: 6,
    });

    // Export all widgets for dashboard
    this.dashboardWidgets = [
      headerWidget,
      integrationLatencyAvgGauge,
      integrationLatencyMinGauge,
      integrationLatencyMaxGauge,
    ];
  }
}