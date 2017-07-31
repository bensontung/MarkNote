declare const sqlite3: any;
import {Injectable} from '@angular/core';

@Injectable()
export class DragService {

    constructor() {

    }

    init(elem) {

        function closest(el, selector) {
            const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

            while (el) {
                if (matchesSelector.call(el, selector)) {
                    break;
                }
                el = el.parentElement;
            }

            return el;
        }


        const box = closest(elem, '.drag-box');
        const boxX = (document.body.clientWidth / 2) - (box.clientWidth / 2);
        const boxY = (document.body.clientHeight - 64) * 0.25;

        box.style.transform = 'translate(' + boxX + 'px, ' + boxY + 'px)';

        elem.onmousedown = function (e) {

            const moveControl = this;
            let move_status = true;

            const moveW = box.clientWidth;
            const moveH = box.clientHeight;
            const maxW = document.body.clientWidth - moveW - 9;
            const maxH = document.body.clientHeight - moveH - 9;
            const moveX = e.offsetX;
            const moveY = e.offsetY;

            // console.log('moveW：', moveW, '，moveH：', moveH, '，maxW：', maxW, '，maxH：', maxH, '，moveX：', moveX, '，moveY：', moveY);

            document.onmousemove = function (event) {

                if (move_status === true) {

                    let X, Y;

                    X = event.clientX - moveX - 5;
                    Y = event.clientY - moveY - 64;
                    X = X > 5 ? X : 5;
                    X = X < maxW ? X : maxW;
                    Y = Y > 2 ? Y : 2;
                    Y = Y < maxH - 64 ? Y : maxH - 64;

                    box.style.transform = 'translate(' + X + 'px, ' + Y + 'px)';
                    box.style.cursor = 'move';

                    // console.log('box.style.transform：', box.style.left, 'box.style.top：', box.style.top);

                }

            };

            document.onmouseup = function () {
                move_status = false;
                box.style.cursor = 'default';
            };

        };
    }

}

export class SubstrService {

    constructor() {

    }

    init(str, len, hasDot) {
        if (str === undefined) {
            return false;
        }

        let newLength      = 0;
        let newStr         = '';
        const chineseRegex = /[^\x00-\xff]/g;
        let singleChar     = '';
        const strLength    = str.replace(chineseRegex, '**').length;

        for (let i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) != null) {
                newLength += 2;
            } else {
                newLength++;
            }
            if (newLength > len) {
                break;
            }
            newStr += singleChar;
        }

        if (hasDot && strLength > len) {
            newStr += '...';
        }

        return newStr;

    }
}
