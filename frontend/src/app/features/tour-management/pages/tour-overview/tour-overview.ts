import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TourList } from '../../smart_container/tour-list/tour-list';

@Component({
  selector: 'app-tour-overview',
  imports: [
    TourList,
  ],
  template: `
  <app-tour-list/>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourManagement {}
