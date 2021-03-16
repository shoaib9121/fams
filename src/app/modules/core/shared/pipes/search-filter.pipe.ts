import { Pipe, PipeTransform } from "@angular/core";
import { GlobalVariables } from '../../../../global-variables.service';

@Pipe({
	name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

    constructor(private globalVariables: GlobalVariables) {}

	public transform(value, keys: string, term: string, isParentList?) {
        if (!term) return value;

        let parentListFiltered = [], childListFiltered = [];
        if(isParentList){
            parentListFiltered = (value || []).filter(item => item.values.find( type => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(type[key][this.globalVariables.LNG])))) ;
            return parentListFiltered;
        }else{
            childListFiltered = (value || []).filter(item => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key][this.globalVariables.LNG])));
            return childListFiltered;
        }
	}
}