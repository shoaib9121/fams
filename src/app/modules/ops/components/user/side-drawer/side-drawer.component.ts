import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalVariables } from 'src/app/global-variables.service';
import { ModuleDataService } from '../module-data/module-data.service';


@Component({
    selector: 'app-side-drawer',
    templateUrl: './side-drawer.component.html',
    styleUrls: ['./side-drawer.component.scss']
})
export class SideDrawerComponent implements OnInit {

    @Input() data;
    @Input() editOverview: any;
    @Input() moduleStatuses;
    @Input() isEdit;
    drawer_template: any;
    drawerWidth: any;
    loadDataLocally: boolean;

    constructor(
        public globalVars: GlobalVariables,
        public moduleDataService: ModuleDataService,

    ) {
        this.loadDataLocally = false;
    }

    ngOnInit() {
        let tabs;
        try {
            let viewpermission = this.moduleDataService.getViewPermissions();
            if (this.isEdit) {
                tabs = viewpermission.drawer_templates.edit_template.side_drawer.tabs;
            } else {
                tabs = viewpermission.drawer_templates.add_template.side_drawer.tabs;
            }
        } catch{ }
        if (tabs && tabs.length > 0) {
            this.drawer_template = tabs;
        } else if (this.isEdit) {
            this.template();
        }
    }

    template() {
        // this.drawer_template = JSON.parse('[{"type":"attachments","icon":"paperclip","name":{"en":"Attachments","ar":"Attachments"}}, {"type":"notes","icon":"information","name":{"en":"Notes","ar":"Notes"}}]');

        //******************************************************************** */ remove this after testing
        this.drawer_template = JSON.parse('[{"type":"activity","icon":"history","name":{"en":"Activity","ar":"Activity"}}, {"type":"attachments","icon":"paperclip","name":{"en":"Attachments","ar":"Attachments"}}, {"type":"notes","icon":"information","name":{"en":"Notes","ar":"Notes"}}]');
    }

    public tabAnimationDone() {
        this.loadDataLocally = true;
    }

}
