export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export type ValidationRules = {
    notEmpty?: boolean;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    passwordRule?: boolean; // min 8, must contain a number
};

export type Option = { id: string; label: string; value: string };

export type DerivedConfig = {
    enabled: boolean;
    parents: string[]; // field ids
    expression: string; // JS-like expression evaluated with context
};

export type FieldBase = {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
    defaultValue?: any;
    validations?: ValidationRules;
    options?: Option[]; // for select/radio
    derived?: DerivedConfig;
};

export type FormSchema = {
    id: string;
    name: string;
    createdAt: string;
    fields: FieldBase[];
};

export type FormMeta = { id: string; name: string; createdAt: string };