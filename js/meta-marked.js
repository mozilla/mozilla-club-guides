function splitInput(str) {
    if (str.slice(0, 3) !== '---') return;

    var matcher = /\n(\.{3}|-{3})/g;
    var metaEnd = matcher.exec(str);

    return metaEnd && [str.slice(0, metaEnd.index), str.slice(matcher.lastIndex)];
}

var metaMarked = function(src, opt, callback) {
    if (Object.prototype.toString.call(src) !== '[object String]')
        throw new TypeError('First parameter must be a string.');

    var mySplitInput = splitInput(src);

    return mySplitInput ?  {
        meta : jsyaml.safeLoad(mySplitInput[0]),
        html : marked(mySplitInput[1], opt, callback)
    } : {
        meta : null,
        html : marked(src, opt, callback)
    };
};
