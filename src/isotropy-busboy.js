/* @flow */
import Busboy from 'busboy';

import type { IncomingMessage } from "isotropy-interfaces/node/http";
import type { Stream } from "isotropy-interfaces/node/stream";

export type FormDataEntryType = {
  fieldname: string;
  value?: string;
  filename?: string;
  file?: Object;
  transferEncoding?: string;
  mimeType?: string;
}

export type FormDataType = Array<FormDataEntryType>;

export type BodyType = string | FormDataType;

export type OptionsType = {
  limits?: {
    files?: number,
    parts?: number,
  },
  fields?: number
}

export default function (request: IncomingMessage, opts: OptionsType = {}) : () => Promise<?FormDataEntryType> {
  let isAwaiting: boolean = false;
  let ended: boolean = false;
  let resolve: Function, reject: Function;
  let parts: FormDataType = [], errors: Array<Error> = [];

  const busboyOptions: Object = Object.assign({}, opts);
  busboyOptions.headers = request.headers;
  const busboy = new Busboy(busboyOptions);

  request.on('close', cleanup);

  busboy.on('field', onField)
  .on('file', onFile)
  .on('close', cleanup)
  .on('error', onError)
  .on('finish', onEnd);

  busboy.on('partsLimit', function() {
    onError('Reach parts limit');
  });

  busboy.on('filesLimit', function() {
    onError('Reach files limit');
  });

  busboy.on('fieldsLimit', function() {
    onError('Reach fields limit');
  });

  request.pipe(busboy);

  function onField(fieldname: string, value: string, fieldnameTruncated: boolean, valTruncated: boolean) {
    parts.push({
      fieldname,
      value
    });
    fulfill();
  }

  function onFile(fieldname: string, file: Stream, filename: string, transferEncoding: string, mimeType: string) {
    parts.push({
      fieldname,
      filename,
      file,
      transferEncoding,
      mimeType
    });
    fulfill();
  }

  function onEnd() {
    ended = true;
    fulfill();
    cleanup()
  }

  function onError(str: string) {
    const err = new Error(str);
    errors.push(err);
    fulfill();
    cleanup();
  }

  function cleanup() {
    request.removeAllListeners('close');
    busboy.removeAllListeners('field');
    busboy.removeAllListeners('file');
    busboy.removeAllListeners('close');
    busboy.removeAllListeners('error');
    busboy.removeAllListeners('partsLimit');
    busboy.removeAllListeners('filesLimit');
    busboy.removeAllListeners('fieldsLimit');
    busboy.removeAllListeners('finish');
  }

  function fulfill() {
    if (isAwaiting) {
      if (errors.length) {
        reject(errors.shift());
      } else if (parts.length) {
        resolve(parts.shift());
        isAwaiting = false;
      } else if (ended) {
        resolve();
      }
    }
  }

  return () : Promise<?FormDataEntryType> => {
    return new Promise((_resolve, _reject) => {
      isAwaiting = true;
      resolve = _resolve;
      reject = _reject;
      fulfill();
    });
  }
};
