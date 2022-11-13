export function handleKeydown(event: any, textArea: any) {
  if (event.key == 'Tab') {
    agregarCaracterFinal(event, textArea, '', '', '\t', 1);
  } else if (event.key == '{') {
    agregarCaracterFinal(event, textArea, '{ ', ' }', '', 2);
  } else if (event.key == "'") {
    agregarCaracterFinal(event, textArea, "'", "'", '', 1);
  } else if (event.key == '"') {
    agregarCaracterFinal(event, textArea, '"', '"', '  ', 3);
  } else if (event.key == '(') {
    agregarCaracterFinal(event, textArea, ' (', ') ', '  ', 3);
  } else if (event.key == '[') {
    agregarCaracterFinal(event, textArea, ' [', '] ', '  ', 3);
  } else if (event.key == '+') {
    agregarCaracterFinal(event, textArea, ' ', '+ ', '', 3);
  } else if (event.key == '-') {
    agregarCaracterFinal(event, textArea, ' ', '- ', '', 3);
  } else if (event.key == '*') {
    agregarCaracterFinal(event, textArea, ' ', '* ', '', 3);
  } else if (event.key == '/') {
    agregarCaracterFinal(event, textArea, ' ', '/ ', '', 3);
  } else if (event.key == ',') {
    agregarCaracterFinal(event, textArea, ' ', ', ', '', 3);
  } else if (event.key == '.') {
    agregarCaracterFinal(event, textArea, ' ', '. ', '', 3);
  } else if (event.key == ':') {
    agregarCaracterFinal(event, textArea, ' ', ': ', '', 3);
  } else if (event.key == '=') {
    agregarCaracterFinal(event, textArea, '', '=', '', 1);
  }
}

function agregarCaracterFinal(event: any, textArea: any, caracterInicio: string, caracterFinal: string, separador: string, newPos: number) {
  event.preventDefault();
  let start = event.target.selectionStart;
  
  let end = event.target.selectionEnd;

  let text: string = textArea.value;
  let textBefore = text.substring(0, start);
  let textAfter = text.substring(end);
  textArea.setValue(textBefore + caracterInicio + separador + caracterFinal + textAfter)
  // event.target.value = event.target.value+ caracterInicio + separador + caracterFinal + event.target.value.substring(end);
  event.target.selectionStart = event.target.selectionEnd = start + newPos;
}