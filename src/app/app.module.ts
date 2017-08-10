import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule } from '@angular/http';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {AppRouter} from './template/app.router';
import {AppComponent} from './template/app.component';
import {HeaderComponent} from './template/common/header/header.component';
import {ActionMessageComponent} from './template/common/action-message/action-message.component';



import {GuardService} from './service/guard.service';

import {NService} from './service/n.service';
import {DragService, SubstrService} from './service/tools.service';
import {ElectronService} from './service/electron';
import {DialogService} from './service/dialog';
import {DBService} from './service/sqlite3';
import {NodeService} from './service/node';
import {LocalStorageService} from './service/local-storage.service';

import {TreeListViewComm} from './service/treeListViewComm';

import {ActionMessageComm} from './service/action-message_comm';

import {AppModalDirective} from './template/common/modal/modal.directive';

import {ModalComm} from './service/modal.comm';
import {ModalComponent} from './template/common/modal/modal.component';

import {SearchComponent} from './template/common/search/search.component';
import {SettingComponent} from './template/common/setting/setting.component';

import {SuperLinkComponent} from './template/common/markdown/markdown-editor/markdown-editor-modal/super-link/super-link.component';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(AppRouter, { preloadingStrategy: PreloadAllModules })
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        ActionMessageComponent,
        ModalComponent,
        SearchComponent,
        AppModalDirective,
        SuperLinkComponent,
        SettingComponent
    ],
    providers: [
        GuardService,
        {provide: 'storage', useClass: LocalStorageService},
        {provide: 'N_service', useClass: NService},
        {provide: 'drag', useClass: DragService},
        {provide: 'E_service', useClass: ElectronService},
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: 'db', useClass: DBService},
        {provide: 'node', useClass: NodeService},
        {provide: 'dialog', useClass: DialogService},
        {provide: 'actionMessage', useClass: ActionMessageComm},
        {provide: 'modalComm', useClass: ModalComm},
        {provide: 'substr', useClass: SubstrService},
        {provide: 'TreeListViewComm', useClass: TreeListViewComm}
    ],
    entryComponents: [
        SearchComponent,
        SuperLinkComponent,
        SettingComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
