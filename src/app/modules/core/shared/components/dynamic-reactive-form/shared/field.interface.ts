export interface Validator {
  name?: string;
  validator?: any;
  message?: string;
  type?:any;
  value?:any;
}
export interface Options{
  value?:any;
}
export interface FieldConfig {
  label?: string;
  update?:boolean;
  isChild?: any;
  
  columns?: any;
  footer?: any;
  subGroups?:any[];
  name?: string;
  inputType?: string;
  options?: any;
  col:any;
  collections?: any;
  type: string;
  value?: any;
  multiple?:boolean;
  reference_module_id?:any;
  reference_module_values?:string[];
  reference_keys?: any;
  post_reference_values?: boolean,
  form_default_values?: any[],
  async?:boolean;
  validations?: Validator[];
  disabled?:boolean;
  mindate?:any,
  maxdate?:any,
  math?:any,
  key_show?:any,
  resetFields?:any,
  filter?:any,
  default_value_editable?:any,
  services_on_change?:any,
  shouldAutofillGlobally?:any,
  dialog?: any,
  dialog_inputs?: any,
  dialog_return_value?: any,
  dialog_return_value_data_type?: any,
  is_system_column?: any,
  reference_value_api?:any
}
