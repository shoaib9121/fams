import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";
import uuid from 'uuid';

@Injectable({
	providedIn: "root"
})
export class GlobalVariables {
	public LNG: string;
	public CURRENT_APP_NAME: string;
	public CURRENT_APP_ID: number;
	public DIR: { en: string, ar: string } = {
		en: "ltr",
		ar: "rtl"
	};
	/**
	 * Stores all environment variables so environment variables can be used in template files
	 */
	public environment = environment;
	
	public translation = {
		'Search Plate': {
			en: 'Search Plate Number.. ',
			ar: "بحث رقم اللوحة ..."
		},
		'Plate Number': {
			en: 'Plate Number',
			ar: "رقم لوحة"
		},
		'Make': {
			en: 'Make',
			ar: "يصنع"
		},
		'Model': {
			en: 'Model',
			ar: "نموذج"
		},
		'Color': {
			en: 'Color',
			ar: "اللون"
		},
		'Year': {
			en: 'Year',
			ar: "عام"
		},
		'Type': {
			en: 'Type',
			ar: "اكتب"
		},
		'total': {
			en: 'Total',
			ar: 'مجموع'
		},
		'Odometer': {
			en: 'Odometer',
			ar: "عداد المسافات"
		},
		'Vehicle Group': {
			en: 'Vehicle Group',
			ar: "مجموعة المركبات"
		},
		'Device Id': {
			en: 'Device Id',
			ar: "معرف الجهاز"
		},
		'Available': {
			en: 'Available',
			ar: "متاح"
		},
		'IServe#': {
			en: 'IServe#',
			ar: "أنا أخدم#"
		},
		'Add': {
			en: 'Add',
			ar: "إضافة"
		},
		'Cancel': {
			en: 'Cancel',
			ar: "قريب"
		},
		'Update': {
			en: 'Update',
			ar: "تحديث"
		},
		'Vehicles': {
			en: 'Vehicles',
			ar: "مركبات"
			
		},
		'booking Locations': {
				en: 'Booking Locations',
				ar: 'حجز المواقع'
		},
		'Most Used Vehicles Today': {
				en: 'Most Used Vehicles Today',
				ar: 'معظم السيارات المستعملة اليومحجز المواقع'
		},
		'Most Used Vehicles': {
				en: 'Most Used Vehicles',
				ar: 'معظم السيارات المستعملة'
		},
		'Users': {
			en: 'Users',
			ar: "المستخدمين"
			
		},
		'Active Booking List': {
			en: 'Active Booking List',
			ar: "قائمة الحجز النشط"
		},
		'Full Name': {
			en: 'Full Name',
			ar: "الاسم الكامل"
		}
		,
		'Email': {
			en: 'Email',
			ar: "البريد الإلكتروني"
		}
		,
		'Mobile Number': {
			en: 'Mobile Number',
			ar: "رقم الهاتف المحمول"
		}
		,
		'User Type': {
			en: 'User Type',
			ar: "نوع المستخدم"
		}
		,
		'Active': {
			en: 'Active',
			ar: "نشيط"
		}
		,
		'Password': {
			en: 'Password',
			ar: "كلمه السر"
		}
		,
		'Re Password': {
			en: 'Re Password',
			ar: "إعادة كلمة المرور"
		}
		,
		'User Name': {
			en: 'User Name',
			ar: "اسم المستخدم"
		}
		,
		'Bookinges(Today)': {
			en: 'Bookings Today',
			ar: "حجز اليوم"
		}
		,
		'Bookinges History': {
			en: 'Bookings History',
			ar: "حجز التاريخ"
		}
		,
		'Locations': {
			en: 'Locations',
			ar: "مواقع"
		}
		,
		'Employee Id': {
			en: 'Employee Id',
			ar: "هوية الموظف"
		}
		,
		'Address': {
			en: 'Address',
			ar: "عنوان"
		}
		,
		'Location Type': {
			en: 'Location Type',
			ar: "نوع الموقع"
		}
		,
		'Location': {
			en: 'Location',
			ar: "موقعك"
		}
		,
		'No Entry': {
			en: 'No Entry',
			ar: "ممنوع الدخول"
		}
		,
		'Charging Station': {
			en: 'Charging Station',
			ar: "محطة شحن"
		}
		,
		'Parking Station': {
			en: 'Parking Station',
			ar: "محطة وقوف السيارات"
		},
		"List": {
			en: "List",
			ar: "قائمة",
		},
		"No Claims": {
			en: "No Claims",
			ar: "أي مطالبات",
		},
		"No Result Found": {
			en: "No Result Found",
			ar: "لم يتم العثور على نتائج",
		},
		"Create a new claim": {
			en: "Create a new claim",
			ar: "إنشاء مطالبة جديدة"
		},
		"Create New": {
			en: "Create New",
			ar: "خلق جديد إبداع جديد",
		},
		"No Reimbursement Requests": {
			en: "No Reimbursement Requests",
			ar: "لا طلبات السداد",
		},
		"No asset reports": {
			en: "No asset reports",
			ar: "لا توجد تقارير الأصول",
		},
		"No insurance contracts": {
			en: "No insurance contracts",
			ar: "لا توجد عقود تأمين",
		},
		"Are you sure": {
			en: "Are you sure?",
			ar: "هل أنت واثق"
		},
		"The status will be updated to": {
			en: "The status will be updated to",
			ar: "سيتم تحديث الحالة إلى",
		},
		"The claim will be sent to the insurance company": {
			en: "The contract will be sent to the insurance company",
			ar: "سيتم إرسال المطالبة إلى شركة التأمين",
		},
		"The estimate will be sent to the insurance company": {
			en: "The estimate will be sent to the insurance company",
			ar: "سيتم إرسال التقدير إلى شركة التأمين",
		},
		"The invoice will be sent to the insurance company": {
			en: "The invoice will be sent to the insurance company",
			ar: "سيتم إرسال الفاتورة إلى شركة التأمين",
		},
		"Updated successfully": {
			en: "Updated successfully",
			ar: "تم التحديث بنجاح",
		},
		"Activity": {
			en: "Activity",
			ar: "نشاط",
		},
		"Details": {
			en: "Details",
			ar: "تفاصيل",
		},
		"Notes": {
			en: "Notes",
			ar: "ملاحظات",
		},
		"Attachments": {
			en: "Attachments",
			ar: "مرفقات",
		},
		"File uploaded successfully": {
			en: "File uploaded successfully",
			ar: "تم رفع الملف بنجاح",
		},
		"Log": {
			en: "Log",
			ar: "سجل",
		},
		"Add a comment": {
			en: "Add a comment",
			ar: "اضف تعليق",
		}, "Iserve Id": {
			en: "Iserve Id",
			ar: "Iserve Id",
		},
		"Deleted successfully": {
			en: "Deleted successfully",
			ar: "حذف بنجاح",
		},
		"Locked successfully": {
			en: "Locked successfully",
			ar: "تم القفل بنجاح",
		},
		"Are You Sure want to delete this vehicle?": {
			en: "Are You Sure want to delete this vehicle?",
			ar: "هل تريد بالتأكيد حذف هذه السيارة؟",
		},
		"Are You Sure want to lock this vehicle ?": {
			en: "Are You Sure want to lock this vehicle?",
			ar: "هل تريد بالتأكيد قفل هذه السيارة؟",
		},
		"Are You Sure want to delete all the vehicles?": {
			en: "Are You Sure want to delete all the vehicles?",
			ar: "هل تريد بالتأكيد حذف جميع المركبات؟",
		},
		"Asset Report": {
			en: "Asset Report",
			ar: "تقرير الأصول",
		},
		"Are you sure?": {
			en: "Are you sure?",
			ar: "هل أنت واثق؟",
		},
		"You": {
			en: "You",
			ar: "أنت",
		},
		"updated the claim": {
			en: "updated the claim",
			ar: "تحديث المطالبة",
		},
		"Search..": {
			en: "Search..",
			ar: "بحث..",
		},
		"Saved successfully": {
			en: "Saved successfully",
			ar: "حفظ بنجاح",
		},
		"Available status Updated!": {
			en: "Available status Updated!",
			ar: "الحالة المتاحة محدثة!",
		},
		"Standard": {
			en: "Standard",
			ar: "اساسي",
		},
		"Luxury": {
			en: "Luxury",
			ar: "فخم. ترف",
		},
		"No Comments": {
			en: "No Comments",
			ar: "لا تعليق",
		},
		"Status successfully updated to": {
			en: "Status successfully updated to",
			ar: "تم تحديث الحالة بنجاح إلى",
		}, "Bookings": {
			en: "Bookings",
			ar: "حجوزات",
		},
		"Reserved": {
			en: "Reserved",
			ar: "محجوز",
		},
		"Closed": {
			en: "Closed",
			ar: "مغلق",
		},
		"Cancelled": {
			en: "Cancelled",
			ar: "ألغيت",
		},
		"Close": {
			en: "Close",
			ar: "قريب",
		},
		"open": {
			en: "Open",
			ar: "افتح",
		},
		"Inactive": {
			en: "Inactive",
			ar: "غير نشط",
		},
		"Premium": {
			en: "Premium",
			ar: "الممتازة",
		},
		"Yes": {
			en: "Yes",
			ar: "نعم",
		},
		"No": {
			en: "No",
			ar: "لا",
		},
		"No Attachments": {
			en: "No Attachments",
			ar: "لا ملفات مرفقة",
		},
		"Board": {
			en: "Board",
			ar: "طاولة",
		},
		"Upload attachment": {
			en: "Upload attachment",
			ar: "تحميل المرفق"
		},
		"Choose File": {
			en: "Choose File",
			ar: "اختر ملف"
		},
		"Claim cannot be updated": {
			en: "Claim cannot be updated",
			ar: "لا يمكن تحديث المطالبة"
		},
		"You can only update this claim to": {
			en: "You can only update this claim to",
			ar: "يمكنك فقط تحديث هذه المطالبة إلى"
		},
		"Insurance year": {
			en: "Insurance year",
			ar: "سنة التأمين"
		},
		"Create": {
			en: "Create",
			ar: "أبدع"
		},
		"Download attachment": {
			en: "Download attachment",
			ar: "تنزيل المرفقات",
		},
		"Update_insurance": {
			en: "Update",
			ar: "تحديث المطالبة"
		},
		"Update_fams": {
			en: "Update",
			ar: "طلب التحديث",
		},
		"update_log_insurance": {
			en: "updated the claim",
			ar: "تحديث المطالبة"
		},
		"update_log_fams": {
			en: "updated the request",
			ar: "طلب التحديث",
		},
		"Time": {
			en: "Time",
			ar: "زمن",
		},
		"Date": {
			en: "Date",
			ar: "تاريخ",
		},
		"iServe ID": {
			en: "iServe ID",
			ar: "اصرف إذ",
		},
		"count": {
			en: "count",
			ar: "عد",
		},
		"Pickup": {
			en: "Pickup",
			ar: "بيكب ",
		},
		"Dropoff": {
			en: "Dropoff",
			ar: "دروبف  ",
		},
		"status_cannot_be_updated": {
			en: "Status cannot be updated",
			ar: "لا يمكن تحديث الحالة"
		},
		"you_can_only_update_this_status_to": {
			en: "You can only update this record status to",
			ar: "يمكنك فقط تحديث حالة السجل هذه إلى"
		},
		"OK": {
			en: "OK",
			ar: "حسنا",
		},
		"form_without_saving": {
			en: "Do you want to close the form without saving?",
			ar: "هل تريد إغلاق النموذج دون حفظ؟"
		},
		"changes_not_saved": {
			en: "You have not saved you're changes",
			ar: "لم تقم بحفظ تغييراتك"
		},
		"None": {
			en: "None",
			ar: "None",
		},
		"NoRecordFound": {
			en: "No Record Found",
			ar: "لا يوجد سجلات",
		},
		"no_processflow_guidelines": {
			en: "No Processflow Guidelines",
			ar: "لا ملفات مرفقة",
		},
		"got_it_continue": {
			en: "GOT IT! CONTINUE",
			ar: "فهمتك! استمر"
		},
		"request_lifecycle": {
			en: "Request Lifecycle",
			ar: "طلب دورة حياة"
		},
		"request_lifecycle_explanation": {
			en: "Request Lifecycle explanation",
			ar: "طلب شرح دورة حياة",
		},
		"type_name_fams": {
			en: "Type Name",
			ar: "أكتب اسم"
		},
		"type_name_insurance": {
			en: "Type Name",
			ar: "أكتب اسم"
		},
		"Save": {
			en: "Save",
			ar: "حفظ"
		},
		"ID": {
			en: "ID",
			ar: 'هوية شخصية'
		},
		"Name": {
			en: "Name",
			ar: 'اسم'
		},
		"Total Count": {
			en: "Total Count",
			ar: 'إجمالي عدد'
		},
		"Insurance Value": {
			en: "Insurance Value",
			ar: 'قيمة التأمين'
		},
		"Percentage": {
			en: "Percentage",
			ar: 'النسبة المئوية'
		},
		"VAT_Percentage": {
			en: "VAT Percentage",
			ar: 'قيمة النسبة المئوية'
		},
		"Issurance Fee": {
			en: "Issurance Fee",
			ar: 'صورنس في'
		},
		"Premium SubTotal": {
			en: "Premium SubTotal",
			ar: 'المجموع الفرعي'
		},
		"VAT Ammount": {
			en: "VAT Ammount",
			ar: 'قيمة الضريبة'
		},
		"Premium Total": {
			en: "Premium Total",
			ar: 'مجموع بريميوم'
		},
		"Comments": {
			en: "Comments",
			ar: 'تعليقات'
		},
		"Create Asset Statement": {
			en: "Create Asset Statement",
			ar: "إنشاء بيان الأصول"
		},
		"Edit Asset Statement": {
			en: "Edit Asset Statement",
			ar: "تحرير بيان الأصول"
		},
		"confirm_message_are_you_sure_to_create_a_new_view": {
			en: "Are you sure to create a new view?",
			ar: 'هل أنت متأكد من إنشاء طريقة عرض جديدة؟'
		},
		"confirm_message_are_you_sure_to_edit_an_user_permission_matrix_in_a_view": {
			en: "Are you sure to edit an user permission matrix in a view?",
			ar: 'هل أنت متأكد من تحرير مصفوفة أذونات المستخدم في العرض؟'
		},
		"confirm_message_are_you_sure_to_add_an_user_permission_matrix_to_a_view": {
			en: "Are you sure to add an user permission matrix to a view?",
			ar: 'هل أنت متأكد من إضافة مصفوفة إذن مستخدم إلى طريقة عرض؟'
		},
		"Error Message": {
			en: "Error Message",
			ar: 'رسالة خطأ'
		},
		"Error Message Arabic": {
			en: "Error Message Arabic",
			ar: 'رسالة خطأ عربي'
		},
		"Name EN": {
			en: "Name EN",
			ar: 'الاسم EN'
		},
		"Name AR": {
			en: "Name AR",
			ar: 'الاسم ع'
		},
		"Notifications": {
			en: "Notifications",
			ar: "إعلام"
		},
		"No Notifications": {
			en: "No Notifications",
			ar: "لا إشعارات"
		},
		"name_english": {
			en: "Name English",
			ar: "اسم الانجليزية"
		},
		"name_arabic": {
			en: "Name Arabic",
			ar: "الاسم العربية"
		},
		"user_role": {
			en: "User Role",
			ar: "الاسم العربية"
		},
		"update_user_role": {
			en: "Update User Role",
			ar: "الاسم العربية"
		},
		"Roles": {
			en: "Roles",
			ar: "الأدوار"
		},
		"Field Id": {
			en: "Field Id",
			ar: "مفتاح"
		},
		"Calculation?": {
			en: "Calculation?",
			ar: "عملية حسابية؟",
		},
		"Next": {
			en: "Next",
			ar: "التالى",
		},
		"Add Validation": {
			en: "Add Validation",
			ar: "إضافة التحقق من الصحة",
		},
		"Reference Module ID": {
			en: "Reference Module ID",
			ar: "معرف الوحدة المرجعية",
		},
		"Add Form Group": {
			en: "Add Form Group",
			ar: "إضافة مجموعة النماذج",
		},
		"Process Flow": {
			en: "Process Flow",
			ar: "عملية تدفق",
		},
		"User Role": {
			en: "User Role",
			ar: "دور المستخدم",
		},
		"Status Stages": {
			en: "Status Stages",
			ar: "مراحل الحالة",
		},
		"Icon": {
			en: "Icon",
			ar: "أيقونة",
		},
		"Status": {
			en: "Status",
			ar: "الحالة",
		},
		"Add new field": {
			en: "Add new field",
			ar: "إضافة حقل جديد",
		},
		"Add Type": {
			en: "Add Type",
			ar: "إضافة نوع",
		},
		"Module Name": {
			en: "Module Name",
			ar: "اسم وحدة",
		},
		"Module Fields": {
			en: "Module Fields",
			ar: "حقول الوحدة",
		},
		"Types": {
			en: "Types",
			ar: "أنواع",
		},
		"Trigger Configuration": {
			en: "Trigger Configuration",
			ar: "تكوين الزناد",
		},
		"Is it optional?": {
			en: "Is it optional?",
			ar: "هل هو اختياري؟",
		},
		"Fields": {
			en: "Fields",
			ar: "مجالات",
		},
		"Add Sub group": {
			en: "Add Sub group",
			ar: "إضافة مجموعة فرعية",
		},
		"Trigger?": {
			en: "Trigger?",
			ar: "اثار؟",
		},
		"Type Groups": {
			en: "Type Groups",
			ar: "اكتب المجموعات",
		},
		"Add Flow": {
			en: "Add Flow",
			ar: "إضافة تدفق",
		},
		"Reference Module Values": {
			en: "Reference Module Value",
			ar: "قيمة الوحدة المرجعية",
		},
		"KeyShow": {
			en: "Key-Show",
			ar: "عرض رئيسي",
		},
		"Formula": {
			en: "Formula",
			ar: "معادلة",
		},
		"Previous": {
			en: "Previous",
			ar: "السابق",
		},
		"Actions": {
			en: "Actions",
			ar: "أجراءات",
		},
		"Modules": {
			en: "Modules",
			ar: "وحدات",
		},
		"Module Name Arabic": {
			en: "Module Name Arabic",
			ar: "اسم الوحدة العربية",
		},
		"Create New Module": {
			en: "Create New Module",
			ar: "إنشاء وحدة جديدة",
		},
		"This field is required": {
			en: "This field is required",
			ar: "هذه الخانة مطلوبه",
		},
		"Update Module": {
			en: "Update Module",
			ar: "تحديث الوحدة",
		},
		"confirm_message_are_you_sure_to_delete_an_user_permission_matrix_from_this_view": {
			en: "Are you sure to delete an user permission matrix from this view?",
			ar: 'هل أنت متأكد من حذف مصفوفة إذن مستخدم من طريقة العرض هذه؟'
		},
		"edit": {
			en: "Edit",
			ar: "تعديل"
		},
		"remove": {
			en: "Remove",
			ar: "إزالة"
		},
		"permission_matrix": {
			en: "Permission Matrix",
			ar: "مصفوفة إذن"
		},
		"snack_alert_created_new_view": {
			en: "Successfully created new view",
			ar: "تم إنشاء عرض جديد بنجاح"
		},
		"snack_alert_added_new_user_into_view": {
			en: "Successfully added new user into the view",
			ar: "تمت إضافة مستخدم جديد بنجاح إلى العرض"
		},
		"snack_alert_modified_user_permission_matrix_in_view": {
			en: "Successfully modified user permission matrix in view",
			ar: "تم تعديل مصفوفة إذن المستخدم بنجاح"
		},
		"snack_alert_deleted_user_from_view": {
			en: "Successfully deleted user from view",
			ar: "تم حذف المستخدم بنجاح من المشاهدة"
		},
		"snack_alert_error_view_creation": {
			en: "Error in view creation",
			ar: "خطأ في إنشاء العرض"
		},
		"snack_alert_error_while_adding_user_into_view": {
			en: "Error while adding user into the view",
			ar: "خطأ أثناء إضافة المستخدم إلى العرض"
		},
		"snack_alert_error_view_modification": {
			en: "Error in view modification",
			ar: "خطأ في تعديل العرض"
		},
		"snack_alert_error_view_deletion": {
			en: "Error in view deletion",
			ar: "خطأ في عرض الحذف"
		},
		"view_privileges": {
			en: "View Privileges",
			ar: "عرض الامتيازات"
		},
		"view_name": {
			en: "View Name",
			ar: "عرض الاسم"
		},
		"module_name": {
			en: "Module Name",
			ar: "اسم وحدة"
		},
		"workspace_name": {
			en: "Workspace Name",
			ar: "اسم مساحة العمل"
		},
		"user_roles": {
			en: "User Roles",
			ar: "أدوار المستخدمين"
		},
		"basic_details": {
			en: "Basic",
			ar: "الأساسي"
		},
		"status_n_other_details": {
			en: "Statuses & Other Details",
			ar: "الحالات وغيرها من التفاصيل"
		},
		"types_n_groups": {
			en: "Types & Groups",
			ar: "أنواع ومجموعات"
		},
		"table_structure": {
			en: "Table Structure",
			ar: "هيكل الجدول"
		},
		"group_by": {
			en: "Group By",
			ar: "مجموعة من"
		},
		"permissions": {
			en: "Permissions",
			ar: "أذونات"
		},
		"field_type__id": {
			en: "ID",
			ar: "هوية شخصية"
		},
		"field_type__status": {
			en: "Status",
			ar: "الحالة"
		},
		"field_type__single": {
			en: "Single",
			ar: "غير مرتبطة"
		},
		"field_type__group": {
			en: "Group",
			ar: "مجموعة"
		},
		"field_type__module_type_name": {
			en: "Module Type Name",
			ar: "اسم نوع الوحدة"
		},
		"field_type__table": {
			en: "Table",
			ar: "الطاولة"
		},
		"field_type__flag": {
			en: "Flag",
			ar: "علم"
		},
		"frontend_field_type__icon": {
			en: "Icon",
			ar: "أيقونة"
		},
		"frontend_field_type__chip": {
			en: "Chip",
			ar: "رقاقة"
		},
		"frontend_field_type__text": {
			en: "Text",
			ar: "نص"
		},
		"frontend_filter_type__date": {
			en: "Date",
			ar: "تاريخ"
		},
		"created_by": {
			en: "Created By",
			ar: "انشأ من قبل"
		},
		"created_at": {
			en: "Created At",
			ar: "أنشئت في"
		},
		"updated_at": {
			en: "Updated At",
			ar: "تم التحديث في"
		},
		"view_mode__list": {
			en: "List",
			ar: "قائمة"
		},
		"view_mode__board": {
			en: "Board",
			ar: "مجلس"
		},
		"view_mode__dashboard": {
			en: "Dashboard",
			ar: "لوحة القيادة"
		},
		"view_mode__calendar": {
			en: "Calendar",
			ar: "التقويم"
		},
		"field_name__id": {
			en: "Id",
			ar: "رقم التعريف"
		},
		"field_name__type_id": {
			en: "Type Id",
			ar: "معرف النوع"
		},
		"view_user_roles": {
			en: "View User Roles",
			ar: "عرض أدوار المستخدم"
		},
		"Translation Mode": {
			en: "Translation Mode",
			ar: "وضع الترجمة",
		},
		"Saving to local storage": {
			en: "Module has been saved in local Storage - please share with developers",
			ar: "تم حفظ الوحدة النمطية في التخزين المحلي - يرجى مشاركتها مع المطورين",
		},
		"workspaces": {
			en: "Workspaces",
			ar: "مساحات العمل"
		},
		"create_new_workspace": {
			en: "Create New Workspace",
			ar: "إنشاء مساحة عمل جديدة"
		},
		"edit_workspace": {
			en: "Edit Workspace",
			ar: "تحرير مساحة العمل"
		},
		"name_en": {
			en: "Name (EN)",
			ar: "الاسم (EN)"
		},
		"name_ar": {
			en: "Name (AR)",
			ar: "الاسم (ع)"
		},
		"translate": {
			en: "Translate",
			ar: "ترجمة"
		},
		"confirm_message_are_you_sure_to_update_translates": {
			en: "Are you sure to update the user permission matrix translates?",
			ar: 'هل أنت متأكد من تحديث مصفوفة إذن المستخدم يترجم؟'
		},
		"System Modules cannot be edited": {
			en: "System Modules cannot be edited",
			ar: "لا يمكن تعديل وحدات النظام"
		},
		"Back": {
			en: "Back",
			ar: "عودة"
		},
		"Done": {
			en: "Done",
			ar: "منجز"
		},
		"Final Check": {
			en: "Final Check",
			ar: "كشف أخير"
		},
		"confirm_message_are_you_sure_to_create_a_new_workspace": {
			en: "Are you sure to create a new workspace?",
			ar: 'هل أنت متأكد من إنشاء مساحة عمل جديدة؟'
		},
		"confirm_message_are_you_sure_to_edit_a_workspace": {
			en: "Are you sure to update the workspace?",
			ar: 'هل أنت متأكد من تحديث مساحة العمل؟'
		},
		"snack_alert_created_new_workspace": {
			en: "Successfully created new workspace",
			ar: "تم إنشاء مساحة عمل جديدة بنجاح"
		},
		"snack_alert_modified_workspace": {
			en: "Successfully modified workspace",
			ar: "تم تعديل مساحة العمل بنجاح"
		},
		"snack_alert_error_workspace_creation": {
			en: "Error in workspace creation",
			ar: "خطأ في إنشاء مساحة العمل"
		},
		"snack_alert_error_workspace_modification": {
			en: "Error in workspace modification",
			ar: "خطأ في تعديل مساحة العمل"
		},
		"equipment_number": {
			en: "Equipment Number",
			ar: "عدد المعدات"
		},
		"proc_status": {
			en: "Proc status",
			ar: "حالة بروك"
		},
		"fleet_number": {
			en: "Fleet number",
			ar: "عدد المعدات"
		},
		"green_disk_number": {
			en: "Green disk number",
			ar: "رقم الأسطول"
		},
		"equipment_type": {
			en: "Equipment Type",
			ar: "عدد المعدات"
		},
		"model_year": {
			en: "Model year",
			ar: "نوع الآداة"
		},
		"manufacturer_id": {
			en: "Manufacturer Id",
			ar: "معرف الصانع"
		},
		"model_id": {
			en: "Model Id",
			ar: "معرف النموذج"
		},
		"color": {
			en: "Color",
			ar: "اللون"
		},
		"description": {
			en: "Description",
			ar: "وصف"
		},
		"recently_added_vehicles": {
			en: "Recently added Vehicles",
			ar: "المركبات المضافة حديثا"
		},
		"requests_by_status": {
			en: "Requests by status",
			ar: "طلبات حسب الحالة"
		},
		"requests": {
			en: "Requests",
			ar: "طلبات"
		},
		"assets_by_category": {
			en: "Assets by category",
			ar: 'الأصول حسب الفئة'
		},
		"total_vehicles": {
			en: "Total Vehicles",
			ar: 'مجموع المركبات'
		},
		"total_components": {
			en: "Total Components",
			ar: 'مجموع المكونات'
		},
		"active_assets": {
			en: "Active Assets",
			ar: 'الأصول النشطة'
		},
		"desposed_assets": {
			en: "Desposed Assets",
			ar: 'الأصول المموهة'
		},
		"reuse_assets": {
			en: "Reuse Assets",
			ar: 'إعادة استخدام الأصول'
		},
		"waiting_in_storage_for_transfer": {
			en: "Waiting in Storage for Transfer",
			ar: 'في انتظار التخزين للنقل'
		},
		"departments": {
			en: "Departments",
			ar: "الإدارات"
		},
		"create_new_department": {
			en: "Create New Department",
			ar: "إنشاء قسم جديد"
		},
		"edit_department": {
			en: "Edit Department",
			ar: "تحرير القسم"
		},
		"confirm_message_are_you_sure_to_create_a_new_department": {
			en: "Are you sure to create a new department?",
			ar: 'هل أنت متأكد من إنشاء قسم جديد؟'
		},
		"confirm_message_are_you_sure_to_edit_a_department": {
			en: "Are you sure to update the department?",
			ar: 'هل أنت متأكد من تحديث القسم؟'
		},
		"snack_alert_created_new_department": {
			en: "Successfully created new department",
			ar: "تم إنشاء قسم جديد بنجاح"
		},
		"snack_alert_modified_department": {
			en: "Successfully modified department",
			ar: "تم تعديل القسم بنجاح"
		},
		"snack_alert_error_department_creation": {
			en: "Error in department creation",
			ar: "خطأ في إنشاء القسم"
		},
		"snack_alert_error_department_modification": {
			en: "Error in department modification",
			ar: "خطأ في تعديل القسم"
		},
		"Assured Amount by Amount Type": {
			en: "Assured amount by amount type",
			ar: "المبلغ المضمون حسب نوع المبلغ"
		},
		"Reimbursement Requests": {
			en: "Reimbursement Requests",
			ar: "طلبات السداد"
		},
		"Claim Details": {
			en: "Claim details",
			ar: "تفاصيل المطالبة"
		},
		"Claim No": {
			en: "Claim No",
			ar: "رقم المطالبة"
		},
		"Claim Type": {
			en: "Claim Type",
			ar: "نوع المطالبة"
		},
		"Claim Date": {
			en: "Claim Date",
			ar: "تاريخ المطالبة"
		},
		"Claim Status": {
			en: "Claim Status",
			ar: "حالة المطالبة"
		},
		"Avarage Cost & Days to Settle a Claim": {
			en: "Average cost & days to settle a Claim",
			ar: "متوسط التكلفة وأيام تسوية المطالبة"
		},
		"English": {
			en: "English",
			ar: "الإنجليزية",
		},
		"Arabic": {
			en: "Arabic",
			ar: "عربى",
		},
		"Claim Update": {
			en: "Claim Update",
			ar: "تحديث المطالبة",
		},
		"download": {
			en: "Download",
			ar: "تحميل",
		},
		"Assured Amount": {
			en: "Assured Amount",
			ar: "مضمون المبلغ",
		},
		"Open Claims": {
			en: "Open Claims",
			ar: "فتح المطالبات",
		},
		"New Added Assets": {
			en: "New Added Assets",
			ar: "الأصول المضافة الجديدة",
		},
		"Annaul Premium": {
			en: "Annual Premium",
			ar: "القسط السنوي",
		},
		"Closed Claims": {
			en: "Closed Claims",
			ar: "مطالبات مغلقة",
		},
		"Cancelled Assets": {
			en: "Cancelled Assets",
			ar: "الأصول الملغاة",
		},
		"Days": {
			en: "Days",
			ar: "أيام",
		},
		"Cost": {
			en: "Cost",
			ar: "كلفة",
		},
		"username": {
			en: "Username",
			ar: "اسم المستخدم",
		},
		"phone": {
			en: "Phone",
			ar: "هاتف"
		},
		"user_accounts": {
			en: "User Accounts",
			ar: "حسابات المستخدمين"
		},
		"create_new_user_account": {
			en: "Create New User Account",
			ar: "إنشاء حساب مستخدم جديد"
		},
		"edit_user_account": {
			en: "Edit User Account",
			ar: "تحرير حساب المستخدم"
		},
		"confirm_message_are_you_sure_to_create_a_new_user_account": {
			en: "Are you sure to create a new user account?",
			ar: 'هل أنت متأكد من إنشاء حساب مستخدم جديد؟'
		},
		"confirm_message_are_you_sure_to_edit_an_user_account": {
			en: "Are you sure to update the user account?",
			ar: 'هل أنت متأكد من تحديث حساب المستخدم؟'
		},
		"snack_alert_created_new_user_account": {
			en: "Successfully created new user account",
			ar: "تم إنشاء حساب مستخدم جديد بنجاح"
		},
		"snack_alert_modified_user_account": {
			en: "Successfully modified user account",
			ar: "تم تعديل حساب المستخدم بنجاح"
		},
		"snack_alert_error_user_account_creation": {
			en: "Error in user account creation",
			ar: "خطأ في إنشاء حساب المستخدم"
		},
		"snack_alert_error_user_account_modification": {
			en: "Error in user account modification",
			ar: "خطأ في تعديل حساب المستخدم"
		},
		"user_type_details": {
			en: "User Type",
			ar: "User Type"
		},
		"login_info": {
			en: "Login Info",
			ar: "Login Info"
		},
		"Request Update": {
			en: "Request Update",
			ar: "طلب التحديث"
		},
		"select_all": {
			en: "Select All",
			ar: "اختر الكل"
		},
		"now": {
			en: "now",
			ar: "الآن"
		},
		"minutes ago": {
			en: "minutes ago",
			ar: "دقائق مضت"
		},
		"an hour ago": {
			en: "an hour ago",
			ar: "منذ ساعة"
		},
		"hours ago": {
			en: "hours ago",
			ar: "منذ ساعات"
		},
		"one day ago": {
			en: "one day ago",
			ar: "قبل يوم واحد"
		},
		"days ago": {
			en: "days ago",
			ar: "أيام مضت"
		},
		"months ago": {
			en: "months ago",
			ar: "منذ اشهر"
		},
		"one month ago": {
			en: "one month ago",
			ar: "قبل شهر"
		},
		"one year ago": {
			en: "one year ago",
			ar: "قبل سنة واحدة"
		},
		"years ago": {
			en: "years ago",
			ar: "سنين مضت"
		},
		"Successfully Updated": {
			en: "Successfully Updated",
			ar: "تم التحديث بنجاح"
		},
		"File Title": {
			en: "File Title",
			ar: "عنوان الملف"
		},
		"Fields updated": {
			en: "Fields updated",
			ar: "تحديث الحقول"
		},
		"OLD": {
			en: "OLD",
			ar: "قديم"
		},
		"NEW": {
			en: "NEW",
			ar: "جديد"
		},
		"Fields Updated": {
			en: "Fields Updated",
			ar: "تم تحديث الحقول"
		},
		"Chat": {
			en: "Chat",
			ar: "دردشة"
		},
		"Downloading": {
			en: "Downloading",
			ar: "جارى التحميل"
		},
		"Traffic Fines": {
			en: "Traffic Fines",
			ar: "المخالفات المرورية"
		},
		"Fuel Logs": {
			en: "Fuel Logs",
			ar: "سجلات الوقود"
		},
		"clone": {
			en: "Clone",
			ar: "استنساخ"
		},
		"clone_view_permission_matrix": {
			en: "Clone View Permission Matrix",
			ar: "استنساخ عرض إذن المصفوفة"
		},
		"confirm_message_are_you_sure_to_clone_user_view_permission_matrix": {
			en: "Are you sure to clone this user view permission matrix?",
			ar: "هل أنت متأكد من استنساخ مصفوفة إذن عرض المستخدم هذه؟"
		},
		"snack_alert_cloned_user_view_permission_matrix": {
			en: "Successfully cloned new user permission matrix",
			ar: "تم استنساخ مصفوفة إذن مستخدم جديد بنجاح"
		},
		"snack_alert_error_while_cloning_user_view_permission_matrix": {
			en: "Error while cloning user view permission matrix",
			ar: "خطأ أثناء استنساخ مصفوفة إذن عرض المستخدم"
		},
		"incorrect_username": {
			en: "Incorrect Username",
			ar: "اسم المستخدم غير صحيح"
		},
		"incorrect_password": {
			en: "Incorrect Password",
			ar: "كلمة سر خاطئة"
		},
		"login": {
			en: "Login ",
			ar: "تسجيل الدخول"
		},
		"frontend_filter_type__scale": {
			en: "Scale",
			ar: "مقياس"
		},
		"frontend_filter_type__number": {
			en: "Number",
			ar: "رقم"
		},
		"field_type__thumbnail": {
			en: "Thumbnail",
			ar: "ظفري"
		},
		"No Issues Found": {
			en: "No Issues Found",
			ar: "لم يتم العثور على اى مشكلات"
		},
		"time_tracking_component": {
			en: "Time Tracking Component",
			ar: "مكون تتبع الوقت"
		},
		"pause": {
			en: "Pause",
			ar: "وقفة"
		},
		"start": {
			en: "Start",
			ar: "بداية"
		},
		"resume": {
			en: "Resume",
			ar: "استئنف"
		},
		"end": {
			en: "End",
			ar: "النهاية"
		},
		"reset": {
			en: "Reset",
			ar: "إعادة تعيين"
		},
		"jobcard_info": {
			en: "Jobcard Info",
			ar: "معلومات بطاقة العمل"
		},
		"stock_quantity": {
			en: "Stock Quantity",
			ar: "كمية المخزون"
		},
		"reserved_quantity": {
			en: "Reserved Quantity",
			ar: "الكمية المحجوزة"
		},
		"reserved_parts": {
			en: "Reserved Parts",
			ar: "الأجزاء المحجوزة"
		},
		"order_summary": {
			en: "Order Summary",
			ar: "ملخص الطلب"
		},
		"stock_summary": {
			en: "Stock Summary",
			ar: "ملخص الأسهم"
		},
		"ordered_parts": {
			en: "Ordered Parts",
			ar: "الأجزاء المطلوبة"
		},
		"parts": {
			en: "Parts",
			ar: "القطع"
		},
		"vendors": {
			en: "Vendors",
			ar: "الباعة"
		},
		"purchase_orders": {
			en: "Purchase Orders",
			ar: "طلبات الشراء"
		},
		"items_per_page": {
			en: "Items per page:",
			ar: "مواد لكل صفحة:"
		},
		"next_page": {
			en: "Next Page",
			ar: "الصفحة التالية"
		},
		"previous_page": {
			en: "Previous Page",
			ar: "الصفحة السابقة"
		},
		"of": {
			en: "of",
			ar: "من"
		},
		"created_successfully": {
			en: "Created successfully",
			ar: "تم إنشاؤه بنجاح"
		},
		"prohibited_to_open": {
			en: "Prohibited to open",
			ar: "ممنوع الفتح"
		},
		"Define Pattern": {
			en: "Define Pattern",
			ar: "تحديد النمط"
		},
		"Update_crm": {
			en: "Update",
			ar: "طلب التحديث",
		},
		"update_log_crm": {
			en: "updated the record",
			ar: "طلب التحديث",
		},
		"type_name_crm": {
			en: "Type Name",
			ar: "أكتب اسم"
		},
        "field_missing": {
			en: "* Field Missing",
			ar: "* الحقل مفقود"
		},
        "basic_info": {
			en: "Basic Info",
			ar: "معلومات أساسية"
		},
        "statuses_and_details": {
			en: "Statuses & Other Details",
			ar: "الحالات وتفاصيل أخرى"
		},
        "module_types": {
			en: "Module Types",
			ar: "أنواع الوحدات"
		},
        "type_group": {
			en: "Type Group",
			ar: "اكتب المجموعة"
		},
        "type_groups": {
			en: "Type Groups",
			ar: "اكتب مجموعات"
		},
        "add_new_group": {
			en: "Add New Group",
			ar: "أضف مجموعة جديدة"
		},
        "add_field_privileges": {
			en: "Add Field Privileges",
			ar: "إضافة امتيازات الحقول"
		},
        "generate_view": {
			en: "Generate View",
			ar: "إنشاء عرض"
		},
        "update_translates": {
			en: "Update Translates",
			ar: "تحديث يترجم"
		},
        "add_new_column": {
			en: "Add New Column",
			ar: "إضافة عمود جديد"
		},
        "options": {
			en: "Options",
			ar: "خيارات"
		},
        "issue_details": {
			en: "Issue Details",
			ar: "تفاصيل الإصدار"
		},
        "bay_summary": {
			en: "Bay Summary ",
			ar: "ملخص الخليج"
		},
        "logout": {
			en: "Logout",
			ar: "تسجيل خروج"
		},
        "barcode": {
			en: "Barcode",
			ar: "الرمز الشريطي"
		},
        "barcode_not_found": {
			en: "Barcode Not Found",
			ar: "لم يتم العثور على الباركود"
		},
        "under_procurement": {
			en: "Under Procurement",
			ar: "تحت المشتريات"
		},
        "delivered_parts": {
			en: "Delivered Parts",
			ar: "الأجزاء المسلمة"
		},
        "issue_summary": {
			en: "Issue Summary",
			ar: "ملخص القضية"
		},
        "jobcard_summary": {
			en: "Jobcard Summary",
			ar: "ملخص بطاقة العمل"
		},
        "unoccupied_staff": {
			en: "Unoccupied Staff",
			ar: "الموظفين غير مشغولين"
		},
        "staff_id": {
			en: "Staff Id",
			ar: "معرف الموظفين"
		},
        "staff_name": {
			en: "Staff Name",
			ar: "اسم الموظفين"
		},
        "working_staff_overview": {
			en: "Working Staff Overview",
			ar: "نظرة عامة على طاقم العمل"
		},
        "issue_name": {
			en: "Issue Name",
			ar: "اسم الإصدار"
		},
        "issue_status": {
			en: "Issue Status",
			ar: "حالة الإصدار"
		},
        "jobcard_status": {
			en: "Jobcard Status",
			ar: "حالة بطاقة العمل"
		},
        "working_staff_service_manager": {
			en: "Working Staff Service Manager",
			ar: "مدير خدمة الموظفين العاملين"
		},
        "opened_and_upcoming_jobcards": {
			en: "Opened and Upcoming Jobcards",
			ar: "بطاقات العمل المفتوحة والمقبلة"
		},
        "staff_assigned": {
			en: "Staff Assigned",
			ar: "تم تعيين الموظفين"
		},
        "no_opened_or_upcoming_jobcards": {
			en: "No Opened or Upcoming Jobcards",
			ar: "لا توجد بطاقات عمل مفتوحة أو قادمة"
		},
        "service_managers_unoccupied": {
			en: "Service Managers Unoccupied",
			ar: "مدراء الخدمة غير مشغولين"
		},
        "no_opened_jobcards": {
			en: "No Opened Jobcards",
			ar: "لا توجد بطاقات عمل مفتوحة"
		},
        "workshop_staff_unoccupied": {
			en: "Workshop Staff Unoccupied",
			ar: "طاقم ورشة العمل غير مشغول"
		},
        "no_workshop_staff_overview": {
			en: "No Workshop Staff Overview",
			ar: "لا نظرة عامة على طاقم ورشة العمل"
		},
        "bay": {
			en: "Bay",
			ar: "خليج"
		},
        "bay_details": {
			en: "Bay Details",
			ar: "تفاصيل الخليج"
		},
        "issue_count": {
			en: "Issue Count",
			ar: "عدد القضايا"
		},
        "service_manager": {
			en: "Service Manager",
			ar: "مدير الخدمة"
		},
        "total_issues": {
			en: "Total Issues",
			ar: "إجمالي المشكلات"
		},
        "external_jobcards": {
			en: "External Jobcards",
			ar: "بطاقات العمل الخارجية"
		},
        "internal_jobcards": {
			en: "Internal Jobcards",
			ar: "بطاقات العمل الداخلية"
		},
        "unoccupied_service_managers": {
			en: "Unoccupied Service Managers",
			ar: "مدراء الخدمة غير المشغولين"
		},
        "no_service_managers_unoccupied": {
			en: "No Service Managers Unoccupied",
			ar: "لا يوجد مدراء خدمة مشغولون"
		},
        "issues": {
			en: "Issues",
			ar: "مسائل"
		},
        "service_manager_id": {
			en: "Service Manager ID",
			ar: "معرف مدير الخدمة"
		},
        "all_internal_jobcards_except_closed": {
			en: "All Internal Jobcards Except Closed",
			ar: "جميع بطاقات العمل الداخلية باستثناء مغلقة"
		},
        "all_external_jobcards_except_closed": {
			en: "All External Jobcards Except Closed",
			ar: "جميع بطاقات العمل الخارجية باستثناء إغلاقها"
		},
        "total_issues_except_closed": {
			en: "Total Issues Except Closed",
			ar: "إجمالي المشكلات ما عدا مغلق"
		},
        "occupancy": {
			en: "Occupancy",
			ar: "الإشغال"
		},
        "max_jc_per_day": {
			en: "Max Allowed Jobcards Per Day",
			ar: "ماكس جي سي لكل يوم"
		},
        "assigned_jobcards": {
			en: "Assigned Jobcards",
			ar: "بطاقات العمل المعينة"
		},
		"Action cannot be performed": {
			en: "Action cannot be performed",
			ar: "لا يمكن تنفيذ الإجراء"
		},
		"added_a_comment": {
			en: "added a comment",
			ar: "تمت إضافة تعليق"
		},
		"comment": {
			en: "Comment",
			ar: "تعليق"
		},
		"all": {
			en: "all",
			ar: "الكل"
		},
		"attachment": {
			en: "Attachment",
			ar: "المرفق"
		},
		"updated_by": {
			en: "Updated by",
			ar: "تم التحديث بواسطة"
		},
		"commented_by": {
			en: "Commented by",
			ar: "علق عليها"
		},
	};
	
