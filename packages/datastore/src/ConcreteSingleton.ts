import {Observable, Subject} from 'rxjs';
import {AbstractField, DocumentEvent, Schema, Singleton, UpdateDocumentEvent} from './interface';

export class ConcreteSingleton<RawDocumentType> implements Singleton<RawDocumentType> {
  public set value(value: Readonly<RawDocumentType>) {
    this.internalValue = value;
    this.updateSubject.next({
      document: value,
      eventType: 'UpdateDocumentEvent',
    });
  }

  public get value(): Readonly<RawDocumentType> {
    return this.internalValue;
  }

  public readonly updates: Observable<UpdateDocumentEvent<RawDocumentType>>;
  public readonly events: Observable<DocumentEvent<RawDocumentType>>;

  private updateSubject = new Subject<UpdateDocumentEvent<RawDocumentType>>();

  constructor(
      readonly schema: Schema<RawDocumentType>,
      private internalValue: Readonly<RawDocumentType> = schema.create(),
  ) {
    this.updates = this.updateSubject.asObservable();
    this.events = this.updates;
  }

  public update<ValueType>(field: AbstractField<RawDocumentType, string, ValueType>, value: ValueType):
      Readonly<RawDocumentType> {
    this.value = field.updateDocument(this.value, value);
    return this.value;
  }

  public serialize(): string {
    return this.schema.serialize(this.internalValue);
  }

  public deserialize(serialized: string) {
    try {
      this.internalValue = this.schema.deserialize(serialized);
    } catch (e) {
      throw new Error(`Could not deserialize singleton ${this.schema.name}: ${e.message}`);
    }
  }
}
