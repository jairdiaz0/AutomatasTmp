import { token } from "src/app/core/models/tokenList";
import { addSemErrors, addSemErrorsToTable, addTokenToTable, addTokenToTableFuntion, checkToken, getTablaSimbolos, getValueType, updateExpression } from "./analisis_semantico";

let bandera: boolean;
let mostrarEntradas: boolean;
let indice: number;
let errors: string = "";
let message: string = "";
let tokensOmitir: Array<number>;

export let codeSimp: string ="";

export function initSintactico(tokens: Array<token>) {
  bandera = true;
  mostrarEntradas = false;
  indice = -1;
  errors = '';
  message = '';
  tokensOmitir = [];
  codeSimp = '';
  ProgramaFuente(tokens);
  let tmp = tokens.filter((value, indexDelete) =>{
    for (let index = tokensOmitir.length-1; index >= 0; index--) {
      if(tokensOmitir[index] == indexDelete) return false;
    }
    return true;
  });
  let tmp2 = tmp.map((data)=>{
    return data.value;
  });
  let data = '';
  tmp2.forEach((value)=>{
    data+= value;
    if(value!='\n'){
      data += ' ';
    }
  });
  codeSimp = data;
}

export function getSinErrors(): string {
  return errors;
}

export function getSinMessage(): string {
  return message;
}

function addErrors(tokens: Array<token>, message: string, line: string, finalString: string, nextLine: boolean) {
  errors += `Línea - > ${line}, ${message}${finalString}`;
  bandera = false;
  if (nextLine) {
    while (indice < tokens.length && tokens[indice].line <= line) {
      indice++;
    }
    indice--;
  }
}

function ProgramaFuente(tokens: Array<token>) {
  if (tokens.length > 0) {
    Statements(tokens);
    if (bandera && indice == tokens.length - 1 && errors.length <= 0) {
      message = 'Todo OK';
    }
  }
}

