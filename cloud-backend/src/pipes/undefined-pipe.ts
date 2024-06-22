import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

// DTO에서 is옵셔널로 잡던거 이걸로 잡던가 
@Injectable()
export class UndefinedPipe implements PipeTransform<string | undefined, any> {
  transform(value: string | undefined, metadata: ArgumentMetadata) {
    if (value === 'undefined') return undefined;
    return value;
  }
}