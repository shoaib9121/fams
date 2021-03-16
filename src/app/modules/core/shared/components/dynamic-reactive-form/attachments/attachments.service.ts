import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AttachmentsService {
	public attachments;
	constructor() { this.attachments = []; }

	public getAttachments(): any[] {
		return this.attachments;
	}

	public setAttachments(attachments: any[]) {
		this.attachments = attachments;
	}

	public filesToPush(file: any) {
		if (file) {
			this.attachments.push(file);
		}
	}

	public removeAttachment(index) {
		this.attachments.splice(index, 1);
	}

	public removeAllAttachments() {
		this.attachments = [];
	}
}