function Statements(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Sentencias', indice);
  bandera = true;
  if (indice < tokens.length) {
    if(evaluarTokens(tokens, indice, ['New_Line'])){
      // let tokenAnterior = tokens[indice-1];
      // console.log(tokenAnterior)
      // tokensOmitir.push(indice);
      Statements(tokens);
    }else if (evaluarTokens(tokens, indice, ['Comment'])) {//
      tokensOmitir.push(indice);
      tokensOmitir.push(indice+1);
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['Execute'])) { //
      ExpressionForzada(tokens);
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['Input'])) {
      Print(tokens);
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['Var'])) { //
      let itmp = indice;
      Declaration(tokens);
      if (bandera) {
        const check = checkToken(tokens[itmp + 1]);
        if (check) {
          // addSemErrors(('Ya existe definición de: "' + check.token.value + '" - - > Linea Origen : ' + check.token.line + ' - - Linea Actual: ' + tokens[itmp].line + "\n"));
          // console.log('Check', check)
          addSemErrorsToTable(tokens[itmp].line, check.token.line, ('Ya existe definición de: "' + check.token.value + '"'), check.valueType);
        } else {
          addTokenToTable(tokens[itmp + 1], tokens.slice((itmp + 3), (indice + 1)), 'var');
        }
      }

      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['Id'])) { //
      let itmp = indice;
      Assignament(tokens);
      if (bandera) {
        const check = checkToken(tokens[itmp]);
        if (!check) {
          //addSemErrors(('No existe "' + tokens[itmp].value + '":  - - > Linea Actual: ' + tokens[itmp].line + "\n"));
          addSemErrorsToTable(tokens[itmp].line, 'N/A', ('No hay registro de "' + tokens[itmp].value + '"'), 'N/A');
        } else {
          if (check.type == 'var') {
            const value = tokens.slice((itmp + 2), (indice + 1));
            if (check.valueType == getValueType(value)) {
              check.valor = tokens.slice((itmp + 2), (indice + 1));
              updateExpression(check);
            } else {
              // addSemErrors(('No se puede cambiar de tipo de dato, Tipo dato Actual: ' + check.valueType + " - - > Linea Origen : " + check.token.line + ' - - Linea Actual: ' + tokens[itmp].line + "\n"));
              // console.log(check)
              addSemErrorsToTable(tokens[itmp].line, check.token.line, ('No se puede cambiar de tipo de dato de "' + check.token.value + '"'), check.valueType);
            }

          } else {
            //addSemErrors(('No se puede redefinir el tipo: ' + check.type + " - - > Linea Origen : " + check.token.line + ' - - Linea Actual: ' + tokens[itmp].line + "\n"));
            addSemErrorsToTable(tokens[itmp].line, check.token.line, ('No se puede redefinir el tipo de dato de "' + check.token.value + '"'), check.type);
          }
        }
      }
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['Get'])) { //
      Destruct(tokens);
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['Print'])) { //
      Print(tokens);
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['Class'])) { //
      console.log('Hola')
      let itmp = indice;
      Class(tokens);
      if (bandera) {
        const check = checkToken(tokens[itmp + 1]);
        if (check) {
          addSemErrorsToTable(tokens[itmp].line, check.token.line, ('Ya existe definición de: "' + check.token.value + '"'), check.type);
        } else {
          addTokenToTable(tokens[itmp + 1], tokens.slice((itmp + 3), (indice + 1)), 'clase');
        }
      }
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['Def'])) { //
      let itmp = indice;
      Functions(tokens);
      if (bandera) {
        const check = checkToken(tokens[itmp + 1]);
        if (check) {
          addSemErrorsToTable(tokens[itmp].line, check.token.line, ('Ya existe definición de: "' + check.token.value + '"'), check.type);
        } else {
          let valueType = "";
          for (let i = itmp; i < indice; i++) {
            if (tokens[i].value == ':') {
              valueType = tokens[i + 1].value;
              break;
            }
          }

          console.log('Valor ->', valueType)
          addTokenToTableFuntion(tokens[itmp + 1], tokens.slice((itmp + 2), (indice + 1)), 'funcion', valueType);
        }
      }
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['Return'])) { //
      ExpressionForzada(tokens);
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['If'])) { //
      If(tokens);
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['For'])) { //
      For(tokens);
      Statements(tokens);
    } else if (evaluarTokens(tokens, indice, ['While'])) { //
      While(tokens);
      Statements(tokens);
    }
  }
}

function While(tokens: Array<token>) {
  if (mostrarEntradas) console.log('While', indice);
  if (evaluarTokens(tokens, indice, ['('])) { //
    Condition(tokens);
    if (evaluarTokens(tokens, indice, [')'])) {
      if (evaluarTokens(tokens, indice, ['{'])) {
        Statements(tokens);
        if (evaluarTokens(tokens, indice, ['}'])) {
        } else {
          addErrors(tokens, 'Se esperaba un "}"', tokens[indice].line, '\n', true);
        }
      } else {
        addErrors(tokens, 'Se esperaba un "{"', tokens[indice].line, '\n', true);
      }
    } else {
      addErrors(tokens, 'Se esperaba un ")"', tokens[indice].line, '\n', true);
    }
  } else {
    addErrors(tokens, 'Se esperaba un "("', tokens[indice].line, '\n', true);
  }
}

function For(tokens: Array<token>) {
  if (mostrarEntradas) console.log('For', indice);
  if (evaluarTokens(tokens, indice, ['('])) {
    if (evaluarTokens(tokens, indice, ['Var'])) {
      if (evaluarTokens(tokens, indice, ['Id'])) {
        if (evaluarTokens(tokens, indice, [':'])) {
          ExpressionForzada(tokens);
          if (evaluarTokens(tokens, indice, [')'])) {
            if (evaluarTokens(tokens, indice, ['{'])) {
              Statements(tokens);
              if (evaluarTokens(tokens, indice, ['}'])) {
              } else {
                addErrors(tokens, 'Se esperaba un "}"', tokens[indice].line, '\n', true);
              }
            } else {
              addErrors(tokens, 'Se esperaba un "{"', tokens[indice].line, '\n', true);
            }
          } else {
            addErrors(tokens, 'Se esperaba un ")"', tokens[indice].line, '\n', true);
          }
        } else {
          addErrors(tokens, 'Se esperaba un ":"', tokens[indice].line, '\n', true);
        }
      } else {
        addErrors(tokens, 'Se esperaba un "Identificador"', tokens[indice].line, '\n', true);
      }
    } else {
      addErrors(tokens, 'Se esperaba un "var"', tokens[indice].line, '\n', true);
    }
  } else {
    addErrors(tokens, 'Se esperaba un "("', tokens[indice].line, '\n', true);
  }
}

