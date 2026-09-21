import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortIt',
})
export class ShortenerPipe implements PipeTransform {
  transform(value: string | undefined | null, maxCharacters: number): string {
    if (!value) {
      return '';
    }
    if (value.length > maxCharacters) {
      return value.substring(0, maxCharacters) + '...';
    }
    return value;
  }
}
