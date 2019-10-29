---
id: using-react-component
title: Using the React component
sidebar_label: React
---

## About

For React users, we ship a zero-config React component with the `@graph-viz/react` package. It renders a basic graph with 
force-directed layout and with a lot of default behaviors for interactions such as dragging, hovering, clicking,
right-clicking implemented.

Think of this package as an opinionated wrapper powered by the `core` and the `layouts` packages. It is built for a fast
development experience with a slightly-limited customizability. 

There still is plenty of room for customization and styling with the React package, but if you see 
yourself building custom interactions (such as different dragging behavior), custom layouts or functionality, we would
recommend building a React component yourself by using the lower-level `core` or `layouts` packages.

## Usage
TODO:

```tsx
import {GraphVizComponent} from '@graph-viz/react'

...
  <GraphVizComponent
    editMode
    nodes={[]}
    links={[]]}
    tooltips={[]}
  />
```
