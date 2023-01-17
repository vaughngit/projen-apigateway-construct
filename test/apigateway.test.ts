//import { countResources, expect as expectCDK } from '@aws-cdk/assert';
import { App, Stack } from 'aws-cdk-lib';
//import { Match, Template } from 'aws-cdk-lib/assertions';
import { Template } from 'aws-cdk-lib/assertions';
import { VTApi } from '../src';


test('sourceCode function test', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');

  new VTApi(stack, 'VTApiConstruct', {
    restApiName: 'UnitTestApi',
    description: 'Unit Test of API',
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
});

/*
describe('fail test', () => {

  test('no source code test', () => {
    expect(() => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');

      new PowerToolsLambdaConstruct(stack, 'PowerToolsLambdaConstruct', {
        sourceCodedirPath: '',
      });
    }).toThrowError();
  });


});
 */