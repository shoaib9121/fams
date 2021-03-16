import { MatPaginatorIntl } from '@angular/material';
import { GlobalVariables } from "../../../../../global-variables.service";

import { Injectable } from '@angular/core';
@Injectable()        
export class PaginatorIntlService extends MatPaginatorIntl {

    constructor(private globalsVars: GlobalVariables) {
        super();
        this.itemsPerPageLabel = this.globalsVars.translation["items_per_page"][this.globalsVars.LNG];
        this.nextPageLabel = this.globalsVars.translation["next_page"][this.globalsVars.LNG];
        this.previousPageLabel = this.globalsVars.translation["previous_page"][this.globalsVars.LNG];
        this.changes.next();
    }

    getRangeLabel = function (page, pageSize, length) {
        if (length === 0 || pageSize === 0) {
            return '0 ' + this.globalsVars.translation["of"][this.globalsVars.LNG] + ' ' + length;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
            if(this.globalsVars.LNG == 'en'){
                return startIndex + 1 + ' - ' + endIndex + ' ' + this.globalsVars.translation["of"][this.globalsVars.LNG] + ' ' + length;
            }else{
                return startIndex + 1 + ' - ' + endIndex + ' ' + '/' + ' ' + length;
            }
    };
}
