import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { token } from 'src/app/core/models/tokenList';
import {
  checkValue,
  getLexicoTable,
  initLexico,
} from 'src/app/shared/components/console-text-area/tools/analisis_lexico';
import {
  codeSimp,
  getSinErrors,
  getSinMessage,
  initSintactico,
} from 'src/app/shared/components/console-text-area/tools/analisis_sintactico';
import {
  getSemanticoTable,
  getSemErrors,
  getSemMessage,
  getTablaSimbolos,
  initSemantico,
} from './tools/analisis_semantico';

@Component({
  selector: 'app-console-text-area',
  templateUrl: './console-text-area.component.html',
  styleUrls: ['./console-text-area.component.css'],
})
export class ConsoleTextAreaComponent implements OnInit {
  @Input() $data?: EventEmitter<string>;
  codeOpti: string = '';
  navItemSelected = 0;
  navExpresionSelected = 0;

  tokens: Array<token> = [];

  constructor() {}

  ngOnInit(): void {
    this.$data?.subscribe((data) => {
      if (data.charAt(0) == ':') {
        data = data.substring(1);
      }
      this.tokens = initLexico(data);
      initSemantico();
      initSintactico(this.tokens);
      this.codeOpti = codeSimp;
    });
  }

  getCodeOptimizado(): string {
    return this.codeOpti;
  }

  sendCodeOptimizado(code: string) {
    // console.log(code);
    this.$data?.emit(':' + code);
    // console.log(code);
  }
  // Obtenemos la información ( String ) para mostrar la información.
  getSinErrorsInfo() {
    return getSinErrors();
  }

  getSinMessageInfo() {
    return getSinMessage();
  }

  getSemErrorsInfo() {
    return getSemErrors();
  }

  getSemMessageInfo() {
    return getSemMessage();
  }

  getLexTable() {
    return getLexicoTable();
  }

  getSemTable() {
    return getSemanticoTable();
  }
}
