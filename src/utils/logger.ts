// Simple logging utility that can be easily configured for different environments

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  OFF = 4
}

class Logger {
  private currentLevel: LogLevel = LogLevel.INFO;
  private context?: string;

  constructor(context?: string) {
    this.context = context;
    
    // Set log level based on environment
    if (typeof window !== 'undefined') {
      const isDev = process.env.NODE_ENV === 'development';
      this.currentLevel = isDev ? LogLevel.DEBUG : LogLevel.WARN;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];
    const contextStr = this.context ? `[${this.context}]` : '';
    
    const logMessage = `${timestamp} ${levelStr} ${contextStr} ${message}`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, data);
        break;
      case LogLevel.INFO:
        console.info(logMessage, data);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, data);
        break;
    }
  }

  debug(message: string, data?: unknown): void {
    this.formatMessage(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: unknown): void {
    this.formatMessage(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: unknown): void {
    this.formatMessage(LogLevel.WARN, message, data);
  }

  error(message: string, data?: unknown): void {
    this.formatMessage(LogLevel.ERROR, message, data);
  }

  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  // Create a child logger with additional context
  child(context: string): Logger {
    const childContext = this.context ? `${this.context}:${context}` : context;
    const child = new Logger(childContext);
    child.setLevel(this.currentLevel);
    return child;
  }
}

// Export default logger instances for different parts of the app
export const logger = new Logger();
export const planStorageLogger = new Logger('PlanStorage');
export const syncLogger = new Logger('Sync');
export const teamPlanLogger = new Logger('TeamPlan');

export default Logger;