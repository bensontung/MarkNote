import {Component, OnInit, Inject, NgZone} from '@angular/core';
import {TreeListViewComm} from '../../../service/treeListViewComm';

import * as marked from 'marked';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: [TreeListViewComm]
})
export class ListComponent implements OnInit {

    public menu: any;
    public Zone: any;
    public keys: string;
    public listData: any;
    public renameEdit: any;
    public list_active: any;
    public renameType: string;
    public activeTitle: string;
    public active_tid: number;
    public active_schKeys: number;
    public active_rename: string;

    constructor(
        zone: NgZone,
        @Inject('substr') private substr,
        @Inject('db') private db,
        @Inject('E_service') private E_service,
        @Inject('TreeListViewComm') private TreeListViewComm,
        @Inject('actionMessage') private actionMessage,
        @Inject('storage') private storage,
    ) {

        this.Zone = zone;
        this.keys = '';
        this.renameEdit = [];
        this.listData = [];
        this.list_active = [];
        this.renameType = 'blur';
        this.TreeListViewComm.update_list.subscribe((data) => {
            this.select(data.tid, data.type);
        });
    }

    ngOnInit() {

    }


    /**
     * pushNoteViewTabs
     * push内容页签
     *
     * @param {number} id 关联文章的页签ID
     * @param {string} title 关联文章的页签标题
     *
     * @access public
     * @since 1.0
     * @return void
     */

    pushNoteViewTabs(id, title) {

        function findElem(arrayToSearch, attr, val) {
            for (let i = 0; i < arrayToSearch.length; i++) {
                if (arrayToSearch[i][attr] === val) {
                    return i;
                }
            }
            return -1;
        }

        let noteViewTabs = this.storage.get_obj('noteViewTabs');
        const tab = {id: id, title: title};

        if (noteViewTabs && noteViewTabs.length > 0) {


            if (findElem(noteViewTabs, 'id', id) > -1) {
                return false;
            }

            const limit = 5;
            const start = noteViewTabs.length - limit;
            const count = noteViewTabs.length;
            noteViewTabs = count > limit ? noteViewTabs.splice(start, count) : noteViewTabs;
            noteViewTabs.push(tab);
            this.storage.put_obj('noteViewTabs', noteViewTabs);
            this.TreeListViewComm.update_tabs.emit();
        } else {
            noteViewTabs = [];
            noteViewTabs.push(tab);
            this.storage.put_obj('noteViewTabs', noteViewTabs);
            this.TreeListViewComm.update_tabs.emit();
        }

    }


    /**
     * autoCompleter
     * sch自动完成
     *
     * @param {object} event 当前元素对象
     * @param {string} keys 当前搜索的关键字
     *
     * @access public
     * @since 1.0
     * @return void
     */

    autoCompleter(event, keys) {

        const this_ = this;

        if (((
            event.keyCode >= 36 && event.keyCode <= 99) ||
            (event.keyCode >= 101 && event.keyCode <= 103) ||
            event.keyCode === 144 ||
            event.keyCode === 32 ||
            event.keyCode === 8 ||
            (event.keyCode >= 186 && event.keyCode <= 222)) && keys.length > 0 && keys !== ' '
        ) {

            let t: any = '';

            t = setTimeout(() => {
                keys = `"%${keys}%"`;
                const sql = `SELECT * FROM _note_article WHERE title LIKE ${keys} LIMIT 0,10`;
                this_.db.all(sql, function (err, row) {
                    this_.Zone.run(() => {
                        this_.listData = this_.transDes(row);
                        t = '';
                    });
                });
            }, 0);

        } else if (keys.length === 0 && this_.active_schKeys !== keys) {
            this_.select(this_.active_tid, 'serach');
        }

        this_.active_schKeys = keys;

    }


    /**
     * removeHTMLTag
     * 过滤html标签为纯文本
     *
     * @param {string} str 需要过滤的包含html的字符串
     *
     * @access public
     * @since 1.0
     * @return void
     */

    removeHTMLTag(str) {
        str = str.replace(/<\/?[^>]*>/g, '');
        str = str.replace(/[ | ]*\n/g, '\n');
        str = str.replace(/\n[\s| | ]*\r/g, '\n');
        str = str.replace(/&nbsp;/ig, '');
        str = str.replace(/ /ig, '');
        return str;
    }

    /**
     * transDes
     * 将markdown内容转换为并剔除html标签获取纯文本做为摘要
     *
     * @param {object} row 传递过来的需要操作的article的关键数组帧
     *
     * @access public
     * @since 1.0
     * @return void
     */

    transDes(row) {

        let i = 0;

        row.forEach(v => {
            row[i].des = v.content_html ? this.removeHTMLTag(v.content_html) : '';
            row[i].des = this.substr.init(row[i].des, 56);
            i++;
        });

        return row;

    }

    /**
     * select
     * 更新文章列表
     * @param {object} id 传递过来的需要操作的article的关键数组帧
     * @param {string} type 更新的类型
     * @access public
     * @since 1.0
     * @return void
     */

