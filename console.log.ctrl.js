javascript: ! function (b) {
    ! function (Ajs) {
        // if window
        var oScript = document.createElement("script");
        oScript.src = Ajs.shift();
        oScript.charset = 'utf-8';
        b.appendChild(oScript);
        console.log("正在加载：" + oScript.src);
        Ajs.length && (oScript.onload = arguments.callee.bind(null, Ajs));
        Ajs.length == 0 && (oScript.onload = function () {
            window.originalConsole = window.console;
            window.console = {};

            var textarea = $('<textarea id="yuan_mobile_console">');
            var t = textarea[0];
            var first_line = '  ------ from Yuanoook.com ------ \n> ';
 
            textarea.write = function (params) {
                return textarea.val(function () {
                    if (t.value.length == t.selectionEnd) return t.value;
                    return t.value.substring(0, t.selectionStart).replace(/\n$/, '') + t.value.substring(t.selectionStart)
                }().replace(/\n>\s$|\n$|$/, (params.islog ? '\n  ' : '\n< ')) + params.msg + '\n> ')
            }
 
            textarea.clear = function () {
                return textarea.val(first_line)
            }
 
            textarea.absClear = function () {
                return textarea.val('> ');
            }
 
            textarea.fix = function () {
                return textarea.val(t.value.replace(/\n$/, ''));
            }
 
            textarea.big = function () {
                return textarea.css({
                    top: 0,
                    width: '100%',
                    height: '100%'
                });
            };
 
            textarea.small = function () {
                return textarea.css({
                    top: '40%',
                    width: '30%',
                    height: '50px'
                });
            };
 
 
            textarea.init = function () {
                textarea.n = 1;
                return textarea.css({
                    position: 'fixed',
                    left: 0,
                    border: 0,
                    outline: 'none',
                    background: 'black',
                    color: 'white',
                    fontFamily: 'Consolas,Liberation Mono,Menlo,Courier,Microsoft Yahei,monospace',
                    zIndex: 100000000000
                }).big().clear();
            }
 
            textarea.init().appendTo($('body')).focus().on('keyup', function (event) {
                if (event.keyCode != 13 && event.keyCode != 8) return;
 
                var command, result;
                var n = textarea.n,
                    line_count = 0;
                var startTime = new Date();
 
                if (event.keyCode == 13) {
 
                    command = function () {
                        return (t.value.substring(0, t.selectionStart).match(/>\s([^\n]*?)\n$/)[1] + function () {
                            var subCommand = t.value.substring(t.selectionStart).match(/^(.*)/);
                            return (subCommand ? subCommand[1] : '')
                        }()).replace(/^\s*|\s*$/g, '');
                    }();
 
                    if (command == '') {
                        textarea.fix();
                        return
                    } else if (command == ',') {
                        textarea.clear();
                        return
                    } else if (command == ';') {
                        textarea.small().val(t.value.replace(/;\n$/, ''));
                        return
                    } else if (command == ';;') {
                        textarea.big().val(t.value.replace(/;;\n$/, ''));
                        return
                    } else if (command.replace(/;$/, '') == "clear()" && typeof clear == 'undefined') {
                        textarea.clear();
                        return
                    } else if (/^\?/.test(command)) {
                        n = Math.abs(parseInt(command.replace(/^\?/, '')));
                        textarea.n = n == 0 ? 0 : (n ? n : 1);
                        textarea.val(t.value.replace(/\n$/, '\n> '));
                        console.log('------ export deepness: ' + textarea.n + ' -----');
                        return
                    }
 
                    result = function (command, context, parents, n) {
                        var thisFunction = arguments.callee;
                        var text = '';
                        var obj = null;
                        var isVisited = false;
                        var fullname = '';
 
                        try {
                            obj = line_count == 0 ? eval.call(context, command) : command;
                        } catch (e) {
                            return e;
                        }
 
                        line_count == 0 && (thisFunction.historyArguments = []);
                        thisFunction.historyArguments.push(obj);
 
                        if (typeof obj == 'string') return '\"' + obj + '\"';
                        if (typeof obj != 'object') return obj;
 
                        if (obj && isArray(obj)) {
                            text = '[' + function () {
                                if (obj.length >= 2) {
                                    return obj.reduce(function (preVal, curVal) {
                                        return function () {
                                            if (typeof preVal == 'string') return '\"' + preVal + '\"';
                                            if (typeof preVal != 'object') return preVal;
                                            return thisFunction(preVal, obj, '', 0)
                                        }() + ',' + function () {
                                            if (typeof curVal == 'string') return '\"' + curVal + '\"';
                                            if (typeof curVal != 'object') return curVal;
                                            return thisFunction(curVal, obj, '', 0)
                                        }()
                                    });
                                } else if (obj.length == 1) {
                                    return thisFunction(obj[0], obj, '', 0)
                                } else {
                                    return ''
                                }
                            }() + ']';
                            line_count++;
                            return text
                        }
 
                        if (obj && (typeof obj == 'object')) {
                            for (i in obj) {
                                isVisited = thisFunction.historyArguments.indexOf(obj[i]) != -1;
                                fullname = (parents != '' ? parents + '.' : '') + i;
 
                                text += (fullname + ': ' + function () {
                                    if (typeof obj[i] == 'string') return '\"' + obj[i] + '\"';
                                    if (typeof obj[i] != 'object') return obj[i];
                                    if (n <= 1) return obj[i];
                                    if (isVisited) return obj[i];
                                    return '\n' + thisFunction(obj[i], obj, fullname, n - 1)
                                }() + '\n');
 
                                line_count++;
                            }
                            return text
                        }
                    }(command, window, '', n);
 
                    if (typeof result == 'string') result = result.replace(/\n*$/, '').replace(/\n/g, '\n  ');
 
                    textarea.write({
                        'msg': result,
                        'islog': false
                    });
 
                    textarea.scrollTop(this.scrollHeight);
                } else if (event.keyCode == 8) {
 
                }
 
            });

            window.console.log = function (msg) {
                if (arguments.length == 0) return;
                textarea.write({
                    'msg': msg,
                    'islog': true
                });
                originalConsole.log(msg);
            };

            window.console.clear = function () {
                textarea.clear();
                textarea.write({
                    'msg': 'Console was cleared',
                    'islog': true
                });
                originalConsole.clear();
            };

            function isArray(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }
        });
    }(["http://www.yuanoook.com/cdn/bootstrap/jquery.min.js"]);
}(document.body || document.querySelector('body'));
