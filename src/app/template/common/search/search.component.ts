import {Component, OnInit, Inject, Input, Output, EventEmitter, NgZone} from '@angular/core';
import {RecursionTree} from '../../../service/recursionTree';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    providers: [RecursionTree]
})
export class SearchComponent implements OnInit {

    public modal: boolean;
    public RecursionTree: any;
    public treeListData: any;
    public schKeys: string;
    public searchData: any;
    public where: any;
    public search: any;
    @Input() config: any;

    constructor(
        public recursionTree: RecursionTree,
        @Inject('modalComm') private modalComm,
        @Inject('db') private db,
        public zone: NgZone,
        @Inject('storage') private storage,
        @Inject('substr') private substr,
        @Inject('TreeListViewComm') private TreeListViewComm,
    ) {
        this.config = {
            title: '高级搜索',
            header: false,
            mask: false,
            footerButton: false,
            headerClose: true
        };
        this.search = {
            count: 0
        };
        this.RecursionTree = recursionTree;
        this.treeListData = [];
        this.schKeys = '';
        this.searchData = [];
        this.where = {
            title: false,
            content: false
        };
    }

    ngOnInit() {
    }

    removeHTMLTag(str) {
        str = str.replace(/<\/?[^>]*>/g, '');
        str = str.replace(/[ | ]*\n/g, '\n');
        str = str.replace(/\n[\s| | ]*\r/g, '\n');
        str = str.replace(/&nbsp;/ig, '');
        str = str.replace(/ /ig, '');
        return str;
    }

    getSearchContent(arr, key) {
        let i = 0;
        arr.forEach((v) => {

            let title = v.title;
            let titleCount: any = 0;
            let desCount: any = 0;
            if (
                (this.where.title === true && this.where.content === false) ||
                (this.where.title === false && this.where.content === false) ||
                (this.where.title === true && this.where.content === true)
            ) {

                title = title.replace(new RegExp(key, 'g'), `<small>${key}</small>`);
                titleCount = title.match(new RegExp(key, 'g')) || [];
                titleCount = titleCount.length;
            }

            let des = v.content_html ? this.removeHTMLTag(v.content_html) : '';

            const keyIndexStart = des.indexOf(key) > 20 ? des.indexOf(key) - 20 : 0;

            des = des.substring(keyIndexStart, des.length);

            if (
                (this.where.title === false && this.where.content === true) ||
                (this.where.title === false && this.where.content === false) ||
                (this.where.title === true && this.where.content === true)
            ) {
                des = this.substr.init(des.replace(new RegExp(key, 'g'), `<small>${key}</small>`), 250);
                desCount = des.match(new RegExp(key, 'g')) || [];
                desCount = desCount.length;
            }

            arr[i].title = title + ' <em>[' + arr[i].tname + ']</em>';
            arr[i].des = des;
            arr[i].schCount = titleCount + desCount;
            i++;
        });
        return arr;
    }

    selectWhere(type) {
        if (this.schKeys !== '') {
            this.keysSelect(this.schKeys);
        }
    }

    goToSchNote(id, title) {
        title = this.removeHTMLTag(title);
        this.TreeListViewComm.update_article.emit(id);
        this.pushNoteViewTabs(id, title);
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

    keysSelect(schKeys) {

        const this_ = this;
        this.schKeys = schKeys;
        const sourceKey = schKeys;

        let t: any = '';

        t = setTimeout(() => {
            schKeys = `"%${schKeys}%"`;
            const tname = '(SELECT name FROM _note_tree WHERE id = _note_article.tid) as tname';
            let sql = `SELECT id,title,content_html,${tname} FROM _note_article
             WHERE title LIKE ${schKeys} OR content LIKE ${schKeys} LIMIT 0,20`;

            if (this_.where.title === true && this_.where.content === false) {
                sql = `SELECT id,title,content_html,${tname} FROM _note_article WHERE title LIKE ${schKeys} LIMIT 0,20`;
            }

            if (this_.where.content === true && this_.where.title === false) {
                sql = `SELECT id,title,content_html,${tname} FROM _note_article WHERE content LIKE ${schKeys} LIMIT 0,20`;
            }

            if (this_.where.title === true && this_.where.content === true) {
                sql = `SELECT id,title,content_html,${tname} FROM _note_article
                 WHERE title LIKE ${schKeys} AND content LIKE ${schKeys} LIMIT 0,20`;
            }

            this_.db.all(sql, function (err, row) {
                this_.zone.run(() => {
                    row = this_.getSearchContent(row, sourceKey);
                    this_.searchData = row;
                    this_.search.count = row.length;
                    t = '';
                });
            });
        }, 0);
    }

    schFn(event, schKeys) {
        if (((
                event.keyCode >= 36 && event.keyCode <= 99) ||
                (event.keyCode >= 101 && event.keyCode <= 103) ||
                event.keyCode === 144 ||
                event.keyCode === 32 ||
                event.keyCode === 8 ||
                (event.keyCode >= 186 && event.keyCode <= 222)) && schKeys.length > 0 && schKeys !== ' '
        ) {
            this.keysSelect(schKeys);
        } else if (schKeys.length === 0) {
            this.searchData = [];
            this.search.count = 0;
        }
    }

    close() {
        this.config.modal = false;
        this.modalComm.remove.emit();
    }

}
