import {Directive, ElementRef, Renderer, Inject} from '@angular/core';

@Directive({
    selector: '[appModalDrag]'
})
export class AppModalDirective {
    constructor(elem: ElementRef, renderer: Renderer, @Inject('drag') private drag) {
        setTimeout(() => {
            this.drag.init(elem.nativeElement);
        }, 0);
    }
}
