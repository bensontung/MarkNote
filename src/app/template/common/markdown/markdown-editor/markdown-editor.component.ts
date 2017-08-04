import {Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, NgZone, Inject} from '@angular/core';

import {SuperLinkComponent} from '../markdown-editor/markdown-editor-modal/super-link/super-link.component';

@Component({
    selector: 'app-markdown-editor',
    styleUrls: ['markdown-editor.component.css'],
    templateUrl: 'markdown-editor.component.html',
})
export class MarkdownEditorComponent implements OnInit, OnDestroy {
    @Input() model: string;
    @Output() modelChange = new EventEmitter<string>();
    @ViewChild('editArea') editArea: any;
    public sendDatasSubscription: any;
    preview = false;
    public Zone: any;

    constructor(
        public zone: NgZone,
        @Inject('MDEditorViewerComm') private MDEditorViewerComm,
        @Inject('modalComm') private modalComm,
        @Inject('E_service') private E_service,
        @Inject('node') private node
    ) {
        this.Zone = zone;
    }

    ngOnInit() {
    }

    getSelection() {
        this.model = this.model || '';
        const start = this.editArea.nativeElement.selectionStart;
        const end = this.editArea.nativeElement.selectionEnd;
        return {
            start: start,
            end: end,
            text: this.model.substring(start, end),
            length: end - start
        };
    }

    getSelectionLength() {
        const start = this.editArea.nativeElement.selectionStart;
        const end = this.editArea.nativeElement.selectionEnd;
        return end - start;
    }

    setSelection(left: number, length: number) {
        const s = this.editArea.nativeElement;
        s.focus();
        setTimeout(() => {
            s.selectionStart = left;
            s.selectionEnd = left + length;
        });
    }

