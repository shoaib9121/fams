import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { EditItemService } from './edit-item.service';

@Injectable()
export class Resolver implements Resolve<Observable<string>> {
  constructor(private editItemService: EditItemService) { }

  resolve() {
    return this.editItemService.fetchItemDetails(0);
  }
}