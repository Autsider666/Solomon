import './style.css';
import {Stat} from "./Engine/Character/Stat/Stat.ts";

console.log(Object.keys(Stat).filter(value => isNaN(Number(value))) as Stat[]);