    removeEmptyArrayEle(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === undefined || arr[i] === '') {
                arr.splice(i, 1);
                i = i - 1;
            }
        }
        return arr;
    };

    replaceSelection(newText) {
        const selection = this.getSelection();
        newText = newText.replace('${text}', selection.text);
        this.model = `${this.model.substring(0, selection.start)}${newText}${this.model.substring(selection.end)}`;
        this.modelChange.emit(this.model);
        this.setSelection(selection.start, newText.length);
    }

    insertText(newText) {
        const selection = this.getSelection();
        this.model = `${this.model.substring(0, selection.start)}${newText}${this.model.substring(selection.start)}`;
        this.modelChange.emit(this.model);
        this.setSelection(selection.start, newText.length);
    }

    shortcut(event) {

        if (event.keyCode === 9 && event.ctrlKey === false && event.shiftKey === false) {

            event.preventDefault();

            if (this.getSelectionLength()) {
                let newText = '';
                const arr = this.getSelection().text.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    let enter = '\n';
                    if (i === arr.length - 1) {
                        enter = '';
                    }
                    newText += '    ' + arr[i] + enter;
                }
                this.replaceSelection(newText);
            } else {
                this.insertText('    ');
            }

        } else if ((event.keyCode === 9 && event.ctrlKey === true) || (event.keyCode === 9 && event.shiftKey === true)) {

            event.preventDefault();

            let newText = '';
            const arr = this.getSelection().text.split('\n');
            for (let i = 0; i < arr.length; i++) {
                const tempText = arr[i].replace('    ', '');
                newText += tempText + '\n';
            }
            newText = newText.substring(0, newText.length - 1);
            this.replaceSelection(newText);

        } else if (event.keyCode === 83 && event.ctrlKey === true) {

            const model = this.model || '';

            this.MDEditorViewerComm.editor_save.emit(model);
        }

    }

    onEditor(param) {
        switch (param) {
            case 'bold':
                if (this.getSelectionLength()) {

                    let newText = '';
                    const arr = this.removeEmptyArrayEle(this.getSelection().text.split('\n'));
                    const tab = arr.length > 1 ? '  ' : '';
                    for (let i = 0; i < arr.length; i++) {
                        let enter = '\n';
                        if (i === arr.length - 1) {
                            enter = '';
                        }
                        newText += '**' + arr[i] + '**' + tab + enter;
                    }
                    this.replaceSelection(newText);

                } else {
                    this.insertText('**bold**');
                }
                break;
            case 'italic':
                if (this.getSelectionLength()) {

                    let newText = '';
                    const arr = this.removeEmptyArrayEle(this.getSelection().text.split('\n'));
                    const tab = arr.length > 1 ? '  ' : '';
                    for (let i = 0; i < arr.length; i++) {
                        let enter = '\n';
                        if (i === arr.length - 1) {
                            enter = '';
                        }
                        newText += '_' + arr[i] + '_' + tab + enter;
                    }

                    this.replaceSelection(newText);

                } else {
                    this.insertText('_italic_');
                }
                break;
            case 'underline':
                if (this.getSelectionLength()) {

                    let newText = '';
                    const arr = this.removeEmptyArrayEle(this.getSelection().text.split('\n'));

                    const tab = arr.length > 1 ? '  ' : '';

                    for (let i = 0; i < arr.length; i++) {
                        let enter = '\n';
                        if (i === arr.length - 1) {
                            enter = '';
                        }
                        newText += '<u>' + arr[i] + '</u>' + tab + enter;
                    }

                    this.replaceSelection(newText);

                } else {
                    this.insertText('_underline_');
                }
                break;
            case 'code':
                if (this.getSelectionLength()) {
                    let newText = '';
                    const arr = this.removeEmptyArrayEle(this.getSelection().text.split('\n'));

                    const tab = arr.length > 1 ? '  ' : '';

                    for (let i = 0; i < arr.length; i++) {
                        let enter = '\n';
                        if (i === arr.length - 1) {
                            enter = '';
                        }
                        newText += '`' + arr[i] + '`' + tab + enter;
                    }

                    this.replaceSelection(newText);
                } else {
                    this.insertText('`code`');
                }
                break;
            case 'codeblock':
                if (this.getSelectionLength()) {
                    this.replaceSelection('\n```\n${text}\n```\n');
                } else {
                    this.insertText('\n```\ncode block\n```\n');
                }
                break;
            case 'quote':
                const sel = this.getSelection();
                if (sel.length) {

                    let newText = '';
                    const arr = this.removeEmptyArrayEle(this.getSelection().text.split('\n'));
                    const tab = arr.length > 1 ? '  ' : '';

                    for (let i = 0; i < arr.length; i++) {
                        let enter = '\n';
                        if (i === arr.length - 1) {
                            enter = '';
                        }
                        newText += '> ' + arr[i] + tab + enter;
                    }

                    this.replaceSelection('\n' + newText + '\n');

                } else {
                    this.insertText('> quote paragraph 1\n\n> quote paragraph 2');
                }
                break;
            case 'strikethrough':
                if (this.getSelectionLength()) {
                    let newText = '';
                    const arr = this.removeEmptyArrayEle(this.getSelection().text.split('\n'));
                    const tab = arr.length > 1 ? '  ' : '';

                    for (let i = 0; i < arr.length; i++) {
                        let enter = '\n';
                        if (i === arr.length - 1) {
                            enter = '';
                        }
                        newText += '~~' + arr[i] + '~~' + tab + enter;
                    }

                    this.replaceSelection(newText);
                } else {
                    this.insertText('~~strikethrough~~');
                }
                break;
            case 'hr':
                this.insertText('\n\n------\n');
                break;
            case 'list':
                this.insertText('\n* Item\n');
                break;
            case 'list-2':
                this.insertText('\n1. Item\n');
                break;
            case 'header':
                this.insertText('\n# Header\n');
                break;
            case 'url':
                this.insertSuperLink();
                // this.insertText('[link text](url)');
                break;
            case 'img':
                // this.insertText('![alt text](url)');
                this.insertImages();
                break;
            case 'table':
                const table = `|field1|field2|field3|  \n|---|---|---|  \n|***|***|***|  \n`;
                this.insertText(table);
                break;
        }
    }

    insertSuperLink() {
        this.modalComm.insert.emit(SuperLinkComponent);
        this.sendDatasSubscription = this.modalComm.sendDatas.subscribe((data) => {
            if (data.type === 'superLink') {
                const newText = `[${this.getSelection().text}](${data.url})`;
                this.replaceSelection(newText);
                this.sendDatasSubscription.unsubscribe();
            }
        });
    }


    insertImages() {
        const options = {
            title: '选择插入的图片',
            filters: [
                {name: 'Images', extensions: ['jpg', 'png', 'gif']}
            ],
            properties: ['multiSelections']
        };

        this.E_service.remote.dialog.showOpenDialog(options, res => {

            if (res) {

                let imagesPathArr = res;
                const limit = 10;
                imagesPathArr = imagesPathArr.length > limit ? imagesPathArr.splice(0, limit) : imagesPathArr;

                let imageText_Str = '';
                let imageUrls_Str = '';

                for (let i = 0; i < imagesPathArr.length; i++) {

                    const filePath     = imagesPathArr[i];
                    const fileInfo     = this.node.path.parse(filePath);
                    const fileExt      = fileInfo.ext;
                    const fileName     = fileInfo.name;
                    const newFileName  = String(new Date().getTime()) + i;
                    const newfilePath  = `${this.node.baseConfig.path.attached}${newFileName}${fileExt}`;
                    const attachedPath = `${this.node.baseConfig.url}attached/${newFileName}${fileExt}`;

                    const readStream   =  this.node.fs.createReadStream(filePath);
                    const writeStream  =  this.node.fs.createWriteStream(newfilePath);
                    imageText_Str += `![${fileName}][${newFileName}] \n`;
                    imageUrls_Str += `[${newFileName}]: ${attachedPath} "${fileName}" \n`;

                    readStream.on('data', function(chunk) { // 当有数据流出时，写入数据
                        if (writeStream.write(chunk) === false) { // 如果没有写完，暂停读取流
                            readStream.pause();
                        }
                    });

                    writeStream.on('drain', function() { // 写完后，继续读取
                        readStream.resume();
                    });

                    readStream.on('end', t => { // 当没有数据时，关闭数据流
                        writeStream.end();
                        if (i === imagesPathArr.length - 1 ) {
                            this.zone.run(() => {
                                this.insertText(imageText_Str);
                            });
                            this.model = this.model + '\n\n' + imageUrls_Str;
                        }
                    });
                }

            }
        });
    }

    editorSave() {
        const model = this.model || '';
        this.MDEditorViewerComm.editor_save.emit(model);
    }

    ngOnDestroy() {
    }

}