    select(id, type = '') {
        const this_      = this;
        this_.active_tid = id;
        const sql = 'SELECT id, title, content_html, tid, input_time FROM _note_article WHERE tid = ? ORDER BY input_time DESC';
        this_.db.all(sql, id, function (err, row) {
            this_.Zone.run(() => {
                this_.listData = this_.transDes(row);
                if (type === 'created') {
                    this_.dblRename(this_.listData[0]);
                }
            });
        });
    }

    /**
     * listSelectd
     * 选择list激活相应的view组件的事件
     *
     * @param {object} v 传递过来的需要操作的article的关键数组帧
     *
     * @access public
     * @since 1.0
     * @return void
     */

    listSelectd(v) {
        if (this.list_active[v.id] !== true) {
            this.pushNoteViewTabs(v.id, v.title);
            this.list_active = [];
            this.list_active[v.id] = true;
            this.TreeListViewComm.update_article.emit(v.id);
        }
    }

    /**
     * renameArticle
     * 日记重命名
     *
     * @param {object} v 传递过来的需要操作的article的关键数组帧
     *
     * @access public
     * @since 1.0
     * @return void
     */

    renameArticle(event, type, v) {

        const this_ = this;

        if (type === 'keyup' && event.key === 'Enter') {
            this.renameType = 'Enter';
        }

        if (type === 'blur' && this.renameType === 'Enter') {
            this.renameType = 'blur';
            return false;
        }

        if ((type === 'keyup' && event.key === 'Enter') || type === 'blur') {

            if (v.title.length > 0 && v.title !== ' ' && v.title !== this_.active_rename) {
                this_.db.run('UPDATE _note_article SET title = ? WHERE id = ?', [v.title, v.id], function (err, row) {
                    this_.Zone.run(() => {
                        this_.actionMessage.goMessage.emit({type: 'success', message: '笔记更名成功!'});
                        this_.TreeListViewComm.rename_tabs.emit({id: v.id, title: v.title});
                    });
                });
            } else if (v.title === ' ' || v.title.length === 0 || v.title === this_.active_rename) {
                this_.db.get('SELECT title FROM _note_article WHERE id = ?', v.id, function (err, row) {
                    this_.Zone.run(() => {
                        v.title = row.title;
                    });
                });
            }

            this.renameEdit[v.id] = false;
        }
    }

    /**
     * dblRename
     * 双击重命名
     *
     * @param {object} v 传递过来的需要操作的article的关键数组帧
     *
     * @access public
     * @since 1.0
     * @return void
     */

    dblRename(v) {
        this.renameEdit[v.id] = true;
        this.active_rename = v.title;
        setTimeout(() => {
            document.getElementById('listRenameInput_' + v.id).focus();
        }, 0);
    }

    /**
     * deleteArticle
     * 删除日记
     *
     * @param {object} v 传递过来的需要操作的article的关键数组帧
     *
     * @access public
     * @since 1.0
     * @return void
     */

    deleteArticle(v) {
        const this_ = this;
        this_.db.run('DELETE FROM _note_article WHERE id = ?', v.id, function (err, row) {
            this_.select(v.tid);
            this_.tabsRemove(v.id);
            this_.Zone.run(() => {
                this_.TreeListViewComm.update_tree.emit();
                this_.TreeListViewComm.update_article.emit(0);
                this_.actionMessage.goMessage.emit({type: 'success', message: '笔记删除成功!'});
            });
        });
    }

    /**
     * contextMenuTeam
     * 右键菜单的事件处理
     *
     * @param {object} event dom值
     * @param {object} v 传递过来的需要操作的tree
     * @param {string} type tree的类型
     *
     * @access public
     * @since 1.0
     * @return object
     */

    contextMenuTeam(event, v, type) {

        const this_ = this;
        this.menu   = new this.E_service.remote.Menu();

        /**
         * 日记命名
         */

        this.menu.append(new this.E_service.remote.MenuItem({
            role: 'renameArticle', label: '重命名', click() {
                this_.Zone.run(() => {
                    this_.renameEdit[v.id] = true;
                    this_.active_rename    = v.title;
                });
                document.getElementById('listRenameInput_' + v.id).focus();
            }
        }));

        this.menu.append(new this.E_service.remote.MenuItem({type: 'separator'}));

        /**
         * 删除日记
         */

        this.menu.append(new this.E_service.remote.MenuItem({
            role: 'deleteArticle', label: '删除日记', click() {
                this_.Zone.run(() => {
                    this_.deleteArticle(v);
                });
            }
        }));

        return this.menu;

    }

    contextMenu(event, v, type) {
        event.stopPropagation();
        this.contextMenuTeam(event, v, type).popup(this.E_service.remote.getCurrentWindow());
    }

    tabsRemove(id) {
        let noteViewTabs = this.storage.get_obj('noteViewTabs');
        const delItem = [id];
        noteViewTabs = noteViewTabs.filter(item => {
            return !delItem.includes(item.id);
        });

        this.storage.put_obj('noteViewTabs', noteViewTabs);
    }

}
