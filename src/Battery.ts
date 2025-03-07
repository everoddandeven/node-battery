import { BatteryAPI, BatteryInfo } from "./api";
import { BatteryAPIFactory } from "./api/BatteryAPIFactory";

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
 * Cross-platfrom battery interface.
 */
export abstract class Battery {
  private static _api?: BatteryAPI;

  private static async getApi(): Promise<BatteryAPI> {
    if (this._api === undefined) this._api = await BatteryAPIFactory.create();

    return this._api;
  }

  public static async getInfo(): Promise<BatteryInfo> {
    const api = await this.getApi();
    return await api.getInfo();
  }

  public static async getLevel(): Promise<number> {
    const info = await this.getInfo();

    return info.percentage;
  }

  public static async getState(): Promise<string> {
    const info = await this.getInfo();

    return info.state;
  }

  public static async isCharging(): Promise<boolean> {
    try {
      const state = await this.getState();

      return state === 'charging';
    }
    catch { return false; }
  }

  public static async isDischarging(): Promise<boolean> {
    try {
      const state = await this.getState();

      return state === 'discharging';
    }
    catch { return false; }
  }

  public static async isFullyCharged(): Promise<boolean> {
    try {
      const state = await this.getState();

      return state === 'fully-charged';
    }
    catch { return false; }
  }

}