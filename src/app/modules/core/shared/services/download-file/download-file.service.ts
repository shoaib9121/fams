import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {HttpHeaders, HttpResponse, HttpClient} from "@angular/common/http";
import {SnackbarService} from "../snackbar/snackbar.service";

@Injectable({
    providedIn: "root"
})
export class DownloadFileService {
    constructor(private restApi: HttpClient, private snackBarService: SnackbarService) {
    }

    public downloadFile(url): Observable<HttpResponse<Blob>> {
        return this.restApi.get(url, { headers: new HttpHeaders ({ 'Content-Type': 'image/jpeg' }), responseType: 'blob'})
            .pipe(
                tap(( response: any ) => {
                    console.log('file available to download', response);
                }),
                catchError(this.handleError('DownloadFileService@downloadFile'))
            );
    }

    private handleError(operation = "operation", result?: any) {
        return (error: any): Observable<any> => {
            console.error(error);
            console.log(`${operation} failed: ${error.message}`);

            if (error.status === 400 && error.error && error.error.error && error.error.error !== "") {
                this.snackBarService.open(error.error.error, "", 5000);
            }
            return of(error);
        };
    }
}
