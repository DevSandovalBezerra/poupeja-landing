type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'info';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatEntry(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
  if (entry.context) {
    return `${base} ${JSON.stringify(entry.context)}`;
  }
  return base;
}

function createEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    userId: (window as unknown as { __userId?: string }).__userId,
    sessionId: (window as unknown as { __sessionId?: string }).__sessionId,
  };
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>): void {
    if (shouldLog('debug')) {
      console.debug(formatEntry(createEntry('debug', message, context)));
    }
  },

  info(message: string, context?: Record<string, unknown>): void {
    if (shouldLog('info')) {
      console.info(formatEntry(createEntry('info', message, context)));
    }
  },

  warn(message: string, context?: Record<string, unknown>): void {
    if (shouldLog('warn')) {
      console.warn(formatEntry(createEntry('warn', message, context)));
    }
  },

  error(message: string, context?: Record<string, unknown>): void {
    if (shouldLog('error')) {
      console.error(formatEntry(createEntry('error', message, context)));
    }
  },

  setUser(userId: string): void {
    (window as unknown as { __userId: string }).__userId = userId;
  },

  setSession(sessionId: string): void {
    (window as unknown as { __sessionId: string }).__sessionId = sessionId;
  },
};

export function captureError(error: Error, context?: Record<string, unknown>): void {
  logger.error(error.message, {
    ...context,
    stack: error.stack,
    name: error.name,
  });
}
