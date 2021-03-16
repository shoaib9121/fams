import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { GlobalVariables } from "../../../../../global-variables.service";
import { DownloadFileService } from "../../services/download-file/download-file.service";
import { SpinnerSnackbarService } from "../../components/spinner-snackbar/spinner-snackbar.service";

@Component({
    selector: 'app-barcode-dialog',
    templateUrl: './barcode.dialog.html',
    styles: [`
        ::ng-deep .barcode-placeholder .mat-icon {
            height: 200px;
            width: 200px;
        }
        ::ng-deep .barcode-placeholder .mat-icon svg {
            height: 200px;
            width: 200px;
        }
        .not-found{
            margin: 0;
            font-size: 1rem;
        }
        #print-barcode {
            position: relative;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .thumb-loading {
            background-color: #ececec;
            min-height: 200px;
            overflow: hidden;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
        .thumb-loading::after {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 80%;
            transform: translateX(-100%);
            background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.5) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0) );
            animation: shimmer 1.3s infinite;
            content: '';
        }
        
        @keyframes shimmer {
            100% {
                transform: translateX(100%);
            }
        }
        .thumb-loading .mat-icon{
            color: #c7c7c7;
            width: 40px;
            height: 40px;

            ::ng-deep svg{
                width: 40px;
                height: 40px;
            }
        }
    `]
})
export class BarcodeDialog implements OnInit {
    
    barcodeUrl: string;
    fileName: string;
    barcodePlaceholder: boolean;
    loading: boolean;
    constructor(
        public dialogRef: MatDialogRef<BarcodeDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any, public globalVars: GlobalVariables, private downloadFileService: DownloadFileService, 
                private spinnerSnackBarService: SpinnerSnackbarService) {}

    ngOnInit() {
        this.loading = true;
        if (this.data) {
            this.barcodeUrl = this.globalVars.getAPIBaseUrl() + '/attachment/barcode/' + this.data.id;
            this.fileName = this.globalVars.translation["barcode"][this.globalVars.LNG];
        }
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }
    
    loadingMethod(): void {
        // this.loading = false;
    }

    public downloadFile() {
        this.spinnerSnackBarService.open(this.globalVars.translation['Downloading'][this.globalVars.LNG]);
        setTimeout(() => {
            this.downloadFileService.downloadFile(this.barcodeUrl).subscribe( val => {
                const url = URL.createObjectURL(val);
                this.downloadUrl(url, this.fileName + '.jpeg');
                URL.revokeObjectURL(url);
            });
        }, 100);
    }

    public downloadUrl(url: string, fileName: string) {
        const a: any = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.style = 'display: none';
        a.click();
        a.remove();
    }
    
    public printFile(): void {
        let printContents, popupWin;
        printContents = document.getElementById('print-barcode').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=700px,width=1000px');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                    
                    </style>
                </head>
                <body onload="setTimeout(function(){window.print(); window.close();}, 200)">${printContents}</body>
            </html>`
        );
        popupWin.document.close();
    }
}
