import __polyfill from "babel-polyfill";
import should from "should";
import Stream from 'stream';
import busboy from '../isotropy-busboy';

describe('isotropy-busboy', () => {

  it('should return the correct number of parts', async () => {
    const getPart = busboy(request());
    let streams = 0, fields = 0, part;
    while(part = await getPart()) {
      if (!part) break;
      if (part.value) {
        fields++;
      } else {
        part.file.resume();
        streams++;
      }
    }
    fields.should.equal(6);
    streams.should.equal(3);
  });


  it('should throw error when the files limit is reached', async () => {
    const getPart = busboy(request(), {
      limits: { files: 1 }
    });

    let error;
    try {
      let part;
      while(part = await getPart()) {
        if (part.file) {
          part.file.resume();
        }
      }
    }
    catch (e) {
      error = e;
    }
    error.message.should.equal("Reach files limit");
  });

  it('should throw error when the fields limit is reached', async () => {
    const getPart = busboy(request(), {
      limits: { fields: 1 }
    });

    let error;
    try {
      let part;
      while(part = await getPart()) {
        if (part.file) {
          part.file.resume();
        }
      }
    }
    catch (e) {
      error = e;
    }
    error.message.should.equal("Reach fields limit");
  });

  it('should throw error when the fields limit is reached', async () => {
    const getPart = busboy(request(), {
      limits: { parts: 1 }
    });

    let error;
    try {
      let part;
      while(part = await getPart()) {
        if (part.file) {
          part.file.resume();
        }
      }
    }
    catch (e) {
      error = e;
    }
    error.message.should.equal("Reach parts limit");
  });


  function request() {
    // https://github.com/mscdex/busboy/blob/master/test/test-types-multipart.js

    const stream = new Stream.PassThrough()

    stream.headers = {
      'content-type': 'multipart/form-data; boundary=---------------------------paZqsnEHRufoShdX6fh0lUhXBP4k'
    }

    stream.end([
      '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
      'Content-Disposition: form-data; name="file_name_0"',
      '',
      'super alpha file',
      '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
      'Content-Disposition: form-data; name="file_name_0"',
      '',
      'super beta file',
      '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
      'Content-Disposition: form-data; name="file_name_0"',
      '',
      'super gamma file',
      '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
      'Content-Disposition: form-data; name="file_name_1"',
      '',
      'super gamma file',
      '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
      'Content-Disposition: form-data; name="_csrf"',
      '',
      'ooxx',
      '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
      'Content-Disposition: form-data; name="hasOwnProperty"',
      '',
      'super bad file',
      '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
      'Content-Disposition: form-data; name="upload_file_0"; filename="1k_a.dat"',
      'Content-Type: application/octet-stream',
      '',
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
      'Content-Disposition: form-data; name="upload_file_1"; filename="1k_b.dat"',
      'Content-Type: application/octet-stream',
      '',
      'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
      'Content-Disposition: form-data; name="upload_file_2"; filename="hack.exe"',
      'Content-Type: application/octet-stream',
      '',
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k--'
    ].join('\r\n'));

    return stream;
  }
})
