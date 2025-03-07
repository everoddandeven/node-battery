import { platform } from "os";

/**
 * Copyright (c) everoddandeven
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Battery API interface.
 */
export interface BatteryAPI {
  type: NodeJS.Platform;

  isSupported(): boolean;
  getInfo(): Promise<BatteryInfo>;
}

/**
 * Battery API info.
 */
export interface BatteryInfo {
  percentage: number;
  state: string;
}

/** Generic battery API error. */
export class BatteryAPIError extends Error { }

/**
 * Battery API not supported error.
 */
export class BatteryAPINotSupportedError extends BatteryAPIError {
  public readonly api: NodeJS.Platform;

  constructor(api: NodeJS.Platform) {
    super(`Battery API ${api} not supported on current os.`);
    this.api = api;
  }
}

/** OS Platform not supported error. */
export class BatteryPlatformNotSupportedError extends BatteryAPIError {
  constructor() {
    super(`OS platform ${platform()} not supported.`);
  }
}
