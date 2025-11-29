// Learning the builder design pattern

interface ServiceConfiguration {
  maxRetries: number;
  enableSMS: boolean;
  loogingLevel: "DEBUG" | "INFO" | "ERROR";
}

interface NotificationService {
  send(message: string, reciever: string): void;
  config: ServiceConfiguration;
}

class ConcreteNotificationService implements NotificationService {
  send(message: string, reciever: string): void {
    console.log("Sending the message to reciever " + reciever);
    if (this.config.enableSMS === true) {
      console.log("EMS channel enabled for this notification service");
    }

    if (this.config.maxRetries) {
      console.log(
        "Retries mechanism has been enabled " + this.config.maxRetries + 1
      );
    }
  }
  config: ServiceConfiguration;

  constructor(config: ServiceConfiguration) {
    this.config = config;
  }
}

class ServiceBuilder {
  private config: ServiceConfiguration = {
    maxRetries: 0,
    enableSMS: false,
    loogingLevel: "INFO",
  };

  public withSmsBuilder(): ServiceBuilder {
    this.config.enableSMS = true;
    return this;
  }

  public withRetries(count: number): ServiceBuilder {
    this.config.maxRetries = count;
    return this;
  }

  public configureLoggingLevel(
    level: ServiceConfiguration["loogingLevel"]
  ): ServiceBuilder {
    this.config.loogingLevel = level;
    return this;
  }

  public build(): NotificationService {
    return new ConcreteNotificationService(this.config);
  }
}

console.log("Service Builder pattern demonstration");

const baseService: NotificationService = new ServiceBuilder().build();
console.log("Sending message");
baseService.send("Hello", "Reciever");

const builderService: NotificationService = new ServiceBuilder()
  .withRetries(1)
  .withSmsBuilder()
  .build();

builderService.send("message","anshul");