import { Battery } from "../dist";

export abstract class TestBattery {

  public static async runTests(): Promise<void> {
    let successfull_test: number = 0;
    let failed_tests: number = 0;
    
    if (await this.testGetInfo()) successfull_test++;
    else failed_tests++;
    
    
    await this.testGetLevel();

    const total_tests = successfull_test + failed_tests;

    TestLogger.info('TestBattery', `[TESTS ${total_tests}]\t[SUCCESS ${successfull_test}]\t[FAILED ${failed_tests}]`)
  }

  public static async testGetInfo(): Promise<boolean> {
    const logger = new TestLogger('testGetInfo');
    logger.started();

    try {
      const info = await Battery.getInfo();
      console.log(info);
      logger.success();
      return true;
    }
    catch (error: any) {
      const err = error instanceof Error ? error : new Error(`${error}`);
      logger.fail(err);
      return false;
    }

  }

  public static async testGetLevel(): Promise<boolean> {
    const logger = new TestLogger('testGetLevel');
    logger.started();

    try {
      const level = await Battery.getLevel();
      logger.debug(`Current battery level: ${level}`);
      logger.success();
      return true;
    }
    catch (error: any) {
      const err = error instanceof Error ? error : new Error(`${error}`);
      logger.fail(err);
      return false;
    }

  }

}

export class TestLogger {

  public readonly test: string;

  constructor(test: string) {
    this.test = test;
  }

  public started(): void {
    console.log(`[STARTED] ${this.test}`);
  }

  public info(message: string): void {
    TestLogger.info(this.test, message);
  }

  public debug(message: string): void {
    TestLogger.debug(this.test, message);
  }

  public success(): void {
    TestLogger.success(this.test);
  }

  public warn(warn: string): void {
    TestLogger.warn(this.test, warn);
  }

  public fail(error: string | Error): void {
    TestLogger.fail(this.test, error);
  }

  public static info(test: string, message: string): void {
    console.log(`[INFO] ${test}: ${message}`);
  }

  public static debug(test: string, message: string): void {
    console.log(`[DEBUG] ${test}: ${message}`);
  }

  public static success(test: string): void {
    console.log(`[SUCCESS] ${test}`);
  }

  public static warn(test: string, warn: string): void {
    console.warn(`[WARN] ${test}: ${warn}`);
  }

  public static fail(test: string, error: string | Error): void {
    console.error(`[FAIL] ${test}: ${error instanceof Error ? error.message : error}`);
  }

}

TestBattery.runTests().finally(() => console.log("END TESTS"));