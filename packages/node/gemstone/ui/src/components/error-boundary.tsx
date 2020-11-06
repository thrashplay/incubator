import React from 'react'

export interface ErrorBoundaryProps {
  renderHandler: (error: Error) => React.ReactNode
}

interface ErrorBoundaryState {
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public static getDerivedStateFromError (error: Error) {
    return {
      error,
    }
  }

  constructor (props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: undefined,
    }
  }

  public componentDidCatch (_error: Error, _errorInfo: unknown) {
    // You can also log the error to an error reporting service
  }

  public render () {
    const { renderHandler } = this.props
    if (this.state.error) {
      return renderHandler(this.state.error)
    }
    return this.props.children
  }
}
