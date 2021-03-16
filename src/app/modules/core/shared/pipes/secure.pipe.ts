import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {

  constructor(private restApi: HttpClient, private sanitizer: DomSanitizer) { }

  transform(url): Observable<SafeUrl> {
    return this.restApi
      .get(url, { responseType: 'blob' })
      // .pipe(map( val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))));
      .pipe( 
        map( val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))),
        catchError(this.handleError("SecurePipe@transform"))
      )
  }
  
  private handleError(operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			console.error(error);
			console.log(`${operation} failed: ${error.message}`);
			return of(error.url);
		};
	}

}