---
id: "react.graphvizcomponent"
title: "GraphVizComponent"
sidebar_label: "GraphVizComponent"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [react](../modules/react.md) › [GraphVizComponent](react.graphvizcomponent.md)

## Type parameters

▪ **SS**

## Hierarchy

* Component‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md), [State](../interfaces/react.state.md)›

  ↳ **GraphVizComponent**

## Index

### Constructors

* [constructor](react.graphvizcomponent.md#constructor)

### Properties

* [canvasRef](react.graphvizcomponent.md#canvasref)
* [context](react.graphvizcomponent.md#context)
* [onWindowResize](react.graphvizcomponent.md#onwindowresize)
* [props](react.graphvizcomponent.md#readonly-props)
* [refs](react.graphvizcomponent.md#refs)
* [rootRef](react.graphvizcomponent.md#rootref)
* [simulation](react.graphvizcomponent.md#simulation)
* [tooltipNodes](react.graphvizcomponent.md#tooltipnodes)
* [visualization](react.graphvizcomponent.md#visualization)
* [contextType](react.graphvizcomponent.md#static-optional-contexttype)

### Methods

* [UNSAFE_componentWillMount](react.graphvizcomponent.md#optional-unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](react.graphvizcomponent.md#optional-unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](react.graphvizcomponent.md#optional-unsafe_componentwillupdate)
* [componentDidCatch](react.graphvizcomponent.md#optional-componentdidcatch)
* [componentDidMount](react.graphvizcomponent.md#componentdidmount)
* [componentDidUpdate](react.graphvizcomponent.md#componentdidupdate)
* [componentWillMount](react.graphvizcomponent.md#optional-componentwillmount)
* [componentWillReceiveProps](react.graphvizcomponent.md#optional-componentwillreceiveprops)
* [componentWillUnmount](react.graphvizcomponent.md#componentwillunmount)
* [componentWillUpdate](react.graphvizcomponent.md#optional-componentwillupdate)
* [forceUpdate](react.graphvizcomponent.md#forceupdate)
* [getSnapshotBeforeUpdate](react.graphvizcomponent.md#optional-getsnapshotbeforeupdate)
* [initData](react.graphvizcomponent.md#initdata)
* [render](react.graphvizcomponent.md#render)
* [setState](react.graphvizcomponent.md#setstate)
* [shouldComponentUpdate](react.graphvizcomponent.md#optional-shouldcomponentupdate)
* [zoomIn](react.graphvizcomponent.md#zoomin)
* [zoomOut](react.graphvizcomponent.md#zoomout)

### Object literals

* [state](react.graphvizcomponent.md#readonly-state)
* [vizData](react.graphvizcomponent.md#vizdata)
* [defaultProps](react.graphvizcomponent.md#static-defaultprops)

## Constructors

###  constructor

\+ **new GraphVizComponent**(`props`: Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)›): *[GraphVizComponent](react.graphvizcomponent.md)*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[constructor](react.graphvizcomponent.md#constructor)*

Defined in node_modules/@types/react/index.d.ts:486

**`deprecated`** 

**`see`** https://reactjs.org/docs/legacy-context.html

**Parameters:**

Name | Type |
------ | ------ |
`props` | Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)› |

**Returns:** *[GraphVizComponent](react.graphvizcomponent.md)*

\+ **new GraphVizComponent**(`props`: [GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md), `context?`: any): *[GraphVizComponent](react.graphvizcomponent.md)*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[constructor](react.graphvizcomponent.md#constructor)*

Defined in node_modules/@types/react/index.d.ts:488

**`deprecated`** 

**`see`** https://reactjs.org/docs/legacy-context.html

**Parameters:**

Name | Type |
------ | ------ |
`props` | [GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md) |
`context?` | any |

**Returns:** *[GraphVizComponent](react.graphvizcomponent.md)*

## Properties

###  canvasRef

• **canvasRef**: *RefObject‹HTMLCanvasElement›* = React.createRef()

*Defined in [packages/react/src/GraphVizComponent.tsx:104](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L104)*

___

###  context

• **context**: *any*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[context](react.graphvizcomponent.md#context)*

Defined in node_modules/@types/react/index.d.ts:486

If using the new style context, re-declare this in your class to be the
`React.ContextType` of your `static contextType`.
Should be used with type annotation or static contextType.

```ts
static contextType = MyContext
// For TS pre-3.7:
context!: React.ContextType<typeof MyContext>
// For TS 3.7 and above:
declare React.ContextType<typeof MyContext>
```

**`see`** https://reactjs.org/docs/context.html

___

###  onWindowResize

• **onWindowResize**: *function* = debounce(() => {
    const root = this.rootRef.current!
    const {width, height} = root.getBoundingClientRect()

    this.visualization.resize(width, height)
  }, 500)

*Defined in [packages/react/src/GraphVizComponent.tsx:119](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L119)*

#### Type declaration:

▸ (): *void*

___

### `Readonly` props

• **props**: *Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)› & Readonly‹object›*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[props](react.graphvizcomponent.md#readonly-props)*

Defined in node_modules/@types/react/index.d.ts:511

___

###  refs

• **refs**: *object*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[refs](react.graphvizcomponent.md#refs)*

Defined in node_modules/@types/react/index.d.ts:517

**`deprecated`** 
https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs

#### Type declaration:

* \[ **key**: *string*\]: ReactInstance

___

###  rootRef

• **rootRef**: *RefObject‹HTMLDivElement›* = React.createRef()

*Defined in [packages/react/src/GraphVizComponent.tsx:103](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L103)*

___

###  simulation

• **simulation**: *ForceSimulation*

*Defined in [packages/react/src/GraphVizComponent.tsx:101](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L101)*

___

###  tooltipNodes

• **tooltipNodes**: *[TooltipNode](../interfaces/react.tooltipnode.md)[]*

*Defined in [packages/react/src/GraphVizComponent.tsx:100](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L100)*

___

###  visualization

• **visualization**: *GraphVisualization*

*Defined in [packages/react/src/GraphVizComponent.tsx:90](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L90)*

___

### `Static` `Optional` contextType

▪ **contextType**? : *Context‹any›*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[contextType](react.graphvizcomponent.md#static-optional-contexttype)*

Defined in node_modules/@types/react/index.d.ts:468

If set, `this.context` will be set at runtime to the current value of the given Context.

Usage:

```ts
type MyContext = number
const Ctx = React.createContext<MyContext>(0)

class Foo extends React.Component {
  static contextType = Ctx
  context!: React.ContextType<typeof Ctx>
  render () {
    return <>My context's value: {this.context}</>;
  }
}
```

**`see`** https://reactjs.org/docs/context.html#classcontexttype

## Methods

### `Optional` UNSAFE_componentWillMount

▸ **UNSAFE_componentWillMount**(): *void*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[UNSAFE_componentWillMount](react.graphvizcomponent.md#optional-unsafe_componentwillmount)*

Defined in node_modules/@types/react/index.d.ts:712

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Returns:** *void*

___

### `Optional` UNSAFE_componentWillReceiveProps

▸ **UNSAFE_componentWillReceiveProps**(`nextProps`: Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)›, `nextContext`: any): *void*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[UNSAFE_componentWillReceiveProps](react.graphvizcomponent.md#optional-unsafe_componentwillreceiveprops)*

Defined in node_modules/@types/react/index.d.ts:744

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Parameters:**

Name | Type |
------ | ------ |
`nextProps` | Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)› |
`nextContext` | any |

**Returns:** *void*

___

### `Optional` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(`nextProps`: Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)›, `nextState`: Readonly‹[State](../interfaces/react.state.md)›, `nextContext`: any): *void*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[UNSAFE_componentWillUpdate](react.graphvizcomponent.md#optional-unsafe_componentwillupdate)*

Defined in node_modules/@types/react/index.d.ts:772

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Parameters:**

Name | Type |
------ | ------ |
`nextProps` | Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)› |
`nextState` | Readonly‹[State](../interfaces/react.state.md)› |
`nextContext` | any |

**Returns:** *void*

___

### `Optional` componentDidCatch

▸ **componentDidCatch**(`error`: Error, `errorInfo`: ErrorInfo): *void*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[componentDidCatch](react.graphvizcomponent.md#optional-componentdidcatch)*

Defined in node_modules/@types/react/index.d.ts:641

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |
`errorInfo` | ErrorInfo |

**Returns:** *void*

___

###  componentDidMount

▸ **componentDidMount**(): *void*

*Overrides void*

*Defined in [packages/react/src/GraphVizComponent.tsx:126](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L126)*

**Returns:** *void*

___

###  componentDidUpdate

▸ **componentDidUpdate**(`prevProps`: [GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)): *void*

*Overrides void*

*Defined in [packages/react/src/GraphVizComponent.tsx:307](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L307)*

**Parameters:**

Name | Type |
------ | ------ |
`prevProps` | [GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md) |

**Returns:** *void*

___

### `Optional` componentWillMount

▸ **componentWillMount**(): *void*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[componentWillMount](react.graphvizcomponent.md#optional-componentwillmount)*

Defined in node_modules/@types/react/index.d.ts:698

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Returns:** *void*

___

### `Optional` componentWillReceiveProps

▸ **componentWillReceiveProps**(`nextProps`: Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)›, `nextContext`: any): *void*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[componentWillReceiveProps](react.graphvizcomponent.md#optional-componentwillreceiveprops)*

Defined in node_modules/@types/react/index.d.ts:727

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Parameters:**

Name | Type |
------ | ------ |
`nextProps` | Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)› |
`nextContext` | any |

**Returns:** *void*

___

###  componentWillUnmount

▸ **componentWillUnmount**(): *void*

*Overrides void*

*Defined in [packages/react/src/GraphVizComponent.tsx:329](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L329)*

**Returns:** *void*

___

### `Optional` componentWillUpdate

▸ **componentWillUpdate**(`nextProps`: Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)›, `nextState`: Readonly‹[State](../interfaces/react.state.md)›, `nextContext`: any): *void*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[componentWillUpdate](react.graphvizcomponent.md#optional-componentwillupdate)*

Defined in node_modules/@types/react/index.d.ts:757

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Parameters:**

Name | Type |
------ | ------ |
`nextProps` | Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)› |
`nextState` | Readonly‹[State](../interfaces/react.state.md)› |
`nextContext` | any |

**Returns:** *void*

___

###  forceUpdate

▸ **forceUpdate**(`callback?`: undefined | function): *void*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[forceUpdate](react.graphvizcomponent.md#forceupdate)*

Defined in node_modules/@types/react/index.d.ts:503

**Parameters:**

Name | Type |
------ | ------ |
`callback?` | undefined &#124; function |

**Returns:** *void*

___

### `Optional` getSnapshotBeforeUpdate

▸ **getSnapshotBeforeUpdate**(`prevProps`: Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)›, `prevState`: Readonly‹[State](../interfaces/react.state.md)›): *SS | null*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[getSnapshotBeforeUpdate](react.graphvizcomponent.md#optional-getsnapshotbeforeupdate)*

Defined in node_modules/@types/react/index.d.ts:677

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

**Parameters:**

Name | Type |
------ | ------ |
`prevProps` | Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)› |
`prevState` | Readonly‹[State](../interfaces/react.state.md)› |

**Returns:** *SS | null*

___

###  initData

▸ **initData**(): *void*

*Defined in [packages/react/src/GraphVizComponent.tsx:335](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L335)*

**Returns:** *void*

___

###  render

▸ **render**(): *Element‹›*

*Overrides void*

*Defined in [packages/react/src/GraphVizComponent.tsx:369](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L369)*

**Returns:** *Element‹›*

___

###  setState

▸ **setState**<**K**>(`state`: function | null | S | object, `callback?`: undefined | function): *void*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[setState](react.graphvizcomponent.md#setstate)*

Defined in node_modules/@types/react/index.d.ts:498

**Type parameters:**

▪ **K**: *keyof State*

**Parameters:**

Name | Type |
------ | ------ |
`state` | function &#124; null &#124; S &#124; object |
`callback?` | undefined &#124; function |

**Returns:** *void*

___

### `Optional` shouldComponentUpdate

▸ **shouldComponentUpdate**(`nextProps`: Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)›, `nextState`: Readonly‹[State](../interfaces/react.state.md)›, `nextContext`: any): *boolean*

*Inherited from [GraphVizComponent](react.graphvizcomponent.md).[shouldComponentUpdate](react.graphvizcomponent.md#optional-shouldcomponentupdate)*

Defined in node_modules/@types/react/index.d.ts:631

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate`
and `componentDidUpdate` will not be called.

**Parameters:**

Name | Type |
------ | ------ |
`nextProps` | Readonly‹[GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)› |
`nextState` | Readonly‹[State](../interfaces/react.state.md)› |
`nextContext` | any |

**Returns:** *boolean*

___

###  zoomIn

▸ **zoomIn**(): *void*

*Defined in [packages/react/src/GraphVizComponent.tsx:361](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L361)*

**Returns:** *void*

___

###  zoomOut

▸ **zoomOut**(): *void*

*Defined in [packages/react/src/GraphVizComponent.tsx:365](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L365)*

**Returns:** *void*

## Object literals

### `Readonly` state

### ▪ **state**: *object*

*Overrides void*

*Defined in [packages/react/src/GraphVizComponent.tsx:106](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L106)*

###  currentTooltipNode

• **currentTooltipNode**: *null* = null

*Defined in [packages/react/src/GraphVizComponent.tsx:107](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L107)*

###  currentlyHoveredIdx

• **currentlyHoveredIdx**: *null* = null

*Defined in [packages/react/src/GraphVizComponent.tsx:108](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L108)*

___

###  vizData

### ▪ **vizData**: *object*

*Defined in [packages/react/src/GraphVizComponent.tsx:94](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L94)*

###  groups

• **groups**: *never[]* = []

*Defined in [packages/react/src/GraphVizComponent.tsx:97](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L97)*

###  links

• **links**: *never[]* = []

*Defined in [packages/react/src/GraphVizComponent.tsx:96](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L96)*

###  nodes

• **nodes**: *never[]* = []

*Defined in [packages/react/src/GraphVizComponent.tsx:95](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L95)*

___

### `Static` defaultProps

### ▪ **defaultProps**: *object*

*Defined in [packages/react/src/GraphVizComponent.tsx:111](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L111)*

###  groups

• **groups**: *never[]* = []

*Defined in [packages/react/src/GraphVizComponent.tsx:113](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L113)*

###  onClick

• **onClick**: *noop* = noop

*Defined in [packages/react/src/GraphVizComponent.tsx:115](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L115)*

###  onLinkDrawn

• **onLinkDrawn**: *noop* = noop

*Defined in [packages/react/src/GraphVizComponent.tsx:114](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L114)*

###  onSecondaryClick

• **onSecondaryClick**: *noop* = noop

*Defined in [packages/react/src/GraphVizComponent.tsx:116](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L116)*

###  tooltips

• **tooltips**: *never[]* = []

*Defined in [packages/react/src/GraphVizComponent.tsx:112](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L112)*
