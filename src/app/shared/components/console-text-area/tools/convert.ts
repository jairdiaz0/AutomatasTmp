/**
 * Arreglo con los elementos de prioridad, contiene un arreglo con una serie de elementos, y la prioridad para cualquier elemento en el arreglo.
 */
let arrPrioridad: Array<any> = [
  {
    token: ['*', '/'],
    prioridad: 2,
  },
  {
    token: ['+', '-'],
    prioridad: 1,
  },
  {
    token: ['('],
    prioridad: 0,
  },
  {
    token: [')'],
    prioridad: -1,
  },
];
/**
 * Método que nos permite verificar si un valor existe en el arreglo de Prioridad, retornando el elemento con los datos de prioridad y el valor.
 * @param value Valor a evaluar, (valor a verificar si existe en el arreglo de Prioridad).
 * @param arrKeys Arreglo de prioridad en el cual se desea evaluar el valor.
 * @returns undefined en el caso de que el valor no coincida, o retorna el elemento con los datos de prioridad y el valor.
 */
function isKey(value: string, arrKeys: Array<any>): any {
  for (let i = 0; i < arrKeys.length; i++) {
    const { token, prioridad } = arrKeys[i];
    for (let j = 0; j < token.length; j++) {
      if (value == token[j]) {
        return {
          token: token,
          prioridad: prioridad,
          value: value,
        };
      }
    }
  }
  return undefined;
}
/**
 * Método que nos permite obtener apilar de acuerdo al algoritmo de prioridad, en el caso de postFijo la
 * condición es si el elemento es mayor a la prioridad, en caso de ser menor o igual se sigue buscando.
 * @param pila Arreglo que hará la función de pila.
 * @param key Elemento a evaluar.
 * @param result Arreglo en donde se almacenará el valor en el caso de sacar elementos de la pila.
 */
function algoritmoApilarPostFijo(
  pila: Array<any>,
  key: any,
  result: Array<any>
) {
  let lastItem = pila.pop();
  if (lastItem) {
    if (key.prioridad > lastItem.prioridad) {
      pila.push(lastItem);
    } else {
      result.push(lastItem.value);
      algoritmoApilarPostFijo(pila, key, result);
    }
  }
}
/**
 * Método que nos permite obtener apilar de acuerdo al algoritmo de prioridad, en el caso de preFijo la
 * condición es si el elemento es mayor o igual a la prioridad, en caso de ser menor se sigue buscando.
 * @param pila Arreglo que hará la función de pila.
 * @param key Elemento a evaluar.
 * @param result Arreglo en donde se almacenará el valor en el caso de sacar elementos de la pila.
 */
function algoritmoApilarPreFijo(
  pila: Array<any>,
  key: any,
  result: Array<any>
) {
  let lastItem = pila.pop();
  if (lastItem) {
    if (key.prioridad < lastItem.prioridad) {
      result.push(lastItem.value);
      algoritmoApilarPreFijo(pila, key, result);
    } else {
      pila.push(lastItem);
    }
  }
}
/**
 * Método que nos permite desapilar buscando un elemento de prioridad, ademas de dar la opción si agregar el elemento al resultado.
 * @param pila Arreglo que funciona como pila para desapilar.
 * @param result Arreglo donde se agregan los elementos resultantes.
 * @returns 0 en caso de acabar el método correctamente.
 */
function buscarElementoPrioridad(
  pila: Array<any>,
  result: Array<any>,
  prioridadABuscar: number,
  agregarElementoPrioridad: boolean
) {
  for (let i = pila.length - 1; i >= 0; i--) {
    let element = pila.pop();
    if (element.prioridad == prioridadABuscar) {
      if (agregarElementoPrioridad) result.push(element.value);
      break;
    } else {
      result.push(element.value);
    }
  }
  return 0;
}
/**
 * Toma una matriz de objetos y devuelve una cadena de valores de los objetos, separados por una
 * cadena.
 * @param arr - Array<any> = La matriz que desea convertir en una cadena.
 * @param {string} separador - el separador que quieres usar
 * @returns la cadena.
 */
