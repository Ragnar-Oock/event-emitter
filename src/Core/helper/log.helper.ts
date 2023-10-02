enum LOG_LEVEL {
    NONE,
    ERROR,
    WARN,
    VERBOSE
}

let logLevel = LOG_LEVEL.VERBOSE;

export function setLogLevel(level: LOG_LEVEL): void {
    logLevel = level;
}
export function error(message?: any, ...optionalParams: any[]): void {
    if (logLevel >= LOG_LEVEL.ERROR) {
        console.error(message, ...optionalParams);
    }
}
export function warn(message?: any, ...optionalParams: any[]): void {
    if (logLevel >= LOG_LEVEL.WARN) {
        console.warn(message, ...optionalParams);
    }
}
export function log(message?: any, ...optionalParams: any[]): void {
    if (logLevel >= LOG_LEVEL.VERBOSE) {
        console.log(message, ...optionalParams);
    }
}