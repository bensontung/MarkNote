import {Component, Input, OnChanges} from '@angular/core';

import * as marked from 'marked';

@Component({
    selector: 'app-markdown-viewer',
    styleUrls: ['markdown-viewer.component.css'],
    templateUrl: 'markdown-viewer.component.html',
})
export class MarkdownViewerComponent implements OnChanges {
    @Input() model: string;
    html: string;
    debounce: any;
    init: boolean;

    constructor() {
        this.init = false;
    }

    ngOnChanges() {
        if (this.init) {
            if (this.debounce) {
                clearTimeout(this.debounce);
            }
            this.debounce = setTimeout((() => this.render()), 100);
        } else {
            this.render();
            this.init = true;
        }
    }

    render() {
        this.html = (this.model) ? marked(this.model) : '';
    }

}
