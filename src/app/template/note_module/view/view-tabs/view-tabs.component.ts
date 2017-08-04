import {Component, OnInit, Inject, Output, EventEmitter, Input, NgZone} from '@angular/core';

@Component({
    selector: 'app-view-tabs',
    templateUrl: './view-tabs.component.html',
    styleUrls: ['./view-tabs.component.css']
})

export class ViewTabsComponent implements OnInit {

    public anime: any;

    public menu: any;
    public tabs: any;
    public tabActiveId: number;
    @Input() activeId: number;
    @Output() tabActiveOut: EventEmitter<any> = new EventEmitter<any>();
    @Output() tabCloseOut: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private zone: NgZone,
        @Inject('node') private node,
        @Inject('storage') private storage,
        @Inject('TreeListViewComm') private TreeListViewComm,
        @Inject('E_service') private E_service
    ) {

        this.tabActiveId = 0;

        this.TreeListViewComm.update_tabs.subscribe(() => {
            this.select();
        });

        this.TreeListViewComm.rename_tabs.subscribe((data) => {
            this.tabRename(data);
        });

    }

    ngOnInit() {
        this.select();
    }

    select() {
        this.tabs = this.storage.get_obj('noteViewTabs');
    }

    tabActive(id) {

        event.stopPropagation();

        if (id === this.activeId) {
            return false;
        }

        this.tabActiveId = id;
        this.tabActiveOut.emit(id);
        this.select();

    }

    tabClose(v) {

        if (event) {
            event.stopPropagation();
        }

        let noteViewTabs = this.storage.get_obj('noteViewTabs');
        const delItem    = [v.id];
        noteViewTabs     = noteViewTabs.filter(item => {
            return !delItem.includes(item.id);
        });


        if (v.id === this.activeId && noteViewTabs && noteViewTabs.length > 0) {
            const id = noteViewTabs[noteViewTabs.length - 1].id;
            this.tabCloseOut.emit(id);
        }

        this.storage.put_obj('noteViewTabs', noteViewTabs);

        if (event) {
            this.select();
        }

    }

    tabRename(data) {
        const noteViewTabs              = this.storage.get_obj('noteViewTabs');
        const activeIndex               = this.node.R.findIndex(this.node.R.propEq('id', data.id))(noteViewTabs);
        if (activeIndex === -1) {
            return false;
        }
        noteViewTabs[activeIndex].title = data.title;
        this.storage.put_obj('noteViewTabs', noteViewTabs);
        this.select();
    }

    /**
     * contextMenuTeam
     * 右键菜单的事件处理
     *
     * @param {array} noteViewTabs 页签数组
     *
     * @access public
     * @since 1.0
     * @return object
     */

    contextMenuTeam(noteViewTabs, v, index) {

        let closeTab      = true;
        let closeOtherTab = true;
        let closeRightTab = true;

        if (noteViewTabs.length === 1) {
            closeTab      = false;
            closeOtherTab = false;
            closeRightTab = false;
        }

        if (noteViewTabs.length !== 1 && noteViewTabs.length - 1 === index) {
            closeRightTab = false;
        }

        const this_ = this;
        this.menu   = new this.E_service.remote.Menu();

        /**
         * 关闭页签
         */

        this.menu.append(new this.E_service.remote.MenuItem({
            role: 'closeTab', label: '关闭页签', enabled: closeTab, click() {
                this_.contextMenuTab(noteViewTabs, v, index);
            }
        }));

        this.menu.append(new this.E_service.remote.MenuItem({type: 'separator'}));

        /**
         * 关闭其它页签
         */

        this.menu.append(new this.E_service.remote.MenuItem({
            role: 'closeOtherTab', label: '关闭其它页签', enabled: closeOtherTab, click() {
                this_.contextMenuOtherTab(noteViewTabs, v, index);
            }
        }));

        /**
         * 关闭右侧页签
         */

        this.menu.append(new this.E_service.remote.MenuItem({
            role: 'closeRightTab', label: '关闭右侧页签', enabled: closeRightTab, click() {
                this_.contextMenuCloseRightTab(noteViewTabs, v, index);
            }
        }));

        return this.menu;

    }

    /**
     * contextMenuTab
     * 右键菜单关闭当前页签
     *
     * @param {array} noteViewTabs 页签数组
     * @param {object} v 页签数组
     * @param {number} index 索引
     *
     * @access public
     * @since 1.0
     * @return object
     */

    contextMenuTab(noteViewTabs, v, index) {
        this.tabClose(v);
        this.zone.run(() => {
            this.select();
        });
    }

    /**
     * contextMenuOtherTab
     * 右键菜单关闭其它页签
     *
     * @param {array} noteViewTabs 页签数组
     * @param {object} v 页签数组
     * @param {number} index 索引
     *
     * @access public
     * @since 1.0
     * @return object
     */

    contextMenuOtherTab(noteViewTabs, v, index) {
        this.storage.put_obj('noteViewTabs', [v]);
        this.zone.run(() => {
            this.select();
            this.activeId = v.id;
        });
    }

    /**
     * contextMenuCloseRightTab
     * 右键菜单关闭右侧页签
     *
     * @param {array} noteViewTabs 页签数组
     * @param {object} v 页签数组
     * @param {number} index 索引
     *
     * @access public
     * @since 1.0
     * @return object
     */

    contextMenuCloseRightTab(noteViewTabs, v, index) {

        const tabsLength      = noteViewTabs.length;
        const removeCount     = ( tabsLength - index + 1 );
        const newNoteViewTabs = this.node.R.remove(index + 1, removeCount, noteViewTabs);
        const activeIndex     = this.node.R.findIndex(this.node.R.propEq('id', this.activeId))(newNoteViewTabs);

        this.storage.put_obj('noteViewTabs', newNoteViewTabs);

        this.zone.run(() => {
            this.select();
            this.activeId = activeIndex === -1 ? v.id : this.activeId;
        });

    }

    /**
     * contextMenu
     * 右键菜单创建菜单
     *
     * @param {event} event 右键菜单dom对象
     * @param {object} v 页签数组
     * @param {number} index 索引
     *
     * @access public
     * @since 1.0
     * @return object
     */

    contextMenu(event, v, index) {
        event.stopPropagation();

        const noteViewTabs = this.storage.get_obj('noteViewTabs');

        this.contextMenuTeam(noteViewTabs, v, index).popup(this.E_service.remote.getCurrentWindow());
    }

}
