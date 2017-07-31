import {Component, OnInit, Inject, NgZone} from '@angular/core';
import {RecursionTree} from '../../../service/recursionTree';
import {TreeListViewComm} from '../../../service/treeListViewComm';

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.css'],
    providers: [RecursionTree, TreeListViewComm]
})
export class TreeComponent implements OnInit {

    public menu: any;
    public treeListData: any;
    private RecursionTree: any;
    public Zone: any;
    public renameEdit: any;
    public renameValue: any;
    public v2_open: any;
    public v3_open: any;
    public v4_open: any;
    public v5_open: any;
    public tree_active;
    public renameType: string;
    public active_rename: string;

    constructor(
        public zone: NgZone,
        public recursionTree: RecursionTree,
        @Inject('db') private db,
        @Inject('E_service') private E_service,
        @Inject('dialog') private dialog,
        @Inject('actionMessage') private actionMessage,
        @Inject('TreeListViewComm') private TreeListViewComm
    ) {
        this.Zone = zone;
        this.tree_active = [];
        this.E_service = E_service;
        this.renameEdit = [];
        this.renameValue = [];
        this.v2_open = [];
        this.v3_open = [];
        this.v4_open = [];
        this.v5_open = [];
        this.renameType = 'blur';
        this.RecursionTree = recursionTree;
        this.active_rename = '';

        this.TreeListViewComm.update_tree.subscribe(() => {
            this.select('update');
        });

    }

    /**
     * select
     * tree查询更新dom
     *
     * @access public
     * @since 1.0
     * @return void
     */

    select(type) {
        const this_ = this;
        const sql = 'SELECT id,name,pid,def,(SELECT COUNT(*) FROM _note_article WHERE tid = _note_tree.id) as counts FROM _note_tree';
        this_.db.all(sql, function (err, row) {
            this_.treeListData = this_.RecursionTree.init(row);
            this_.Zone.run(() => {
                if (type === 'created') {
                    this_.dblRename(row[row.length - 1]);
                }
            });
        });
    }

    /**
     * treeSelectd
     * 选择tree激活相应的list与view组件的事件
     *
     * @param {object} v 传递过来的需要操作的tree的关键数组帧
     *
     * @access public
     * @since 1.0
     * @return void
     */

    treeSelectd(v) {
        if (this.tree_active[v.id] !== true) {
            this.tree_active = [];
            this.tree_active[v.id] = true;

            const data: any = {
                type: 'selectd',
                tid: v.id,
            };

            this.TreeListViewComm.update_list.emit(data);
        }
    }

    /**
     * ngOnInit
     * tree组件的生成周期初始化
     *
     * @access public
     * @since 1.0
     * @return void
     */

    ngOnInit() {
        this.select('init');
    }

    /**
     * createdNote
     * 创建笔记
     *
     * @access public
     * @since 1.0
     * @return void
     */

    createdNote(v) {
        const this_ = this;
        const timestamp = new Date().getTime();
        const sql = 'INSERT INTO _note_article (tid, title, content, content_html, input_time, update_time) VALUES (?, ?, ?, ?, ?, ?)';
        this_.db.run(sql, [v.id, v.name + '-临时标题', '临时笔记', '临时笔记', timestamp, timestamp], function (err, row) {
            this_.select('update');
            this_.Zone.run(() => {

                const data: any = {
                    type: 'created',
                    tid: v.id
                };

                this_.TreeListViewComm.update_list.emit(data);
                this_.actionMessage.goMessage.emit({type: 'success', message: '笔记创建成功!'});
            });
        });
    }

    /**
     * createdTree
     * 创建tree
     *
     * @param {object} v 传递过来的需要操作的tree的关键数组帧
     *
     * @access public
     * @since 1.0
     * @return void
     */

    createdTree(v) {
        const this_ = this;
        this_.db.run('INSERT INTO _note_tree (name, pid, def) VALUES (?, ?, ?)', ['临时分类', v.id, 1], function (err, row) {
            this_.select('created');
            this_.Zone.run(() => {
                this_.actionMessage.goMessage.emit({type: 'success', message: '分类创建成功!'});
            });
        });
    }

    /**
     * dblRename
     * 双击单个tree的名称时，进入tree重命名状态
     *
     * @param {object} v 传递过来的需要操作的tree的关键数组帧
     *
     * @access public
     * @since 1.0
     * @return void
     */

    dblRename(v) {
        this.renameEdit[v.id] = true;
        this.active_rename = v.name;
        setTimeout(() => {
            document.getElementById('treeRenameInput_' + v.id).focus();
        });
    }

