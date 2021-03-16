/**
 * Time Tracking Model
 */
export interface TimeTrackingModel {
	id?: number;
	value?: {
        state?: string,
        done?: boolean,
        duration?: boolean
    };
}
