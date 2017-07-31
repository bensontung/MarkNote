import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {DefaultComponent} from './default/default.component';
import {ImagesRouter} from './images.router';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild(ImagesRouter)
    ],
    declarations: [DefaultComponent]
})

export class ImagesModule {
}