    /**
     * renameTree
     * tree重名命名后的处理
     *
     * @param {object} event dom值
     * @param {string} type 发过来的事件类型
     * @param {object} v 传递过来的需要操作的tree的关键数组帧
     *
     * @access public
     * @since 1.0
     * @return void
     */

    renameTree(event, type, v) {

        const this_ = this;

        if (type === 'keyup' && event.key === 'Enter') {
            this.renameType = 'Enter';
        }

        if (type === 'blur' && this.renameType === 'Enter') {
            this.renameType = 'blur';
            return false;
        }

        if ((type === 'keyup' && event.key === 'Enter') || type === 'blur') {

            if (v.name.length > 0 && v.name !== ' ' && v.name !== this_.active_rename) {
                this_.db.run('UPDATE _note_tree SET name = ? WHERE id = ?', [v.name, v.id], function (err, row) {
                    this_.select('update');
                    this_.Zone.run(() => {
                        this_.actionMessage.goMessage.emit({type: 'success', message: '分类更名成功!'});
                    });
                });
            } else if (v.name === ' ' || v.name.length === 0 || v.name === this_.active_rename) {
                v.name = this_.active_rename;
                this_.active_rename = '';
            }

            this.renameEdit[v.id] = false;

        }
    }

    /**
     * deleteTree
     * 删除tree, 先判断当前分类下是否有子分类，若是没有的话再判断是否有笔记，若是都没有的话就执行删除当前分类
     *
     * @param {object} v 传递过来的需要操作的tree的关键数组帧
     *
     * @access public
     * @since 1.0
     * @return void
     */

    deleteTree(v) {
        const this_ = this;

        this_.db.get('SELECT COUNT(*) FROM _note_tree WHERE pid = ?', v.id, function (err1, row1) {
            if (row1['COUNT(*)'] > 0) {
                this_.Zone.run(() => {
                    this_.actionMessage.goMessage.emit({type: 'warning', message: '当前分类下有子分类，删除失败1!'});
                });
            } else {
                this_.db.get('SELECT COUNT(*) FROM _note_article WHERE tid = ?', v.id, function (err2, row2) {
                    if (row2['COUNT(*)'] > 0) {
                        this_.Zone.run(() => {
                            this_.actionMessage.goMessage.emit({type: 'warning', message: '当前分类下有笔记，删除失败!'});
                        });
                    } else {
                        const options2 = {
                            type: 'question',
                            title: '询问',
                            message: '真的要删除这个分类吗？',
                            buttons: ['cancel', 'ok']
                        };
                        this_.dialog.showMessageBox(options2, function (res) {

                            if (res === 1) {
                                this_.db.run('DELETE FROM _note_tree WHERE id = ?', v.id, function () {
                                    this_.Zone.run(() => {
                                        this_.select('delete');
                                        this_.actionMessage.goMessage.emit({type: 'success', message: '分类删除成功!'});
                                    });
                                });
                            }

                        });
                    }
                });
            }
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
        const enabled_status = type === 'default' ? false : true;
        this.menu = new this.E_service.remote.Menu();

        if (type !== 'last') {

            /**
             * 新建笔记
             */

            this.menu.append(new this.E_service.remote.MenuItem({
                role: 'createdNote', label: '新建笔记', enabled: true, click() {
                    this_.createdNote(v);
                }
            }));

            /**
             * 新建子分类
             */

            this.menu.append(new this.E_service.remote.MenuItem({
                role: 'createdTree', label: '新建子分类', enabled: true, click() {
                    this_.createdTree(v);
                }
            }));
            this.menu.append(new this.E_service.remote.MenuItem({type: 'separator'}));
        }

        /**
         * 分类命名
         */

        this.menu.append(new this.E_service.remote.MenuItem({
            role: 'renameTree', label: '分类命名', enabled: enabled_status, click() {
                this_.Zone.run(() => {
                    this_.renameEdit[v.id] = true;
                });
                document.getElementById('treeRenameInput_' + v.id).focus();
            }
        }));
        this.menu.append(new this.E_service.remote.MenuItem({type: 'separator'}));

        /**
         * 删除分类
         */

        this.menu.append(new this.E_service.remote.MenuItem({
            role: 'deleteTree', label: '删除分类', enabled: enabled_status, click() {
                this_.deleteTree(v);
            }
        }));

        return this.menu;

    }

    /**
     * contextMenu
     * tree的右键打开菜单事件
     *
     * @param {object} event dom值
     * @param {object} v 传递过来的需要操作的tree
     * @param {string} type tree的类型
     *
     * @access public
     * @since 1.0
     * @return void
     */

    contextMenu(event, v, type) {
        event.stopPropagation();
        this.treeSelectd(v);
        this.contextMenuTeam(event, v, type).popup(this.E_service.remote.getCurrentWindow());
    }

}
