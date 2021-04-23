const isObject = (val: null) => {
    return typeof val === 'object' && val !== null;
};

/**
 * TODO: describe me
 *
 * @param args
 */
export const classnames = (...args: string[]) => {
    const classes: string[] = [];
    args.forEach(arg => {
        if (typeof arg === 'string') {
            classes.push(arg);
        } else if (isObject(arg)) {
            Object.keys(arg).forEach(key => {
                if (arg[key]) {
                    classes.push(key);
                }
            });
        } else {
            throw new Error(
                '`classnames` only accepts string or object as arguments'
            );
        }
    });

    return classes.join(' ');
};
