import {LogType} from "./LogType.ts";

export class LogMessage {
    constructor(
        public readonly type: LogType,
        public readonly message: string,
        public repeat: number = 0,
    ) {
    }
}