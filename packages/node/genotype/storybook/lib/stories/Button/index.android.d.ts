declare function Button({ onPress, children }: {
    onPress: any;
    children: any;
}): JSX.Element;
declare namespace Button {
    export namespace defaultProps {
        export const children: null;
        export function onPress(): void;
    }
    export namespace propTypes {
        const children_1: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        export { children_1 as children };
        const onPress_1: PropTypes.Requireable<(...args: any[]) => any>;
        export { onPress_1 as onPress };
    }
}
export default Button;
import PropTypes from "prop-types";
//# sourceMappingURL=index.android.d.ts.map