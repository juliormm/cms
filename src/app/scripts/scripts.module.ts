import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunScriptsComponent } from './run-scripts/run-scripts.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RunScriptsComponent],
  exports: [RunScriptsComponent]
})
export class ScriptsModule { }
