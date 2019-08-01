import Jimp from 'jimp';
declare type IProcessorQuality = 'best' | 'good';
export interface IProcessorOptions {
    width?: number;
    quality: IProcessorQuality;
}
export default class ESCPOSImageProcessor {
    options: IProcessorOptions;
    hasResized: boolean;
    hasConverted: boolean;
    path: string;
    processId: string;
    constructor(options: IProcessorOptions);
    /**
     *
     * @param {*} device escpos module device
     * @param {*} printer escpos module printer
     */
    print: (device: any, printer: any) => void;
    /**
     *
     * @param {String} path The input path for the image.
     * @param {String} out The output path for the processed image.
     */
    convert: (path: string, out: string) => Promise<string>;
    private genProcessId;
    getRatio(img: Jimp): {
        w: number;
        h: number;
    };
}
export {};
