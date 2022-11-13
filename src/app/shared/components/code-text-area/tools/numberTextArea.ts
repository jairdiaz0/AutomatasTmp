let codeEditor: any;
let lineCounter: any
export function addLineNumber(idTextLineNumber: string, idTextArea: string) {
    codeEditor = document.getElementById(idTextArea);
    lineCounter = document.getElementById(idTextLineNumber);
    codeEditor.addEventListener('scroll', () => {
        lineCounter.scrollTop = codeEditor.scrollTop;
        lineCounter.scrollLeft = codeEditor.scrollLeft;
    });
    codeEditor.addEventListener('input', () => {
        line_counter();
    });
}
export function line_counter() {
    var lineCountCache = 0;
    var lineCount = codeEditor.value.split('\n').length;
    var outarr = new Array();
    if (lineCountCache != lineCount) {
        for (var x = 0; x < lineCount; x++) {
            outarr[x] = (x + 1) + '.';
        }
        lineCounter.value = outarr.join('\n');
    }
    lineCountCache = lineCount;
}