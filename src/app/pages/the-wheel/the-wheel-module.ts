import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TheWheelPage } from './the-wheel';

const routes: Routes = [{ path: '', component: TheWheelPage }];

@NgModule({
  imports: [RouterModule.forChild(routes), TheWheelPage],
})
export class TheWheelModule {}