function If(tokens: Array<token>) {
  if (mostrarEntradas) console.log('If', indice);
  if (evaluarTokens(tokens, indice, ['('])) {
    Condition(tokens);
    if (evaluarTokens(tokens, indice, [')'])) {
      if (evaluarTokens(tokens, indice, ['{'])) {
        Statements(tokens);
        if (evaluarTokens(tokens, indice, ['}'])) {
          if (evaluarTokens(tokens, indice, ['Else'])) {
            Else(tokens);
          }
        } else {
          addErrors(tokens, 'Se esperaba un "}"', tokens[indice].line, '\n', true);
        }
      } else {
        addErrors(tokens, 'Se esperaba un "{"', tokens[indice].line, '\n', true);
      }
    } else {
      addErrors(tokens, 'Se esperaba un ")"', tokens[indice].line, '\n', true);
    }
  } else {
    addErrors(tokens, 'Se esperaba un "("', tokens[indice].line, '\n', true);
  }
}

function Else(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Else', indice);
  if (evaluarTokens(tokens, indice, ['If'])) {
    If(tokens);
  } else if (evaluarTokens(tokens, indice, ['{'])) {
    Statements(tokens);
    if (evaluarTokens(tokens, indice, ["}"])) {
    } else {
      addErrors(tokens, 'Se esperaba un "}"', tokens[indice].line, '\n', true);
    }
  } else {
    addErrors(tokens, 'Se esperaba un si o una "{"', tokens[indice].line, '\n', true);
  }
}

function Functions(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Functions', indice);
  if (evaluarTokens(tokens, indice, ['Id'])) {
    if (evaluarTokens(tokens, indice, ['('])) {
      ParametersF(tokens);
      if (evaluarTokens(tokens, indice, [')'])) {
        if (evaluarTokens(tokens, indice, [':'])) {
          // if ((evaluarTokens(tokens, indice, ['Int'])) ||
          //   evaluarTokens(tokens, indice, ['Double']) ||
          //   evaluarTokens(tokens, indice, ['Boolean']) ||
          //   evaluarTokens(tokens, indice, ['String'])||
          //   evaluarTokens(tokens, indice, ['Void'])) {
          console.log(tokens[indice + 1]);
          if ((evaluarTokens(tokens, indice, ['IdClase']))) {
            if (evaluarTokens(tokens, indice, ['{'])) {
              Statements(tokens);
              if (evaluarTokens(tokens, indice, ['}'])) {
              } else {
                addErrors(tokens, 'Se esperaba un "}"', tokens[indice].line, '\n', true);
              }
            } else {
              addErrors(tokens, 'Se esperaba un "{"', tokens[indice].line, '\n', true);
            }
          } else {
            addErrors(tokens, 'Se esperaba devolver un tipo de Dato ppara la función', tokens[indice].line, '\n', true);
          }
        } else {
          addErrors(tokens, 'Se esperaba un ":"', tokens[indice].line, '\n', true);
        }
      } else {
        addErrors(tokens, 'Se esperaba un ")"', tokens[indice].line, '\n', true);
      }
    } else {
      addErrors(tokens, 'Se esperaba un "("', tokens[indice].line, '\n', true);
    }
  } else {
    addErrors(tokens, 'Se esperaba un "Identificador"', tokens[indice].line, '\n', true);
  }
}

