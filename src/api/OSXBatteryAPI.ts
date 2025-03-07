import plist, { PlistJsObj } from 'simple-plist';
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
 * OSX battery API info.
 */
export class OSXBatteryInfo implements BatteryInfo {
  public percentage: number = 0;
  public state: string = 'unknown';

  public static parse(obj: any): OSXBatteryInfo {
    const info = new OSXBatteryInfo();
    const { currentCapacity, maxCapacity } = obj;

    info.percentage = parseFloat((currentCapacity / maxCapacity).toFixed(2));
    
    return info;
  }
}

/**
 * OSX battery API.
 */
export class OSXBatteryAPI extends DefaultBatteryAPI {
  public override readonly type: NodeJS.Platform = 'darwin';
  
  public async getInfo(): Promise<OSXBatteryInfo> {
    const { stdout } = await execa('ioreg', ['-n', 'AppleSmartBattery', '-r', '-a']);

    // Analizziamo l'output con plist.parse
    const plistJsObj: PlistJsObj = plist.parse(stdout);

    const batteries = Array.isArray(plistJsObj) ? plistJsObj as any[] : [];

    // Verifica che esista almeno una batteria
    if (!batteries || batteries.length === 0) {
      throw new Error('No batteries found');
    }

    // Prendiamo il primo oggetto batteria e convertemo le chiavi in camelCase
    const battery = lowercaseFirstKeys(batteries[0]);

    // Riduciamo l'oggetto per gestire eventuali oggetti annidati
    const obj = Object.keys(battery).reduce((obj: any, key: string) => {
      const val = battery[key];
      obj[key] = typeof val === 'object' ? lowercaseFirstKeys(val) : val;
      return obj;
    }, {});

    return OSXBatteryInfo.parse(obj);
  }
  
}

function lowercaseFirstKeys(x: { [key: string]: any }): { [key: string]: any } {
  if (typeof x !== 'object') {
		throw new TypeError('Expected an object');
	}

	const ret: { [key: string]: any } = {};
	const keys = Object.keys(x);

	for (var i = 0; i < keys.length; i++) {
		ret[keys[i].charAt(0).toLowerCase() + keys[i].slice(1)] = x[keys[i]];
	}

	return ret;
}