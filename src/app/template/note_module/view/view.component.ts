declare const hljs: any;

import {DomSanitizer} from '@angular/platform-browser';
import {Component, OnInit, Inject, Input, NgZone} from '@angular/core';

import * as marked from 'marked';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

    public articleEdit: boolean;
    public article: any;
    public tabs: any;
    public contentMD5: any;

    constructor(
        private zone: NgZone,
        @Inject('db') private db,
        private sanitizer: DomSanitizer,
        @Inject('storage') private storage,
        @Inject('dialog') private dialog,
        @Inject('node') private node,
        @Inject('modalComm') private modalComm,
        @Inject('E_service') private E_service,
        @Inject('actionMessage') private actionMessage,
        @Inject('TreeListViewComm') private TreeListViewComm,
        @Inject('MDEditorViewerComm') private MDEditorViewerComm
    ) {

        this.tabs = [];
        this.contentMD5 = '';

        this.article = {
            id: 0,
            title: '',
            content: '',
            input_time: '',
            update_time: ''
        };

        const this_ = this;
        this.articleEdit = false;

        this.MDEditorViewerComm.editor_save.subscribe((data) => {
            this.save(this_.article, data);
        });

        this.TreeListViewComm.update_article.subscribe((id) => {
            this.select(id);
        });

    }

    ngOnInit() {
    }

    // 监听来自tabs组件的页签激活事件
    onTabActive(id) {
        this.select(id);
    }

    // 监听来自tabs组件的页签关闭事件
    onTabClose(id) {
        this.select(id);
    }

    save(article, content) {
        const content_html = (content) ? marked(content) : '';
        if ( this.node.md5(content) === this.contentMD5) {
            this.actionMessage.goMessage.emit({type: 'warning', message: '未做任何修改'});
            return false;
        }
        const this_ = this;
        const timestamp = new Date().getTime();
        const sql = 'UPDATE _note_article SET content = ? , content_html = ? , update_time = ? WHERE id = ?';
        this_.db.run(sql, [content, content_html, timestamp, article.id], function (err, row) {
            this_.select(article.id);
            this_.zone.run(() => {
                const data: any = {
                    type: 'articleSave',
                    tid: article.tid,
                };
                this_.TreeListViewComm.update_list.emit(data);
            });
            this_.actionMessage.goMessage.emit({type: 'success', message: '保存成功'});
        });
    }

    disposeContentHtml(preview) {
        const this_ = this;
        const a = preview.querySelectorAll('a');
        for (let i = 0; i < a.length; i++) {
            a[i].onclick = function (e: any) {
                const options2 = {
                    type: 'question',
                    title: '要打开这个链接吗',
                    message: `即将访问：${e.target.href}`,
                    buttons: ['cancel', 'ok']
                };
                this_.dialog.showMessageBox(options2, function (res) {
                    if (res === 1) {
                        this_.E_service.shell.openExternal(e.target.href);
                    }
                });
                return false;
            };
        }
        const block = preview.children;
        for (let i = 0; i < block.length; i++) {
            if (block[i].localName === 'pre') {
                hljs.highlightBlock(block[i]);
                const lineNumber = block[i].querySelector('code.hljs.hljs-line-numbers');
                if (lineNumber) {
                    block[i].removeChild(lineNumber);
                }
                hljs.lineNumbersBlock(block[i].querySelector('code'));
            }
        }
    }

    select(id) {
        const this_ = this;
        if (id === 0) {
            this.article = {
                id: 0,
                title: '',
                content: '',
                input_time: '',
                update_time: ''
            };
            return false;
        }
        this_.db.get('SELECT * FROM _note_article WHERE id = ?', id, function (err, row) {
            this_.zone.run(() => {
                this_.article = row;
                this_.contentMD5 = this_.node.md5(row.content);
                setTimeout(() => {
                    const preview = document.getElementById('preview');
                    this_.disposeContentHtml(preview);
                }, 0);
            });
        });
    }

}