	public systemModuleConstants = {
		APPLICATION: 1,
		USER: 2,
		DEPARTMENT: 3,
		MODULE: 4,
		ROLE: 5,
		WORKSPACE: 6,
		VIEW: 7
	};
	
	public defaultTranslateMode = false;
	
	public availableIcons = [
		{id: 1, name: 'Arrow Right', field_id: 'subdirectory-arrow-right'},
		{id: 2, name: 'Numeric', field_id: 'numeric'},
		{id: 3, name: 'Hammer', field_id: 'hammer'},
		{id: 4, name: 'Calendar', field_id: 'calendar-month'},
		{id: 5, name: 'Account', field_id: 'account'},
		{id: 6, name: 'Clock', field_id: 'clock-outline'},
		{id: 7, name: 'Tag Text', field_id: 'tag-text'},
		{id: 8, name: 'Card Text', field_id: 'card-text'},
		{id: 9, name: 'Numeric +', field_id: 'numeric-9-plus-box'},
		{id: 10, name: 'Car Info', field_id: 'car-info'},
		{id: 11, name: 'File', field_id: 'file'},
		{id: 12, name: 'Car Hatchback', field_id: 'car-hatchback'},
		{id: 13, name: 'Package Variant Closed', field_id: 'package-variant-closed'},
		{id: 14, name: 'Settings', field_id: 'settings'},
		{id: 15, name: 'Shield Car', field_id: 'shield-car'},
		{id: 16, name: 'Orbit', field_id: 'orbit'},
		{id: 17, name: 'Gas Station', field_id: 'gas-station'},
		{id: 18, name: 'Backup Restore', field_id: 'backup-restore'},
		{id: 19, name: 'Cash', field_id: 'cash'},
		{id: 20, name: 'Cart Outline', field_id: 'cart-outline'},
		{id: 21, name: 'Truck Check', field_id: 'truck-check'},
		{id: 22, name: 'Clipboard List Outline', field_id: 'clipboard-list-outline'},
		{id: 23, name: 'Car Multiple', field_id: 'car-multiple'},
		{id: 24, name: 'Office Building', field_id: 'office-building'},
		{id: 25, name: 'Radar', field_id: 'radar'},
		{id: 26, name: 'Tablet Cellphone', field_id: 'tablet-cellphone'},
		{id: 27, name: 'Account Multiple', field_id: 'account-multiple'},
		{id: 28, name: 'Medical Bag', field_id: 'medical-bag'},
		{id: 29, name: 'Dog Side', field_id: 'dog-side'},
		{id: 30, name: 'Tools', field_id: 'tools'},
		{id: 31, name: 'Horse Head', field_id: 'custom-awesome-horse-head'},
		{id: 32, name: 'Marine', field_id: 'custom-marine'},
		{id: 33, name: 'Laptop', field_id: 'laptop'},
		{id: 34, name: 'File Chart', field_id: 'file-chart'},
		{id: 35, name: 'View Dashboard', field_id: 'view-dashboard'},
		{id: 36, name: 'Support', field_id: 'lifebuoy'},
		{id: 37, name: 'Map Legend', field_id: 'map-legend'},
		{id: 38, name: 'Car Connected', field_id: 'car-connected'},
		{id: 39, name: 'Map Marker', field_id: 'map-marker'},
		{id: 40, name: 'Ticket Confirmation', field_id: 'ticket-confirmation'},
		{id: 41, name: 'Calendar Range', field_id: 'calendar-range'},
		{id: 42, name: 'Car', field_id: 'car'},
		{id: 43, name: 'Set Center', field_id: 'set-center'},
		{id: 44, name: 'Repeat', field_id: 'repeat'},
		{id: 45, name: 'Dog', field_id: 'dog'},
		{id: 46, name: 'Phone', field_id: 'phone'},
		{id: 47, name: 'Email', field_id: 'email'},
		{id: 48, name: 'Fax', field_id: 'fax'},
		{id: 49, name: 'Pen', field_id: 'pen'},
	];
	
