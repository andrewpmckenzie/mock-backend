import {BooleanField, NumberField, StringField} from './interface';

export function stringField<RawDocumentType>(
    displayName: string,
    updateDocument: (document: Readonly<RawDocumentType>, value: string) => Readonly<RawDocumentType>,
): StringField<RawDocumentType> {
  return {type: 'string', displayName, updateDocument};
}

export function numberField<RawDocumentType>(
    displayName: string,
    updateDocument: (document: Readonly<RawDocumentType>, value: number) => Readonly<RawDocumentType>,
): NumberField<RawDocumentType> {
  return {type: 'number', displayName, updateDocument};
}

export function booleanField<RawDocumentType>(
    displayName: string,
    updateDocument: (document: Readonly<RawDocumentType>, value: boolean) => Readonly<RawDocumentType>,
): BooleanField<RawDocumentType> {
  return {type: 'boolean', displayName, updateDocument};
}