function Class(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Class', indice);
  if (evaluarTokens(tokens, indice, ['IdClase'])) {
    if (evaluarTokens(tokens, indice, ['('])) {
      ParametersF(tokens);
      if (evaluarTokens(tokens, indice, [')'])) {
        if (evaluarTokens(tokens, indice, ['{'])) {
          Statements(tokens);
          if (evaluarTokens(tokens, indice, ['}'])) {
          } else {
            addErrors(tokens, 'Se esperaba un "}"', tokens[indice].line, '\n', true);
          }
        } else {
          addErrors(tokens, 'Se esperaba un "{"', tokens[indice].line, '\n', true);
        }
      } else {
        addErrors(tokens, 'Se esperaba un ")"', tokens[indice].line, '\n', true);
      }
    } else {
      addErrors(tokens, 'Se esperaba un "("', tokens[indice].line, '\n', true);
    }
  } else {
    addErrors(tokens, 'Se esperaba un "Identificador de Clase"', tokens[indice].line, '\n', true);
  }
}

function Print(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Print', indice);
  if (evaluarTokens(tokens, indice, ['('])) {
    Parameters(tokens);
    if (evaluarTokens(tokens, indice, [')'])) {
    } else {
      addErrors(tokens, 'Se esperaba un ")"', tokens[indice].line, '\n', true);
    }
  } else {
    addErrors(tokens, 'Se esperaba un "("', tokens[indice].line, '\n', true);
  }
}

function Destruct(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Destruct', indice);
  if (evaluarTokens(tokens, indice, ['{'])) {
    ParametersF(tokens);
    if (evaluarTokens(tokens, indice, ['}'])) {
      if (evaluarTokens(tokens, indice, ['OAs'])) {
        ExpressionForzada(tokens);
      } else {
        addErrors(tokens, 'Se esperaba un "Operador de Asignación"', tokens[indice].line, '\n', true);
      }
    } else {
      addErrors(tokens, 'Se esperaba un "}"', tokens[indice].line, '\n', true);
    }
  } else {
    addErrors(tokens, 'Se esperaba un "{"', tokens[indice].line, '\n', true);
  }
}

function Assignament(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Assignament', indice);
  if (evaluarTokens(tokens, indice, ['OAs'])) {
    if (evaluarTokens(tokens, indice, ['Input'])) {
      if (evaluarTokens(tokens, indice, ['('])) {
        if (evaluarTokens(tokens, indice, ['String'])) {
          if (evaluarTokens(tokens, indice, [')'])) {
          } else {
            addErrors(tokens, 'Se esperaba un ")"', tokens[indice].line, '\n', true);
          }
        } else {
          addErrors(tokens, 'Se esperaba un "Cadena"', tokens[indice].line, '\n', true);
        }
      } else {
        addErrors(tokens, 'Se esperaba un "("', tokens[indice].line, '\n', true);
      }
    } else {
      ExpressionForzada(tokens);
    }
  } else {
    addErrors(tokens, 'Se esperaba un "Operador de Asignación"', tokens[indice].line, '\n', true);
  }
}

function Declaration(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Declaration', indice);
  if (evaluarTokens(tokens, indice, ['Id'])) {
    Assignament(tokens);
  } else {
    addErrors(tokens, 'Se esperaba un "Identificador"', tokens[indice].line, '\n', true);
  }
}

function ExpressionForzada(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Expression Forzada', indice);
  if (evaluarTokens(tokens, indice, ['('])) {
    ExpressionForzada(tokens);
    ExpressionForzadaP(tokens);
    if (evaluarTokens(tokens, indice, [')'])) {
      ExpressionForzadaP(tokens);
    } else {
      addErrors(tokens, 'Se esperaba un ")"', tokens[indice].line, '\n', true);
    }
  } else {
    VBasic(tokens, false);
    ExpressionForzadaP(tokens);
  }
}

function ExpressionForzadaP(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Expression Forzada P', indice);
  if (evaluarTokens(tokens, indice, ['OA'])) {
    ExpressionForzada(tokens);
  }else{

  }
}
function Expression(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Expression', indice);
  if (evaluarTokens(tokens, indice, ['('])) {
    Expression(tokens);
    ExpressionP(tokens);
    if (evaluarTokens(tokens, indice, [')'])) {
      ExpressionP(tokens);
    } else {
      addErrors(tokens, 'Se esperaba un ")"', tokens[indice].line, '\n', true);
    }
  } else {
    VBasic(tokens, true);
    ExpressionP(tokens);
  }
}

