import {LogMessage} from "./LogMessage.ts";
import {LogType} from "./LogType.ts";

export class Logger {
    static maxMessages: number = 20;

    readonly messages: LogMessage[] = [];

    message(message: string): void {
        this.addMessage(LogType.Message, message);
    }

    error(message: string): void {
        this.addMessage(LogType.Error, message);
    }

    gain(message: string): void {
        this.addMessage(LogType.Gain, message);
    }

    quest(message: string): void {
        this.addMessage(LogType.Quest, message);
    }

    help(message: string): void {
        this.addMessage(LogType.Help, message);
    }

    addMessage(type: LogType, message: string): void {
        console.log(type, message);

        if (this.messages) {
            const lastMessage = this.messages[message.length - 1];
            if (lastMessage && lastMessage.message === message) {
                lastMessage.repeat++;
                return;
            }
        }

        this.messages.push(new LogMessage(type, message));
        if (this.messages.length > Logger.maxMessages) {
            this.messages.shift();
        }
    }

    public getMessages(): ReadonlyArray<LogMessage> {
        return this.messages;
    }
}