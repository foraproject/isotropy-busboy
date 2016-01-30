/* @flow */
import type { IncomingMessage } from "./flow/http-types";
import Busboy from 'busboy';

type FilePartType = {
  fieldname: string;
  file: string;
  filename: string;
}

type FieldPartType = {
  fieldname: string;
  value: string;
}

type PartType = FilePartType | FieldPartType;

type OptionsType = {
  limits?: {
    files?: number,
    parts?: number,
    fields?: number
  }
}

export default function (request: IncomingMessage, opts: OptionsType = {}) : () => Promise<?PartType> {
  let isAwaiting = false;
  let resolve, reject;
  let parts: Array<PartType> = [], errors: Array<Error> = [];
  const busboyOptions = Object.assign({}, opts);
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

  function onField(fieldname, value, fieldnameTruncated, valTruncated) {
    parts.push({
      fieldname,
      value
    });
    fulfill();
  }

  function onFile(fieldname, file, filename, transferEncoding, mimeType) {
    parts.push({
      fieldname,
      filename,
      file
    });
    fulfill();
  }

  function onEnd() {
    resolve();
    cleanup()
  }

  function onError(str) {
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
      }
    }
  }

  return () : Promise<?PartType> => {
    return new Promise((_resolve, _reject) => {
      isAwaiting = true;
      resolve = _resolve;
      reject = _reject;
      fulfill();
    });
  }
};