	constructor() {
		this.loadLanguage();
	}
	
	// region language and direction (rtl/ltr)
	
	/**
	 * Updates LNG in local storage
	 * @param lang - LNG prefix. (if not set, "en" will be used)
	 */
	storeLanguage(lang?: string): void {
		window.localStorage.setItem("lang", lang || "en");
	}
	
	/**
	 * Loads LNG from local storage
	 */
	loadLanguage(): string {
		const lang = window.localStorage.getItem("lang");
		if (lang && lang != 'null') {
			this.LNG = lang;
		} else {
			this.LNG = "en";
			this.storeLanguage();
		}
		return this.LNG;
	}
	
	/**
	 * Stores direction in local storage (needed for bidi module)
	 */
	storeDirection(): void {
		window.localStorage.setItem("dir", this.DIR[this.loadAppStructure()] || "ltr");
	}
	
	/**
	 * Loads direction from local storage (needed for bidi module)
	 */
	loadDirection(): string {
		return window.localStorage.getItem("dir") || "ltr";
	}
	
	// endregion
	
	// region application navigation structure
	
	/**
	 * Stores application navigation structure for whole platform into local storage
	 *
	 * @param appNav - whole application Navigation
	 */
	storeAppStructure(appNav: any): void {
		window.localStorage.setItem("app_structure", JSON.stringify(appNav) || null);
		this.workSpaceStored(appNav);
	}
	
