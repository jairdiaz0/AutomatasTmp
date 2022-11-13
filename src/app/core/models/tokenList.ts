import { tokenLexico } from "./tokenLexico";

export interface token {
    tokenLex : tokenLexico
    line: string,
    value: string
}