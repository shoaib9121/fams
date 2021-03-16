import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadInput } from './directives/file-upload-input.directive';
import { CoreUploadComponent } from "./core-upload/core-upload.component";
import { FileUpload } from "./file-upload/file-upload.component";
import { FileUploadQueue } from "./file-upload-queue/file-upload-queue.component";
import { BytesPipe } from './pipes/bytes-pipe.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatIconModule,
  MatTooltipModule,
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule
} from "@angular/material";

@NgModule({
  declarations: [
    FileUploadInput,
		CoreUploadComponent,
		FileUpload,
    FileUploadQueue,
    BytesPipe
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [CoreUploadComponent]
})
export class FileUploadModule { }
