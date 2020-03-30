declare class Welcome extends React.Component<any, any, any> {
    constructor(props: Readonly<any>);
    constructor(props: any, context?: any);
    styles: {
        wrapper: {
            flex: number;
            padding: number;
            justifyContent: string;
        };
        header: {
            fontSize: number;
            marginBottom: number;
        };
        content: {
            fontSize: number;
            marginBottom: number;
            lineHeight: number;
        };
    };
    showApp: (event: any) => void;
    render(): JSX.Element;
}
declare namespace Welcome {
    export namespace defaultProps {
        export const showApp: null;
    }
    export namespace propTypes {
        const showApp_1: PropTypes.Requireable<(...args: any[]) => any>;
        export { showApp_1 as showApp };
    }
}
export default Welcome;
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=index.d.ts.map