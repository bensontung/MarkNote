import {Injectable} from '@angular/core';

@Injectable()
export class RecursionTree {

    public getTree(arr, _id) {
        const data = [];

        for (const v in arr) {
            // articlesListDB.count({categoryid: arr[v]._id}, function (err, count) {

            if (arr[v].pid === _id) {

                const id         = arr[v].id;
                const name       = arr[v].name;
                const pid        = arr[v].pid;
                const def        = arr[v].def;
                const counts     = arr[v].counts;

                data.push(
                    {
                        'id'       : id,
                        'name'     : name,
                        'pid'      : pid,
                        'def'      : def,
                        'counts'   : counts,
                        'children' : this.getTree(arr, id)
                    }
                );

            }

            // });
        }

        return data;

    }

    public init(arr) {
        return this.getTree(arr, 0);
    }

}
