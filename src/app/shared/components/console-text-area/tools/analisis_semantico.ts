import { token } from 'src/app/core/models/tokenList';
import { inFijoAPosFijo, inFijoAPreFijo } from './convert';

let errors: string = '';
let message: string = '';
let tablaSimbolos: any = [];
let table = {
  headers: ['Linea Actual', 'Linea Origen', 'Error', 'Tipo Dato Actual'],
  tokens: new Array<any>(),
  errors: new Array<any>(),
};

export function addSemErrorsToTable(
  lineaActual: string,
  lineaOrigen: string,
  error: string,
  tipoDatoActual: string
) {
  table.errors.push({
    line: lineaActual,
    lineOrigin: lineaOrigen,
    error: error,
    typeValue: tipoDatoActual,
  });
}

export function getSemanticoTable() {
  return table;
}

export function initSemantico() {
  tablaSimbolos = [];
  table.tokens = [];
  table.errors = [];
  errors = '';
  message = '';
}

export function getSemErrors(): string {
  return errors;
}

export function getSemMessage(): string {
  return message;
}

export function getTablaSimbolos() {
  return tablaSimbolos;
}

export function checkToken(token: token) {
  for (let i = 0; i < tablaSimbolos.length; i++) {
    const tokenTmp = tablaSimbolos[i];
    if (token.value == tokenTmp.token.value) {
      return tokenTmp;
    }
  }
  return undefined;
}

export function addSemErrors(error: string) {
  errors += error;
}

export function addTokenToTable(
  token: token,
  value: Array<token>,
  type: string
) {
  let valueOrigin: Array<string> = value.map((data) => {
    const { value } = data;
    return value;
  });

  let expresion: Array<string> = value.map((data) => {
    const { value, tokenLex } = data;
    if (tokenLex.token == 'Id') {
      for (let i = 0; i < tablaSimbolos.length; i++) {
        let element = tablaSimbolos[i];
        if (element.token.value == value) {
          let vt = element.expresion?.value
          return vt?vt:'No soportado';
        }
      }
    }
    return value;
  });

  let vO = valueOrigin.toString().replaceAll(',', '');
  let eO = expresion.toString().replaceAll(',', '');

  if (vO != eO) {
    const data = {
      token: {value: '-> '+token.value},
      value: vO,
      type: '',
      valueType: '',
      expresion: {
        posFijo: inFijoAPosFijo(valueOrigin),
        preFijo: inFijoAPreFijo(valueOrigin),
        inFijo: vO,
        value: '',
      },
    };
    table.tokens.push(data);
  }

  let valueEval;
  try {
    valueEval = eval(eO);
  } catch (error) {
    valueEval= 'No soportado';
  }

  const data = {
    token: token,
    value: value,
    type: type,
    valueType: getValueType(value),
    expresion: {
      posFijo: inFijoAPosFijo(expresion),
      preFijo: inFijoAPreFijo(expresion),
      inFijo: expresion.toString().replaceAll(',', ' '),
      value: valueEval
    },
  };
  tablaSimbolos.push(data);
  // console.log('TablaSimbolos', tablaSimbolos)
  table.tokens.push(data);
}

export function updateExpression(check: any) {
  let expresion: Array<string> = check.valor.map((data: any) => {
    const { value, tokenLex } = data;
    if (tokenLex.token == 'Id') {
      for (let i = 0; i < tablaSimbolos.length; i++) {
        let element = tablaSimbolos[i];
        if (element.token.value == value) {
          return element.expresion.value;
        }
      }
    }
    return value;
  });
  check.expresion.posFijo = inFijoAPosFijo(expresion);
  (check.expresion.preFijo = inFijoAPreFijo(expresion)),
    (check.expresion.inFijo = expresion.toString().replaceAll(',', ' '));
  check.expresion.value = eval(expresion.toString().replaceAll(',', ''));
}

export function addTokenToTableFuntion(
  token: token,
  value: Array<token>,
  type: string,
  valueType: string
) {
  const data = {
    token: token,
    value: value,
    type: type,
    valueType: valueType,
  };
  tablaSimbolos.push(data);
  table.tokens.push(data);
}

export function getValueType(tokens: Array<token>) {
  // if (tokens.length > 1) {
  let tipo = analisisRenglon(tokens);
  return tipo;
  // } else {
  //     return tokens[0].tokenLex.type;
  // }
}

function analisisRenglon(tokens: token[]) {
  let tipo = '';
  let isFunction = false;
  tokens.forEach((element) => {
    if (tipo != 'NaN') {
      if (
        element.tokenLex.token != 'OA' &&
        element.tokenLex.token != '(' &&
        element.tokenLex.token != ')' &&
        element.tokenLex.token != ','
      ) {
        if (element.tokenLex.type == 'Cadena') {
          tipo = 'Cadena';
        } else if (tipo != 'Cadena') {
          if (element.tokenLex.token == 'Id') {
            let idEncontrado = false;
            table.tokens.forEach((identificador) => {
              if (element.value == identificador.token.value) {
                tipo = identificador.valueType;
                idEncontrado = true;
              }
            });
            if (!idEncontrado) {
              addSemErrorsToTable(
                element.line,
                element.line,
                'Variable no Encontrada',
                'NaN'
              );
            }
          } else {
            if (tipo == '') {
              tipo = element.tokenLex.type;
            } else if (tipo != element.tokenLex.type) {
              addSemErrorsToTable(
                element.line,
                element.line,
                'Tipo de dato de asignación invalido',
                tipo
              );
              tipo = 'NaN';
            }
          }
        }
      }
    }
  });
  return tipo;
}
