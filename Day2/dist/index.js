"use strict";
// Learning the builder design pattern
class ConcreteNotificationService {
    send(message, reciever) {
        console.log("Sending the message to reciever " + reciever);
        if (this.config.enableSMS === true) {
            console.log("EMS channel enabled for this notification service");
        }
        if (this.config.maxRetries) {
            console.log("Retries mechanism has been enabled " + this.config.maxRetries + 1);
        }
    }
    constructor(config) {
        this.config = config;
    }
}
class ServiceBuilder {
    constructor() {
        this.config = {
            maxRetries: 0,
            enableSMS: false,
            loogingLevel: "INFO",
        };
    }
    withSmsBuilder() {
        this.config.enableSMS = true;
        return this;
    }
    withRetries(count) {
        this.config.maxRetries = count;
        return this;
    }
    configureLoggingLevel(level) {
        this.config.loogingLevel = level;
        return this;
    }
    build() {
        return new ConcreteNotificationService(this.config);
    }
}
console.log("Service Builder pattern demonstration");
const baseService = new ServiceBuilder().build();
console.log("Sending message");
baseService.send("Hello", "Reciever");
const builderService = new ServiceBuilder()
    .withRetries(1)
    .withSmsBuilder()
    .build();
builderService.send("message", "anshul");
