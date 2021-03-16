import {Injectable} from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class LocalStorageService {
	
	constructor() {
	}
  
  /**
   * Stores an item to the local storage
   *
   * @param storageFieldId   - stored storageFieldId
   * @param value - stored value
   */
	public store(storageFieldId: string, value: any) {
	  window.localStorage.setItem(storageFieldId, JSON.stringify(value));
    }
  
  /**
   * Loads an item from the local storage
   *
   * @param storageFieldId - stored storageFieldId
   */
  public load(storageFieldId: string): any {
	  return JSON.parse(window.localStorage.getItem(storageFieldId)) || null;
    }
}
