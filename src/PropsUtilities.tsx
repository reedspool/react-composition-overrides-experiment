export const withBoundProps:
    <P>(Component: React.FC<P>, boundProps: Partial<P>) => React.FC<P> =
    (Component, boundProps) => {
        return (props) => <Component {...props} {...boundProps} />
    }

export const withDefaultProps:
    <P>(Component: React.FC<P>, defaultProps: Partial<P>) => React.FC<P> =
    (Component, defaultProps) => {
        return (props) => <Component {...defaultProps} {...props} />
    }
