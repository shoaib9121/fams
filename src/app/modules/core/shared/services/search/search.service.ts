import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material";

@Injectable({
    providedIn: "root"
})
export class SearchService {
    searchQuery: string;
    constructor() {
    }

    public setSearchQuery(query) {
        this.searchQuery = query;
    }

    public getSearchQuery() {
        return this.searchQuery;
    }

    public resetSearchQuery() {
        this.searchQuery = '';
    }
}