	workSpaceStored(appNav: any): any {
		let workSpaces = [];
		appNav.forEach(appNav => {
			if (appNav.route === this.getCurrentApplicationName()) {
				appNav.menus.forEach(work => {
					if (work.route == this.getCurrentMenu()) {
						workSpaces = work.workspaces;
					}
				});
			}
			
		});
		return workSpaces;
	}
	
	/**
	 * Loads application navigation structure for whole platform from local storage
	 */
	loadAppStructure(): any {
		const appNav = JSON.parse(window.localStorage.getItem("app_structure"));
		if (!appNav) {
			window.location.replace("/#/login");
		}
		return appNav;
	}
	
	// endregion
	
	// region current Application ID and Name
	
	getCurrentApplicationID() {
		let appStructure = this.loadAppStructure();
		return appStructure.find(app => app.route == this.getCurrentApplicationName()).id;
	}
	
	/**
	 * Returns name of current application
	 */
	getCurrentApplicationName() {
		return window.location.hash.split("/")[2];
	}
	
	/**
	 * Updates name of current application
	 */
	updateCurrentApplicationName() {
		this.CURRENT_APP_NAME = window.location.hash.split("/")[2];
	}
	
	/**
	 * Updates ID of current application
	 */
	updateCurrentApplicationID() {
		let appStructure = this.loadAppStructure();
		return appStructure.find(app => app.route == this.CURRENT_APP_NAME).id;
	}
	
