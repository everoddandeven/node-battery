import { execa } from "execa";
import { BatteryInfo } from "./BatteryAPI";
import { DefaultBatteryAPI } from "./DefaultBatteryAPI";

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
 * Windows battery API info.
 */
export class WindowsBatteryInfo implements BatteryInfo {
  public percentage: number = 0;
  public state: string = 'unkown';
}

/**
 * Windows battery API.
 */
export class WindowsBatteryAPI extends DefaultBatteryAPI {
  public override readonly type: NodeJS.Platform = 'win32';

  private toDecimal(value: number): number {
    return parseFloat(value.toFixed(2));
  }

  private async getLevel(): Promise<number> {
    const { stdout } = await execa('WMIC', ['Path', 'Win32_Battery', 'Get', 'EstimatedChargeRemaining']);
    const c = stdout.split('\n');
    if (c.length < 2) throw new Error("No batteries found");

    const level = parseFloat(c[1]);
  
    return this.toDecimal(level > 100 ? 100 : level);
  }

  private async getState(): Promise<string> {
    const { stdout } = await execa('wmic', ['path', 'Win32_Battery', 'get', 'BatteryStatus']);
    const lines = stdout.trim().split('\n');    
    const status = parseInt(lines[1].trim(), 10);

    return status === 1 ? 'discharging' : 'charging';
  }
  
  public override async getInfo(): Promise<BatteryInfo> {
    const info = new WindowsBatteryInfo();

    info.percentage = await this.getLevel();
    info.state = info.percentage === 100 ? 'fully-charged' : await this.getState();
    
    return info;
  }
  
}