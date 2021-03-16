
import { Component, Inject } from "@angular/core";
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
	selector: 'spinner-snackbar',
	template: `
        <div fxLayout="row" fxLayoutAlign="space-between" fxLayoutGap="15px"> 
            <span class="message">{{ data }} </span> 
            <mat-spinner class="spinner"></mat-spinner> 
        </div>
        `,
        styles: [`
            .spinner,
            ::ng-deep .spinner svg{
                width: 30px !important;
                height: 30px !important;
            }
        `],
})

export class SpinnerComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}