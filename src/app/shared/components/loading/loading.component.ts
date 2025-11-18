import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-container">
      <mat-spinner diameter="50"></mat-spinner>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px;
    }
  `]
})
export class LoadingComponent {}

