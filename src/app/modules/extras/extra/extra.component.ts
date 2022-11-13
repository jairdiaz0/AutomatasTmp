import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrls: ['./extra.component.css'],
})
export class ExtraComponent implements OnInit {
  //Observable para emitir datos de un componenete a otro
  $data: EventEmitter<string>;

  //Cadena a mostrar en el textArea del resultado
  result: string = '';

  constructor() {
    this.$data = new EventEmitter();
  }

  ngOnInit(): void {
    this.$data.subscribe((data) => {
      this.result = 'InFija ->\n' + data + '\n';
      this.inFijoAPostFijo(data);
      this.inFijoAPreFijo(data);
    });
  }

  /**
   * Arreglo con los elementos de prioridad, contiene un arreglo con una serie de elementos, y la prioridad para cualquier elemento en el arreglo.
   */
  arrPrioridad: Array<any> = [
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
  isKey(value: string, arrKeys: Array<any>): any {
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
  algoritmoApilarPostFijo(pila: Array<any>, key: any, result: Array<any>) {
    let lastItem = pila.pop();
    if (lastItem) {
      if (key.prioridad > lastItem.prioridad) {
        pila.push(lastItem);
      } else {
        result.push(lastItem.value);
        this.algoritmoApilarPostFijo(pila, key, result);
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
  algoritmoApilarPreFijo(pila: Array<any>, key: any, result: Array<any>) {
    let lastItem = pila.pop();
    if (lastItem) {
      if (key.prioridad < lastItem.prioridad) {
        result.push(lastItem.value);
        this.algoritmoApilarPreFijo(pila, key, result);
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
  buscarElementoPrioridad(
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
   * Método que nos permite pasar una cadena de infija a postfija.
   * @param data cadena a evaluar.
   */
  inFijoAPostFijo(data: string): void {
    //Separamos por espacios la información ingresada
    let arrData = data.split(' ').filter(Boolean);

    //Generamos la pila a usar para desarrollar el algoritmo
    let pila = new Array<any>();

    //Generamos el arreglo resultante
    let result = new Array<string>();

    for (let i = 0; i < arrData.length; i++) {
      let value = arrData[i];
      let key = this.isKey(value, this.arrPrioridad);
      if (key) {
        if (pila.length != 0) {
          if (key.prioridad == -1) {
            this.buscarElementoPrioridad(pila, result, 0, false);
            continue;
          } else if (key.prioridad != 0) {
            this.algoritmoApilarPostFijo(pila, key, result);
          }
        }
        pila.push(key);
      } else {
        result.push(value);
      }
    }

    // Sacamos los elementos de la pila y los agregamos al resultado
    pila.reverse().forEach((element) => {
      result.push(element.value);
    });

    // Mostramos el arreglo resultante en forma de texto.
    this.result +=
      'PostFija ->\n' + result.toString().replaceAll(',', ' ') + '\n';
  }

  /**
   * Método que nos permite pasar una cadena de infija a postfija.
   * @param data cadena a evaluar.
   */
  inFijoAPreFijo(data: string): void {
    //Separamos por espacios la información ingresada
    let arrData = data.split(' ').reverse().filter(Boolean);
    console.log('Data sin espacios -> ', arrData.toString().replaceAll(',', ' '));
    // console.log('ArrData -> ', arrData)

    //Generamos la pila a usar para desarrollar el algoritmo
    let pila = new Array<any>();

    //Generamos el arreglo resultante
    let result = new Array<string>();

    for (let i = 0; i < arrData.length; i++) {
      let value = arrData[i];
      let key = this.isKey(value, this.arrPrioridad);
      if (key) {
        if (pila.length != -1) {
          if (key.prioridad == 0) {
            this.buscarElementoPrioridad(pila, result, -1, false);
            continue;
          } else if (key.prioridad != -1) {
            this.algoritmoApilarPreFijo(pila, key, result);
          }
        }
        pila.push(key);
      } else {
        result.push(value);
      }
    }
    // console.log('Pila -> ', pila)
    pila.reverse().forEach((element) => {
      result.push(element.value);
    });
    // console.log('Result', result)
    this.result +=
      'PreFija ->\n' + result.reverse().toString().replaceAll(',', ' ') + '\n';
    // console.log(result.reverse().toString().replaceAll(',', ' '))
  }
}