function pilaToString(arr: Array<any>, separador: string) {
  let data: string = '';
  arr.forEach((key) => {
    data += key.value + ' ';
  });
  data = data.trim().replaceAll(' ', separador);
  return data;
}
export let tableInFijoToPosFijo: Array<any> = [];
/**
 * Método que nos permite pasar una cadena de infija a postfija.
 * @param data cadena a evaluar.
 */
export function inFijoAPosFijo(arrData: Array<string>): string {
  tableInFijoToPosFijo = [];

  //Generamos la pila a usar para desarrollar el algoritmo
  let pila = new Array<any>();

  //Generamos el arreglo resultante
  let result = new Array<string>();

  for (let i = 0; i < arrData.length; i++) {
    let value = arrData[i];
    let key = isKey(value, arrPrioridad);
    if (key) {
      if (pila.length != 0) {
        if (key.prioridad == -1) {
          buscarElementoPrioridad(pila, result, 0, false);
          tableInFijoToPosFijo.push({
            value: value,
            pila: pilaToString(pila, ', '),
            result: result.toString().replaceAll(',', ' '),
          });
          continue;
        } else if (key.prioridad != 0) {
          algoritmoApilarPostFijo(pila, key, result);
        }
      }
      pila.push(key);
    } else {
      result.push(value);
    }
    let data = {
      value: value,
      pila: pilaToString(pila, ', '),
      result: result.toString().replaceAll(',', ' '),
    };
    tableInFijoToPosFijo.push(data);
  }

  // Sacamos los elementos de la pila y los agregamos al resultado
  pila.reverse().forEach((element) => {
    result.push(element.value);
  });

  tableInFijoToPosFijo.push({
    value: '',
    pila: '',
    result: result.toString().replaceAll(',', ' '),
  });

  return result.toString().replaceAll(',', ' ').trim();
}
export let tableInFijoToPreFijo: Array<any> = [];
/**
 * Método que nos permite pasar una cadena de infija a postfija.
 * @param data cadena a evaluar.
 */
export function inFijoAPreFijo(arrData: Array<string>): string {
  tableInFijoToPreFijo = [];

  if (arrData.length > 0) {
    tableInFijoToPreFijo.push({
      value: '',
      pila: '',
      result: arrData.toString().replaceAll(',', ' '),
    });
  }
  //Generamos la pila a usar para desarrollar el algoritmo
  let pila = new Array<any>();

  //Generamos el arreglo resultante
  let result = new Array<string>();

  for (let i = 0; i < arrData.length; i++) {
    let value = arrData[i];
    let key = isKey(value, arrPrioridad);
    if (key) {
      if (pila.length != -1) {
        if (key.prioridad == 0) {
          buscarElementoPrioridad(pila, result, -1, false);
          tableInFijoToPreFijo.push({
            value: value,
            pila: pilaToString(pila, ', '),
            result: result.toString().replaceAll(',', ' '),
          });
          continue;
        } else if (key.prioridad != -1) {
          algoritmoApilarPreFijo(pila, key, result);
        }




      }
      pila.push(key);
    } else {
      result.push(value);
    }
    let data = {
      value: value,
      pila: pilaToString(pila, ', '),
      result: result.toString().replaceAll(',', ' '),
    };
    tableInFijoToPreFijo.push(data);
  }
  pila.reverse().forEach((element) => {
    result.push(element.value);
  });
  tableInFijoToPreFijo.push({
    value: '',
    pila: '',
    result: result.toString().replaceAll(',', ' '),
  });
  result.reverse();
  tableInFijoToPreFijo.push({
    value: '',
    pila: '',
    result: result.toString().replaceAll(',', ' '),
  });

  return result.toString().replaceAll(',', ' ').trim();
}
