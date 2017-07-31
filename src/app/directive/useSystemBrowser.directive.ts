import {Directive, ElementRef, Renderer} from '@angular/core';

@Directive({
    selector: '[appSystemBrowser]'
})
export class UseSystemBrowserDirective {

    constructor(private elem: ElementRef, renderer: Renderer) {

    }

}
