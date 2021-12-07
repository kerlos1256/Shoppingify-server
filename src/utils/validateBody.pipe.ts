import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
interface DecoData {
  dto: any;
  exclude?: string[];
}

const validate = async (obj: Object, dto: any, exclude: string[]) => {
  const validated = {};
  const entries = Object.entries(obj);
  for (const entry of entries) {
    if (new dto()[entry[0]] === null) {
      if (exclude) {
        if (!exclude.includes(entry[0])) {
          if (entry[1] !== '') {
            validated[entry[0]] = entry[1];
          }
        }
      } else {
        if (entry[1] !== '') {
          validated[entry[0]] = entry[1];
        }
      }
    }
  }

  return validated;
};

@Injectable()
export class validateBodyPipe implements PipeTransform {
  constructor(private dto: any, private exclude?: string[]) {}

  async transform(body: any, metadata: ArgumentMetadata) {
    const isArray = Array.isArray(body);
    if (!isArray) {
      return validate(body, this.dto, this.exclude);
    } else if (isArray) {
      const arr = [];
      body.map(async (obj) => {
        const res = await validate(obj, this.dto, this.exclude);
        return arr.push(res);
      });
      return arr;
    }
  }
}
