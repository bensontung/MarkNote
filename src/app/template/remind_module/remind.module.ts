import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DefaultComponent} from './default/default.component';
import {RemindRouter} from './remind.router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RemindRouter)
    ],
    declarations: [DefaultComponent]
})

export class RemindModule {
}
