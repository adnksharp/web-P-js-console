var run = document.getElementById('run'),
    input = document.getElementById('input'),
    mode = document.getElementById('mode');
const KEYWORDS = ['var', 'const', 'let', 'function', 'delete', 'if', 'for'], GLOBAL = {},
    CONSOLE = {
        log: (...message) => {
            var o = document.createElement('div');
            o.setAttribute('class', 'output');
            for (var i of message)
                o.innerText += i + ' ';
            output.appendChild(o);
        },
        error: (...message) => {
            var o = document.createElement('div');
            o.setAttribute('class', 'outputError');
            for (var i of message)
                o.innerText += i + ' ';
            o.style.color = "#FF0000"
            output.appendChild(o);
        },
        warn: (...message) => {
            var o = document.createElement('div');
            o.setAttribute('class', 'outputWarn');
            for (var i of message)
                o.innerText += i + ' ';
            o.style.color = "#FC8308"
            output.appendChild(o);
        }
    };
/**
 * out a piece of code
 * @param {string} code cout
 */
function outputCode(code, prefix = ' > ') {
    var i = document.createElement('div');
    i.setAttribute('class', 'output');
    i.innerText = prefix;
    var codes = [];//code.split(/=| |;|,|\.|{|}|\+|\-|\*|\/|\\|\||\n|%|!|\[|\]|\(|\)|~|`|'|"|<|>|\?|:|&/);
    var a = '';
    for (let j of code) {
        let k = j.match(/\=| |\;|\,|\.|\{|\}|\+|\-|\*|\/|\\|\||\n|\%|\!|\[|\]|\(|\)|\~|\`|\'|\"|\<|\>|\?|\:|\&|\^|\~/);
        if (k) {
            if (a) codes.push(a);
            a = '';
            codes.push(k[0]);
        } else a += j;
    }
    codes.push(a);
    console.log(code, codes);
    var inComment = false;
    var inString = false;
    for (var j_i in codes) {
        let j = codes[j_i];
        if (inComment) {
            i.innerHTML += `<span class="comment output">${j}</span>`;
        } else if ('= ;,.{}+-*/\\|\n%![]()~`\'"<>?:&~^'.includes(j)) {
            if (j == '/') {
                if (codes[Number(j_i) + 1] == '*' || codes[Number(j_i) + 1] == '/') {
                    inComment = true;
                    i.innerHTML += `<span class="comment output">${j}</span>`;
                } else if (codes[Number(j_i) - 1] == '*') {
                    inComment = false;
                    i.innerHTML += `<span class="comment output">${j}</span>`;
                } else i.innerHTML += `<span class="other output">${j}</span>`;
            } else if (j == '\'' || j == '\"') {
                inString = !inString;
                i.innerHTML += `<span class="string output">${j}</span>`;
            } else
                if (inString) i.innerHTML += `<span class="string output">${j}</span>`;
                else i.innerHTML += `<span class="other output">${j}</span>`;
        } else if (inString) {
            i.innerHTML += `<span class="string output">${j}</span>`;
        } else if (['var', 'let', 'const', 'function', 'class', 'undefined', 'null', 'NaN', 'true', 'false', 'void', 'arguments', 'export', 'delete', 'debugger', 'in', 'of', 'instanceof', 'interface', 'new', 'super', 'this', 'typeof'].includes(j)) {
            i.innerHTML += `<span class="keywords1 output">${j}</span>`;
        } else if (['for', 'if', 'else', 'try', 'catch', 'break', 'while', 'case', 'do', 'default', 'continue', 'finally', 'goto', 'import', 'from', 'as', 'return', 'package', 'switch', 'throw', 'with', 'yield'].includes(j)) {
            i.innerHTML += `<span class="keywords2 output">${j}</span>`;
        } else if (!isNaN(Number(j))) {
            i.innerHTML += `<span class="number output">${j}</span>`;
        } else {
            console.log(Number(j_i) + 1, codes[Number(j_i) + 1]);
            if (codes[Number(j_i) + 1] == '(') i.innerHTML += `<span class="function output">${j}</span>`;
            else i.innerHTML += `<span class="variable output">${j}</span>`;
        }
    }
    output.appendChild(i);
}
setInterval(() => {
    input.placeholder = `${mode.value == 1 ? 'Código de javascript: ' : 'Expresión:'}`;
}, 100);

function runCode() {
    if (input.value.length <= 0) return;
    outputCode(input.value);
    var o = document.createElement('div');
    o.setAttribute('class', 'output');
    try {
        if (input.value.includes(';') && mode.value == '2') {
            CONSOLE.warn('<  Las expresiones no deben contener “;”');
        } else o.innerText = '<  ' + (new Function('global', 'console', (mode.value == '2' ? 'return ' : '') + input.value)(GLOBAL, CONSOLE));
    } catch (error) {
        o.innerText = '<  ' + error;
        o.style.color = "#FF0000"
        o.setAttribute('class', 'outputError');
    }
    output.appendChild(o);
    input.value = '';
    return o.innerText;
}
run.addEventListener('click', runCode);