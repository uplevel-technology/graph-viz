---
id: "react.graphvizcomponent"
title: "GraphVizComponent"
sidebar_label: "GraphVizComponent"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [react](../modules/react.md) › [GraphVizComponent](react.graphvizcomponent.md)

## Type parameters

▪ **SS**

## Hierarchy

* Component‹[Props](../interfaces/react.props.md), [State](../interfaces/react.state.md)›

  ↳ **GraphVizComponent**

## Index

### Constructors

* [constructor](react.graphvizcomponent.md#constructor)

### Properties

* [canvasRef](react.graphvizcomponent.md#canvasref)
* [context](react.graphvizcomponent.md#context)
* [onWindowResize](react.graphvizcomponent.md#onwindowresize)
* [props](react.graphvizcomponent.md#props)
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

* [state](react.graphvizcomponent.md#state)
* [vizData](react.graphvizcomponent.md#vizdata)
* [defaultProps](react.graphvizcomponent.md#static-defaultprops)

## Constructors

###  constructor

\+ **new GraphVizComponent**(`props`: Readonly‹[Props](../interfaces/react.props.md)›): *[GraphVizComponent](react.graphvizcomponent.md)*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:425

**Parameters:**

Name | Type |
------ | ------ |
`props` | Readonly‹[Props](../interfaces/react.props.md)› |

**Returns:** *[GraphVizComponent](react.graphvizcomponent.md)*

\+ **new GraphVizComponent**(`props`: [Props](../interfaces/react.props.md), `context?`: any): *[GraphVizComponent](react.graphvizcomponent.md)*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:427

**`deprecated`** 

**`see`** https://reactjs.org/docs/legacy-context.html

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../interfaces/react.props.md) |
`context?` | any |

**Returns:** *[GraphVizComponent](react.graphvizcomponent.md)*

## Properties

###  canvasRef

• **canvasRef**: *RefObject‹HTMLCanvasElement›* =  React.createRef()

*Defined in [react/src/GraphVizComponent.tsx:102](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L102)*

___

###  context

• **context**: *any*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:425

If using the new style context, re-declare this in your class to be the
`React.ContextType` of your `static contextType`.

```ts
static contextType = MyContext
context!: React.ContextType<typeof MyContext>
```

**`deprecated`** if used without a type annotation, or without static contextType

**`see`** https://reactjs.org/docs/legacy-context.html

___

###  onWindowResize

• **onWindowResize**: *function* =  debounce(() => {
    const root = this.rootRef.current!
    const {width, height} = root.getBoundingClientRect()

    this.visualization.resize(width, height)
  }, 500)

*Defined in [react/src/GraphVizComponent.tsx:117](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L117)*

#### Type declaration:

▸ (): *void*

___

###  props

• **props**: *Readonly‹[Props](../interfaces/react.props.md)› & Readonly‹object›*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:450

___

###  refs

• **refs**: *object*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:456

**`deprecated`** 
https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs

#### Type declaration:

* \[ **key**: *string*\]: ReactInstance

___

###  rootRef

• **rootRef**: *RefObject‹HTMLDivElement›* =  React.createRef()

*Defined in [react/src/GraphVizComponent.tsx:101](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L101)*

___

###  simulation

• **simulation**: *ForceSimulation*

*Defined in [react/src/GraphVizComponent.tsx:99](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L99)*

___

###  tooltipNodes

• **tooltipNodes**: *[TooltipNode](../interfaces/react.tooltipnode.md)[]*

*Defined in [react/src/GraphVizComponent.tsx:98](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L98)*

___

###  visualization

• **visualization**: *GraphVisualization*

*Defined in [react/src/GraphVizComponent.tsx:88](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L88)*

___

### `Static` `Optional` contextType

▪ **contextType**? : *Context‹any›*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:410

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

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:638

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

▸ **UNSAFE_componentWillReceiveProps**(`nextProps`: Readonly‹[Props](../interfaces/react.props.md)›, `nextContext`: any): *void*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:670

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
`nextProps` | Readonly‹[Props](../interfaces/react.props.md)› |
`nextContext` | any |

**Returns:** *void*

___

### `Optional` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(`nextProps`: Readonly‹[Props](../interfaces/react.props.md)›, `nextState`: Readonly‹[State](../interfaces/react.state.md)›, `nextContext`: any): *void*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:698

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
`nextProps` | Readonly‹[Props](../interfaces/react.props.md)› |
`nextState` | Readonly‹[State](../interfaces/react.state.md)› |
`nextContext` | any |

**Returns:** *void*

___

### `Optional` componentDidCatch

▸ **componentDidCatch**(`error`: Error, `errorInfo`: ErrorInfo): *void*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:567

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

*Defined in [react/src/GraphVizComponent.tsx:124](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L124)*

**Returns:** *void*

___

###  componentDidUpdate

▸ **componentDidUpdate**(`prevProps`: [Props](../interfaces/react.props.md)): *void*

*Overrides void*

*Defined in [react/src/GraphVizComponent.tsx:305](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L305)*

**Parameters:**

Name | Type |
------ | ------ |
`prevProps` | [Props](../interfaces/react.props.md) |

**Returns:** *void*

___

### `Optional` componentWillMount

▸ **componentWillMount**(): *void*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:624

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

▸ **componentWillReceiveProps**(`nextProps`: Readonly‹[Props](../interfaces/react.props.md)›, `nextContext`: any): *void*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:653

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
`nextProps` | Readonly‹[Props](../interfaces/react.props.md)› |
`nextContext` | any |

**Returns:** *void*

___

###  componentWillUnmount

▸ **componentWillUnmount**(): *void*

*Overrides void*

*Defined in [react/src/GraphVizComponent.tsx:319](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L319)*

**Returns:** *void*

___

### `Optional` componentWillUpdate

▸ **componentWillUpdate**(`nextProps`: Readonly‹[Props](../interfaces/react.props.md)›, `nextState`: Readonly‹[State](../interfaces/react.state.md)›, `nextContext`: any): *void*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:683

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
`nextProps` | Readonly‹[Props](../interfaces/react.props.md)› |
`nextState` | Readonly‹[State](../interfaces/react.state.md)› |
`nextContext` | any |

**Returns:** *void*

___

###  forceUpdate

▸ **forceUpdate**(`callback?`: undefined | function): *void*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:442

**Parameters:**

Name | Type |
------ | ------ |
`callback?` | undefined &#124; function |

**Returns:** *void*

___

### `Optional` getSnapshotBeforeUpdate

▸ **getSnapshotBeforeUpdate**(`prevProps`: Readonly‹[Props](../interfaces/react.props.md)›, `prevState`: Readonly‹[State](../interfaces/react.state.md)›): *SS | null*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:603

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

**Parameters:**

Name | Type |
------ | ------ |
`prevProps` | Readonly‹[Props](../interfaces/react.props.md)› |
`prevState` | Readonly‹[State](../interfaces/react.state.md)› |

**Returns:** *SS | null*

___

###  initData

▸ **initData**(): *void*

*Defined in [react/src/GraphVizComponent.tsx:325](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L325)*

**Returns:** *void*

___

###  render

▸ **render**(): *Element*

*Overrides void*

*Defined in [react/src/GraphVizComponent.tsx:356](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L356)*

**Returns:** *Element*

___

###  setState

▸ **setState**<**K**>(`state`: function | null | S | object, `callback?`: undefined | function): *void*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:437

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

▸ **shouldComponentUpdate**(`nextProps`: Readonly‹[Props](../interfaces/react.props.md)›, `nextState`: Readonly‹[State](../interfaces/react.state.md)›, `nextContext`: any): *boolean*

*Inherited from void*

Defined in /Users/smohite/graph-viz/node_modules/@types/react/index.d.ts:557

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate`
and `componentDidUpdate` will not be called.

**Parameters:**

Name | Type |
------ | ------ |
`nextProps` | Readonly‹[Props](../interfaces/react.props.md)› |
`nextState` | Readonly‹[State](../interfaces/react.state.md)› |
`nextContext` | any |

**Returns:** *boolean*

___

###  zoomIn

▸ **zoomIn**(): *void*

*Defined in [react/src/GraphVizComponent.tsx:348](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L348)*

**Returns:** *void*

___

###  zoomOut

▸ **zoomOut**(): *void*

*Defined in [react/src/GraphVizComponent.tsx:352](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L352)*

**Returns:** *void*

## Object literals

###  state

### ▪ **state**: *object*

*Overrides void*

*Defined in [react/src/GraphVizComponent.tsx:104](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L104)*

###  currentTooltipNode

• **currentTooltipNode**: *null* =  null

*Defined in [react/src/GraphVizComponent.tsx:105](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L105)*

###  currentlyHoveredIdx

• **currentlyHoveredIdx**: *null* =  null

*Defined in [react/src/GraphVizComponent.tsx:106](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L106)*

___

###  vizData

### ▪ **vizData**: *object*

*Defined in [react/src/GraphVizComponent.tsx:92](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L92)*

###  groups

• **groups**: *never[]* =  []

*Defined in [react/src/GraphVizComponent.tsx:95](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L95)*

###  links

• **links**: *never[]* =  []

*Defined in [react/src/GraphVizComponent.tsx:94](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L94)*

###  nodes

• **nodes**: *never[]* =  []

*Defined in [react/src/GraphVizComponent.tsx:93](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L93)*

___

### `Static` defaultProps

### ▪ **defaultProps**: *object*

*Defined in [react/src/GraphVizComponent.tsx:109](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L109)*

###  groups

• **groups**: *never[]* =  []

*Defined in [react/src/GraphVizComponent.tsx:111](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L111)*

###  onClick

• **onClick**: *noop* =  noop

*Defined in [react/src/GraphVizComponent.tsx:113](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L113)*

###  onLinkDrawn

• **onLinkDrawn**: *noop* =  noop

*Defined in [react/src/GraphVizComponent.tsx:112](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L112)*

###  onSecondaryClick

• **onSecondaryClick**: *noop* =  noop

*Defined in [react/src/GraphVizComponent.tsx:114](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L114)*

###  tooltips

• **tooltips**: *never[]* =  []

*Defined in [react/src/GraphVizComponent.tsx:110](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L110)*