function ExpressionP(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Expression P', indice);
  if (evaluarTokens(tokens, indice, ['OA'])) {
    ExpressionP(tokens);
  }
}

function VBasic(tokens: Array<token>, vacio: boolean) {
  if (mostrarEntradas) console.log('VBasic', indice);
  if (evaluarTokens(tokens, indice, ["Int"])) {
  } else if (evaluarTokens(tokens, indice, ["Double"])) {
  } else if (evaluarTokens(tokens, indice, ["Id"])) {
    if (evaluarTokens(tokens, indice, ['('])) {
      Parameters(tokens);
      if (evaluarTokens(tokens, indice, [')'])) {
        console.log('Hola');
      } else {
        addErrors(tokens, 'Se esperaba un ")"', tokens[indice].line, '\n', true);
      }
    } else if (evaluarTokens(tokens, indice, ['['])) {
      ParametersArrPP(tokens)
      if (evaluarTokens(tokens, indice, [']'])) {
      } else {
        addErrors(tokens, 'Se esperaba un "]"', tokens[indice].line, '\n', true);
      }
    }
  } else if (evaluarTokens(tokens, indice, ["String"])) {
  } else if (evaluarTokens(tokens, indice, ['Boolean'])) {
  } else if (evaluarTokens(tokens, indice, ['['])) {
    Parameters(tokens);
    if (evaluarTokens(tokens, indice, [']'])) {
    } else {
      addErrors(tokens, 'Se esperaba un "]"', tokens[indice].line, '\n', true);
    }
  } else {
    if (!vacio) {
      addErrors(tokens, 'Se esperaba una expresión válida', tokens[indice].line, '\n', true);
    }
  }
}

function ParametersArrP(tokens: Array<token>) {
  if (mostrarEntradas) console.log('ParametersArrP', indice);
  if (evaluarTokens(tokens, indice, [","])) {
    ParametersArrPP(tokens);
  }
}
function ParametersArrPP(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Int', indice);
  if (evaluarTokens(tokens, indice, ["Int"])) {
    ParametersArrP(tokens);
  }
}

function Parameters(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Parameters', indice);
  Expression(tokens)
  ParametersP(tokens);
}
function ParametersP(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Parameters P', indice);
  if (evaluarTokens(tokens, indice, [","])) {
    ParametersPP(tokens);
  }
}
function ParametersPP(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Parameters PP', indice);
  ExpressionForzada(tokens)
  ParametersP(tokens);
}

function ParametersF(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Parameters F', indice);
  if (evaluarTokens(tokens, indice, ["Id"])) {
    ParametersFP(tokens);
  }
}
function ParametersFP(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Parameters FP', indice);
  if (evaluarTokens(tokens, indice, [","])) {
    ParametersFPP(tokens);
  }
}
function ParametersFPP(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Parameters FPP', indice);
  if (evaluarTokens(tokens, indice, ["Id"])) {
    ParametersFP(tokens);
  } else {
    addErrors(tokens, 'Se esperaba un "Identificador"', tokens[indice].line, '\n', true);
  }
}
function Condition(tokens: Array<token>) {
  if (mostrarEntradas) console.log('Condition', indice);
  ExpressionForzada(tokens);
  if (evaluarTokens(tokens, indice, ['OR'])) {
    Condition(tokens);
  }
}

function evaluarTokens(tokens: Array<token>, index: number, checkTokens: Array<string>): boolean {
  if (indice < tokens.length) {
    if (index + checkTokens.length < tokens.length && bandera) {
      for (const indexToken in checkTokens) {
        const token = tokens[++index];
        if (token.tokenLex.token == 'NaN') {
          indice = index;
          addErrors(tokens, 'Error Tipo NaN', token.line, '\n', true);
          return true;
        } else {
          const checktoken = checkTokens[indexToken];
          if (!(token.tokenLex.token == checktoken)) {
            return false;
          }
        }
      }
      indice = index;
      return true;
    }
  }
  return false;
}