	/**
	 * Updates current Application ID & Name
	 */
	updateCurrentApplicationData() {
		this.updateCurrentApplicationName();
		this.updateCurrentApplicationID();
	}
	
	// endregion
	
	/**
	 * Returns current name of menu
	 */
	getCurrentMenu() {
		if (this.CURRENT_APP_NAME == "iServe") {
			return window.location.hash.split("/")[3];
		}
		return window.location.hash.split("/")[4];
	}
	
	/**
	 * Returns url of current application
	 * E.g. applicationName: "insurance" -- apiUrl: "IP:PORT/insurance/"
	 */
	getAPIBaseUrl() {
		// return environment.apiUrl + (environment.production ? ("/" + this.CURRENT_APP_NAME) : "");
		return environment.apiUrl + (environment.production ? ("") : "");
	}
	
	/**
	 * Returns the base url for thumbnails (used in table widget)
	 */
	get thumbnailBaseUrl() {
		return this.getAPIBaseUrl() + "/attachment/profileimage/";
	}
	
	/**
	 * Returns protocol
	 */
	get getAPIProtocol() {
		return environment.protocol;
	}
	
	/**
	 * Downloading file by creating link
	 */
	downloadFile(doc, downloadFileUrl) {
		downloadFileUrl = this.getAPIProtocol + downloadFileUrl;
		let downloadLink = doc.createElement('a');
		downloadLink.href = downloadFileUrl;
		// downloadLink.setAttribute('download', uuid.v4());
		doc.body.appendChild(downloadLink);
		downloadLink.click();
	}
	
