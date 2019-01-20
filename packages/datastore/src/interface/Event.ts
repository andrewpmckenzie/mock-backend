import {Collection, Singleton} from './Collection';
import {DocumentId} from './Id';

export interface AbstractEvent {
  readonly eventType: string;
}

export interface AbstractDocumentEvent<RawDocumentType> extends AbstractEvent {
  readonly id?: DocumentId;
  readonly document: RawDocumentType;
}

export interface AddDocumentEvent<RawDocumentType = {}> extends AbstractDocumentEvent<RawDocumentType> {
  eventType: 'AddDocumentEvent';
}

export interface UpdateDocumentEvent<RawDocumentType = {}> extends AbstractDocumentEvent<RawDocumentType> {
  eventType: 'UpdateDocumentEvent';
}

export interface RemoveDocumentEvent<RawDocumentType = {}> extends AbstractDocumentEvent<RawDocumentType> {
  eventType: 'RemoveDocumentEvent';
}

export interface AddSingletonEvent extends AbstractEvent {
  eventType: 'AddSingletonEvent';
  singleton: Singleton;
}

export interface AddCollectionEvent extends AbstractEvent {
  eventType: 'AddCollectionEvent';
  collection: Collection;
}

export type DocumentEvent<RawDocumentType = {}> =
    AddDocumentEvent<RawDocumentType> | UpdateDocumentEvent<RawDocumentType> | RemoveDocumentEvent<RawDocumentType>;

export type Event = DocumentEvent | AddSingletonEvent | AddCollectionEvent;
