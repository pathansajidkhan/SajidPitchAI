export class CommonValueModel {
    id: number;
    code: string;
    description: string;
}

export class CommonValueTypeModel{
    id: number;
    code: string;
    description: string;
}

export class CommonValueByTypeCodeModel {
    commonvalues:CommonValueModel[];
}

export class DropdownModel{
    label:string;
    value:string;
}