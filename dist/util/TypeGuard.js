export const isNotContainUndefined = (ary) => {
    for (const a of ary) {
        if (a === undefined)
            return false;
    }
    return true;
};
//# sourceMappingURL=TypeGuard.js.map