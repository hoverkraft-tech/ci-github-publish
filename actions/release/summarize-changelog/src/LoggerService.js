export class LoggerService {
  constructor(core) {
    this.core = core;
  }

  info(message) {
    this.core.info(message);
  }

  warning(message) {
    this.core.warning(message);
  }
}
