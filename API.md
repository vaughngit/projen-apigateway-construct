# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### VTApi <a name="VTApi" id="projen-apigateway-construct.VTApi"></a>

Creates an API Gateway instance with standard settings.

#### Initializers <a name="Initializers" id="projen-apigateway-construct.VTApi.Initializer"></a>

```typescript
import { VTApi } from 'projen-apigateway-construct'

new VTApi(parent: Stack, name: string, props: IApiProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#projen-apigateway-construct.VTApi.Initializer.parameter.parent">parent</a></code> | <code>aws-cdk-lib.Stack</code> | *No description.* |
| <code><a href="#projen-apigateway-construct.VTApi.Initializer.parameter.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#projen-apigateway-construct.VTApi.Initializer.parameter.props">props</a></code> | <code><a href="#projen-apigateway-construct.IApiProps">IApiProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="projen-apigateway-construct.VTApi.Initializer.parameter.parent"></a>

- *Type:* aws-cdk-lib.Stack

---

##### `name`<sup>Required</sup> <a name="name" id="projen-apigateway-construct.VTApi.Initializer.parameter.name"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="projen-apigateway-construct.VTApi.Initializer.parameter.props"></a>

- *Type:* <a href="#projen-apigateway-construct.IApiProps">IApiProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#projen-apigateway-construct.VTApi.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="projen-apigateway-construct.VTApi.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#projen-apigateway-construct.VTApi.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="projen-apigateway-construct.VTApi.isConstruct"></a>

```typescript
import { VTApi } from 'projen-apigateway-construct'

VTApi.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="projen-apigateway-construct.VTApi.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#projen-apigateway-construct.VTApi.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#projen-apigateway-construct.VTApi.property.api">api</a></code> | <code>aws-cdk-lib.aws_apigateway.RestApi</code> | API construct. |
| <code><a href="#projen-apigateway-construct.VTApi.property.dashboardWidgets">dashboardWidgets</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IWidget[]</code> | Dashboard Widgets. |

---

##### `node`<sup>Required</sup> <a name="node" id="projen-apigateway-construct.VTApi.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `api`<sup>Required</sup> <a name="api" id="projen-apigateway-construct.VTApi.property.api"></a>

```typescript
public readonly api: RestApi;
```

- *Type:* aws-cdk-lib.aws_apigateway.RestApi

API construct.

---

##### `dashboardWidgets`<sup>Required</sup> <a name="dashboardWidgets" id="projen-apigateway-construct.VTApi.property.dashboardWidgets"></a>

```typescript
public readonly dashboardWidgets: IWidget[];
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IWidget[]

Dashboard Widgets.

---



## Classes <a name="Classes" id="Classes"></a>

### Hello <a name="Hello" id="projen-apigateway-construct.Hello"></a>

#### Initializers <a name="Initializers" id="projen-apigateway-construct.Hello.Initializer"></a>

```typescript
import { Hello } from 'projen-apigateway-construct'

new Hello()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#projen-apigateway-construct.Hello.sayHello">sayHello</a></code> | *No description.* |

---

##### `sayHello` <a name="sayHello" id="projen-apigateway-construct.Hello.sayHello"></a>

```typescript
public sayHello(): string
```




## Protocols <a name="Protocols" id="Protocols"></a>

### IApiProps <a name="IApiProps" id="projen-apigateway-construct.IApiProps"></a>

- *Implemented By:* <a href="#projen-apigateway-construct.IApiProps">IApiProps</a>

This interface identified by `I` in its name will be translated to a "regular" interface which needs to be implemented.

> [https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#interfaces](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#interfaces)


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#projen-apigateway-construct.IApiProps.property.description">description</a></code> | <code>string</code> | Api Description. |
| <code><a href="#projen-apigateway-construct.IApiProps.property.restApiName">restApiName</a></code> | <code>string</code> | Api Name. |

---

##### `description`<sup>Required</sup> <a name="description" id="projen-apigateway-construct.IApiProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

Api Description.

---

##### `restApiName`<sup>Required</sup> <a name="restApiName" id="projen-apigateway-construct.IApiProps.property.restApiName"></a>

```typescript
public readonly restApiName: string;
```

- *Type:* string

Api Name.

---

