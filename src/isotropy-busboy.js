/* @flow */
import type { KoaContextType } from "./flow/koa-types";
import type { FilePartType } from "async-busboy";
import busboy from "async-busboy";

type FieldPartType = {
  fieldname: string;
  val: string;
};

type PartType = FilePartType | FieldPartType;

/*
  Right not we're mostly wrapping around async-busboy
  Eventually, we'll replace this with busboy; since we might want (file & field) parts in on array to stay closer to underlying request.
*/
export default async function(ctx: KoaContextType) : Promise<Array<PartType>> {
   const { files, fields } = await busboy(ctx);

   const _parts: Array<PartType> = [];

   for (let key in fields) {
     _parts.push({ fieldname: key, val: fields[key] });
   }

   for (let file of files) {
     _parts.push(file);
   }
   return _parts;
}
