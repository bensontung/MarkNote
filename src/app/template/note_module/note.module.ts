import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DefaultComponent} from './default/default.component';
import {TreeComponent} from './tree/tree.component';
import {NoteRouter} from './note.router';
import {FormsModule} from '@angular/forms';
import {ListComponent} from './list/list.component';
import {ViewComponent} from './view/view.component';

import {ViewTabsComponent} from './view/view-tabs/view-tabs.component';

import {TreeListViewComm} from '../../service/treeListViewComm';
import {MDEditorViewerComm} from '../../service/mdEditorViewer';

import {UseSystemBrowserDirective} from '../../directive/useSystemBrowser.directive';

import {MarkdownEditorComponent} from '../common/markdown/markdown-editor/markdown-editor.component';
import {MarkdownViewerComponent} from '../common/markdown/markdown-viewer/markdown-viewer.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(NoteRouter)
    ],
    declarations: [
        DefaultComponent,
        TreeComponent,
        ListComponent,
        ViewComponent,
        ViewTabsComponent,
        MarkdownEditorComponent,
        MarkdownViewerComponent,
        UseSystemBrowserDirective
    ],
    providers: [
        {provide: 'TreeListViewComm', useClass: TreeListViewComm},
        {provide: 'MDEditorViewerComm', useClass: MDEditorViewerComm}
    ]
})

export class NoteModule {
}
