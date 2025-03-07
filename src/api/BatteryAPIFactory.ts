import { platform } from "os";
import { BatteryAPI, BatteryPlatformNotSupportedError } from "./BatteryAPI";
import { LinuxBatteryAPI } from "./LinuxBatteryAPI";
import { WindowsBatteryAPI } from "./WindowsBatteryAPI";
import { OSXBatteryAPI } from "./OSXBatteryAPI";

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
 * System battery API factory.
 */
export abstract class BatteryAPIFactory {

  public static async create(): Promise<BatteryAPI> {
    const p = platform();

    if (p === 'linux') return new LinuxBatteryAPI();
    else if (p === 'win32') return new WindowsBatteryAPI();
    else if (p === 'darwin') return new OSXBatteryAPI();
    else throw new BatteryPlatformNotSupportedError();
  }

}