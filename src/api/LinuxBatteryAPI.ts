import camelcaseKeys from "camelcase-keys";
import { execa } from "execa";
import { DefaultBatteryAPI } from "./DefaultBatteryAPI";
import { BatteryInfo } from "./BatteryAPI";

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
 * Linux battery API info.
 */
export class LinuxBatteryInfo implements BatteryInfo {
  public nativePath: string = '';
  public percentage: number = 0;
  public state: string = 'unknown';
  public vendor: string = 'unknown';
  public model: string = 'unknown';
  public serial: string = 'unknown';
  public powerSupply: boolean = false;
  public present: boolean = false;

  public static parse(obj: { [key: string]: string }): LinuxBatteryInfo {
    if (typeof obj !== 'object') throw new Error('Invalid object provided.');
    const { percentage, state, vendor, model, serial, nativePath, powerSupply, present } = obj;
    const info = new LinuxBatteryInfo();

    try {
      info.percentage = parseFloat(percentage);
    }
    catch { console.warn('Could not get battery percentage.'); }

    if (typeof state === 'string' && state !== '') info.state = state;
    else console.warn('Could not get battery state.');

    if (typeof nativePath === 'string' && nativePath !== '') info.nativePath = nativePath;
    else console.warn('Could not get battery native path.');

    if (typeof vendor === 'string' && vendor !== '') info.vendor = vendor;
    else console.warn('Could not get battery vendor.');

    if (typeof model === 'string' && model !== '') info.model = model;
    else console.warn('Could not get battery model.');

    if (typeof serial === 'string' && serial !== '') info.serial = serial;
    else console.warn('Could not get battery serial.');

    if (typeof powerSupply === 'string' && powerSupply === 'yes') info.powerSupply = true;
    if (typeof present === 'string' && present === 'yes') info.present = true;

    return info;
  }

} 

/**
 * Linux battery API.
 */
export class LinuxBatteryAPI extends DefaultBatteryAPI {
  public readonly type: NodeJS.Platform = 'linux';

  private async getDevices(): Promise<string[]> {
    const { stdout } = await execa('upower', ['-e']);

    const batteries = stdout
      .trim()
      .split('\n')
      .filter(x => /battery_[^]+$/.test(x))
      .map(x => /battery_([^]+)$/.exec(x)?.[1] || '');

    return batteries;
  };

  private async getBatteries(): Promise<LinuxBatteryInfo[]> {
    const batteries = await this.getDevices();
    const batteryInfoPromises = batteries.map(async (battery) => {
      const args = ['-i', `/org/freedesktop/UPower/devices/battery_${battery}`];
      const obj: Record<string, string> = {};

      const { stdout } = await execa('upower', args);

      stdout.trim().split('\n').forEach(line => {
        if (line.trim() !== 'battery') {
          const [key, value] = line.split(/:\s+(?=[\w\d'])/);
          if (key && value) {
            obj[key.trim()] = value;
          }
        }
      });

      return LinuxBatteryInfo.parse(camelcaseKeys(obj));
    });

    return await Promise.all(batteryInfoPromises);
  }

  public override async getInfo(): Promise<LinuxBatteryInfo> {
    const batteries = await this.getBatteries();

    if (batteries.length === 0) throw new Error("No batteries found.");

    const battery = batteries[0];

    if (battery === undefined) throw new Error("No batteries supplying power found.");
    
    return battery;
  }
}