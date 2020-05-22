import * as React from 'react'
import {CSSProperties} from 'react'

export interface TooltipFields {
  id: string
  displayName?: string
}

export interface TooltipNode extends TooltipFields {
  screenX: number
  screenY: number
}

const getTooltipStyle = (node: TooltipNode): CSSProperties => {
  const offsetTop = 30
  const offsetLeft = 0
  return {
    left: node.screenX + offsetLeft,
    top: node.screenY + offsetTop,
    zIndex: 10,
  }
}

const styles = {
  root: {
    maxWidth: 250,
    overflow: 'hidden' as const,
    position: 'absolute' as const,
    fontSize: 12,
    backgroundColor: 'rgb(200,207,214, 0.7)',
    padding: 6,
    borderRadius: 3,
    textTransform: 'capitalize' as const,
    // Disable pointer events on tooltip node
    pointerEvents: 'none' as const,
  },
}

interface NodeTooltipsProps {
  node: TooltipNode | null
}

export function NodeTooltips(props: NodeTooltipsProps) {
  if (!props.node) {
    return null
  }
  return (
    <div style={{...styles.root, ...getTooltipStyle(props.node)}}>
      {props.node.displayName ?? props.node.id}
    </div>
  )
}
