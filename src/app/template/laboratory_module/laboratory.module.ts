import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DefaultComponent} from './default/default.component';
import {LaboratoryRouter} from './laboratory.router'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LaboratoryRouter)
    ],
    declarations: [DefaultComponent]
})

export class LaboratoryModule {
}
