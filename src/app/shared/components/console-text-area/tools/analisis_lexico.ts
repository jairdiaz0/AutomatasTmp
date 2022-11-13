import { tokenLexico } from "src/app/core/models/tokenLexico";
import { token } from "src/app/core/models/tokenList";

let arrTokensLexico: Array<tokenLexico> = [
  {
    token: 'Comment',
    type: 'Comentario',
    er: /^[#](.)*$/,
  },
  {
    token: 'New_Line',
    type: 'Salto de Línea',
    er: /^\n*$/,
  },
  {
    token: 'String',
    type: 'Cadena',
    er: /^((['](.)*['])|(["](.)*["]))$/,
  },
  {
    token: ',',
    type: 'Símbolo (",")',
    er: /^,$/
  },
  {
    token: ':',
    type: 'Símbolo (" : ")',
    er: /^:$/
  },
  {
    token: '(',
    type: 'Símbolo (" ( ")',
    er: /^\($/
  },
  {
    token: ')',
    type: 'Símbolo (" ) ")',
    er: /^\)$/
  },
  {
    token: '{',
    type: 'Símbolo (" { ")',
    er: /^\{$/
  },
  {
    token: '}',
    type: 'Símbolo (" } ")',
    er: /^\}$/
  },
  {
    token: '[',
    type: 'Símbolo (" [ ")',
    er: /^\[$/
  },
  {
    token: ']',
    type: 'Símbolo (" ] ")',
    er: /^\]$/
  },
  {
    token: 'Import',
    type: 'Palabra Reservada',
    er: /^importar$/
  },
  {
    token: 'Class',
    type: 'Palabra Reservada',
    er: /^clase$/
  },
  {
    token: 'Def',
    type: 'Palabra Reservada',
    er: /^definir$/
  },
  {
    token: 'Return',
    type: 'Palabra Reservada',
    er: /^retornar$/
  },
  {
    token: 'Execute',
    type: 'Palabra Reservada',
    er: /^ejecutar$/
  },
  {
    token: 'Get',
    type: 'Palabra Reservada',
    er: /^obtener$/
  },
  {
    token: 'If',
    type: 'Palabra Reservada',
    er: /^si$/
  },
  {
    token: 'Else',
    type: 'Palabra Reservada',
    er: /^sino$/
  },
  {
    token: 'While',
    type: 'Palabra Reservada',
    er: /^mientras$/
  },
  {
    token: 'For',
    type: 'Palabra Reservada',
    er: /^repite$/
  },
  {
    token: 'Print',
    type: 'Palabra Reservada',
    er: /^imprime$/
  },
  {
    token: 'Input',
    type: 'Palabra Reservada',
    er: /^ingresa$/
  },
  {
    token: 'OR',
    type: 'Operador Relacional',
    er: /^((==)|(<=?)|(>=?)|(!=))$/
  },
  {
    token: 'OAs',
    type: 'Operador de Asignación',
    er: /^[=]$/
  },
  {
    token: 'OA',
    type: 'Operador aritmetico',
    er: /^[\/|+|\-|*]$/
  },
  {
    token: 'Var',
    type: 'Palabra Reservada',
    er: /^var$/
  },
  {
    //Números Enteros
    token: 'Int',
    type: 'Entero',
    er: /^(([-+]\d|\d)\d*)$/
  },
  {
    //Números Dobles
    token: 'Double',
    type: 'Doble',
    er: /^(([-+]\d|\d)\d*[.]\d+)$/
  },
  {
    token: 'Boolean',
    type: 'Booleano',
    er: /^(verdadero)|(falso)$/
  },
  {
    token: 'Void',
    type: 'Vacio',
    er: /^vacio$/
  },
  {
    token: 'IdClase',
    type: 'Clase',
    er: /^([A-Z][\w]*)$/
  },
  {
    //Variables | Métodos
    token: 'Id',
    type: 'Identificador',
    er: /^([a-z][\w]*)$/
  },
]

let table = {
  headers: ['Linea', 'Valor', 'Tipo'],
  tokens: new Array<token>,
  errors: new Array<token>
}

let ignore = [
  ''
]

export function getLexicoTable() {
  return table;
}

export function initLexico(lines: string): Array<token> {
  table.tokens = [];
  table.errors = [];
  checkValue(lines);
  return table.tokens;
}

/**
 * Nos permite obtener obtener el valor ingresado separando las palabras por Lineas, eliminando los \t innecesarios
 * @param lines String con las lineas escritas.
 * @param tokensLexico Arreglo de tokens en donde guardaremos los tokens de las palabras.
 * @returns Array <token> con los tokens de cada palabra.
 */
export function checkValue(lines: string) {
  if (lines.length > 0) {
    checkLines(lines.replaceAll('\t', '').split('\n'));
  }
}

function checkLines(lines: Array<string>) {
  let bandera = true;
  for (let index in lines) {
    if (lines[index].length > 0) {
      if (!checkLine(lines[index], Number(index) + 1)) {
        bandera = false;
        break;
      }
    }
  }
}

function checkLine(line: string, indexLine: number) {
  let words: Array<string> = new Array();
  let iComment = line.indexOf('#');
  if (iComment > 0) {
    words = (line.substring(0, iComment).split(' '));
    words.push(line.substring(iComment, line.length));
  } else if (iComment == 0) {
    words.push(line);
  } else {
    if (line.indexOf("'") >= 0) {
      getStrings(line, words);
    } else {
      words = line.split(' ');
    }
  }
  return checkWords(words, indexLine);
}

function getStrings(line: string, words: Array<string>) {
  const lineArr = line.split(' ');
  let flag = false;
  let comment = "";
  if (line.indexOf("'") >= 0) {
    lineArr.forEach(word => {
      if (word.charAt(0) == "'" && !flag) {
        flag = true;
        comment = "";
      }
      if (flag) {
        if (comment != "") {
          comment += ' '
        }
        comment += word;
        if (word.charAt(word.length - 1) == "'") {
          flag = false;
          words.push(comment);
        }
      } else {
        words.push(word);
      }

    });
  } else {
    words = lineArr;
  }
}

function checkWords(words: Array<string>, indexLine: number) {
  words.push('\n');
  for (const index in words) {
    let word = words[index];
    if (checkIgnore(word)) {
    } else if (!checkTokens(word, indexLine)) {
    }
  }
  return true;
}

function checkTokens(word: string, indexA: number) {
  for (const index in arrTokensLexico) {
    const { er, token, type } = arrTokensLexico[index];
    if (er.test(word)) {
      // tokens += 'Linea: ' + indexA + '     -     ' + word + ' - > ' + type + "\n";
      table.tokens.push(
        {
          tokenLex: arrTokensLexico[index],
          line: String(indexA),
          value: word
        }
      )
      return true;
    }
  }
  const error = {
    tokenLex: {
      token: 'NaN',
      type: 'Error Tipo No Válido',
      er: /^$/
    },
    line: String(indexA),
    value: word
  }
  table.tokens.push(error)
  table.errors.push(error)
  return false;
}

function checkIgnore(word: string) {
  for (const index in ignore) {
    if (ignore[index] == word) {
      return true;
    }
  }
  return false;
}