	// region user information
	
	/**
	 * Stores user information into local storage
	 *
	 * @param userInfo
	 */
	storeUserInfo(userInfo: any): void {
		window.localStorage.setItem("app_user_info", JSON.stringify(userInfo));
	}
	
	/**
	 * Loads user information from local storage
	 */
	loadUserInfo(): any {
		return JSON.parse(window.localStorage.getItem("user_info")) || null;
	}
	
	// endregion
	
	/**
	 * Returns whether the provided {@param element} is an object of en, and ar ({en: "name_english", ar: "name_arabic"}
	 *
	 * @param element
	 */
	isNameObject(element) {
		try {
			if (typeof element === "object" && element.hasOwnProperty("en") && element.hasOwnProperty("ar")) {
				return true;
			} else if (typeof element === "string") {
				element = JSON.parse(element);
				return element && (element.hasOwnProperty("en") && element.hasOwnProperty("ar"));
			}
		} catch (exception) {
			return false;
		}
		
		return false;
	}
	
	IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
	
	IsEmptyObject(input) {
		return Object.keys(input).length === 0;
	}
	
	IsNumber(input) {
		// return !Number.isNaN(input);
		return !isNaN(parseInt(input, 10));
	}
	
	isObject(item): boolean {
		return item !== null && typeof item == 'object';
	}
	
	timeStampToDateTimeFormat(timestamp): string {
		return new Date(timestamp).toLocaleDateString() + " " + new Date(timestamp).toLocaleTimeString();
	}
	
	
	/**
	 * Needed for adding a default type id for list view (table structure)
	 * Used for iServe
	 *
	 * @param dataArray
	 */
	addDefaultTypeId(dataArray) {
		try {
			dataArray.forEach((dataElement) => {
				dataElement.type_id = 0;
			});
		} catch (exception) {
		
		}
		
		return dataArray;
	}


	/**
	 * Default Drawer width
	 */
	edit_side_drawer_width :string = '20vw';
	add_side_drawer_width :string = '20vw';
	edit_drawer_width :string = '70vw';
	add_drawer_width :string = '50vw';
	

	public dubaiFont = 'DubaiRegular';
}
