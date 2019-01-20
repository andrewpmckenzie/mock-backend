import {expect} from 'chai';
import {
  BooleanField,
  booleanField,
  Collection,
  Event, NumberField,
  numberField,
  Schema,
  Singleton, StringField,
  stringField,
} from '../src';
import {ConcreteCollection} from '../src/ConcreteCollection';
import {ConcreteSingleton} from '../src/ConcreteSingleton';
import {Datastore} from '../src/Datastore';

interface TestDocumentType {
  foo?: string;
  bar?: number;
  bing?: boolean;
}

const TEST_SCHEMA: Schema<TestDocumentType> = Object.freeze({
  name: 'MyDocumentSchema',
  create: () => ({foo: 'defaultFoo', bar: undefined, bing: undefined}),
  fields: [
      stringField('foo', (o, foo) => ({...o, foo})),
      numberField('bar', (o, bar) => ({...o, bar})),
      booleanField('bing', (o, bing) => ({...o, bing})),
  ],
  serialize: (fb: TestDocumentType) => JSON.stringify(fb),
  deserialize: (document: string) => JSON.parse(document) as TestDocumentType,
});

describe('Datastore', () => {
  let events: {[emitterName: string]: Event[]};
  let datastore: Datastore;

  const captureEvent = (observableName: string) => (event: Event) => {
    events[observableName] = events[observableName] || [];
    events[observableName].push(event);
  };

  beforeEach(() => {
    events = {};

    datastore = new Datastore();
    datastore.addedCollection.subscribe(captureEvent('datastore.addedCollection'));
    datastore.addedSingleton.subscribe(captureEvent('datastore.addedSingleton'));
    datastore.events.subscribe(captureEvent('datastore.events'));
  });

  describe('#createCollection()', () => {
    let collection: Collection;

    beforeEach(() => collection = datastore.createCollection<TestDocumentType>(TEST_SCHEMA));

    it('creates a Collection', () => {
      expect(collection).to.be.an.instanceOf(ConcreteCollection);
    });

    it('emits an AddCollectionEvent', () => {
      const expectedEvent = {eventType: 'AddCollectionEvent', collection};
      expect(events).to.eql({
        'datastore.addedCollection': [expectedEvent],
        'datastore.events': [expectedEvent],
      });
    });

    it('makes the collection available via #getCollections()', () => {
      expect(datastore.getCollections().get('MyDocumentSchema')).to.eq(collection);
    });

    it('throws an error when attempting to create two collections with the same schema name', () => {
      expect(() => datastore.createCollection<TestDocumentType>(TEST_SCHEMA))
          .to.throw('A collection called MyDocumentSchema already exists.');
    });

    it('allows multiple collections with different schema names to be created (sanity check)', () => {
      const c2 = datastore.createCollection<TestDocumentType>({...TEST_SCHEMA, name: 'MyOtherSchema'});
      expect(datastore.getCollections().get('MyDocumentSchema')).to.eq(collection);
      expect(datastore.getCollections().get('MyOtherSchema')).to.eq(c2);
    });
  });

  describe('Collection', () => {
    let collection: Collection<TestDocumentType>;

    beforeEach(() => {
      collection = datastore.createCollection<TestDocumentType>(TEST_SCHEMA);
      collection.additions.subscribe(captureEvent('collection.additions'));
      collection.removals.subscribe(captureEvent('collection.removals'));
      collection.updates.subscribe(captureEvent('collection.updates'));
      collection.events.subscribe(captureEvent('collection.events'));
    });

    describe('#add()', () => {
      it('stores added documents', () => {
        collection.add('foo', {foo: 'A', bar: 2, bing: false});
        expect(collection.get('foo')).to.eql({foo: 'A', bar: 2, bing: false});
      });

      it('emits AddDocumentEvent when a document is added', () => {
        events = {};
        collection.add('foo', {foo: 'A', bar: 2, bing: false});

        const expectedEvent = {eventType: 'AddDocumentEvent', id: 'foo', document: {foo: 'A', bar: 2, bing: false}};
        expect(events).to.eql({
          'datastore.events': [expectedEvent],
          'collection.events': [expectedEvent],
          'collection.additions': [expectedEvent],
        });
      });

      it('emits UpdateDocumentEvent when a document is updated', () => {
        collection.add('foo', {foo: 'A', bar: 2, bing: false});
        events = {};

        collection.add('foo', {foo: 'B', bar: 2, bing: false});

        const expectedEvent = {eventType: 'UpdateDocumentEvent', id: 'foo', document: {foo: 'B', bar: 2, bing: false}};
        expect(events).to.eql({
          'datastore.events': [expectedEvent],
          'collection.events': [expectedEvent],
          'collection.updates': [expectedEvent],
        });
      });
    });

    describe('#update()', () => {
      it('updates the field', () => {
        collection.add('foo', {foo: 'A', bar: 2, bing: false});

        const result =
            collection.update('foo', TEST_SCHEMA.fields[0] as StringField<TestDocumentType>, 'bip');
        expect(result).to.eql({foo: 'bip', bar: 2, bing: false});
        expect(collection.get('foo')).to.eql({foo: 'bip', bar: 2, bing: false});

        collection.update('foo', TEST_SCHEMA.fields[1] as NumberField<TestDocumentType>, 23);
        expect(collection.get('foo')).to.eql({foo: 'bip', bar: 23, bing: false});

        collection.update('foo', TEST_SCHEMA.fields[2] as BooleanField<TestDocumentType>, true);
        expect(collection.get('foo')).to.eql({foo: 'bip', bar: 23, bing: true});
      });

      it('emits an UpdateDocumentEvent', () => {
        collection.add('foo', {foo: 'A', bar: 2, bing: false});
        events = {};

        collection.update('foo', TEST_SCHEMA.fields[0] as StringField<TestDocumentType>, 'B');

        const expectedEvent = {eventType: 'UpdateDocumentEvent', id: 'foo', document: {foo: 'B', bar: 2, bing: false}};
        expect(events).to.eql({
          'datastore.events': [expectedEvent],
          'collection.events': [expectedEvent],
          'collection.updates': [expectedEvent],
        });
      });

      it('returns null if the document doesn\'t exist', () => {
        collection.add('foo', {foo: 'A', bar: 2, bing: false});
        events = {};

        const result = collection.update('bar', TEST_SCHEMA.fields[0] as StringField<TestDocumentType>, 'B');
        expect(result).to.be.null;
        expect(events).to.be.empty;
      });
    });

    describe('#remove()', () => {
      it('removes an added document', () => {
        collection.add('foo', {foo: 'A', bar: 2, bing: false});

        const removedDoc = collection.remove('foo');

        expect(removedDoc).to.eql({foo: 'A', bar: 2, bing: false});
        expect(collection.get('foo')).to.eql(null);
      });

      it('returns null if the document doesn\'t exist', () => {
        collection.add('foo', {foo: 'A', bar: 2, bing: false});

        const removedDoc = collection.remove('bar');

        expect(removedDoc).to.eql(null);
      });

      it('emits RemoveDocumentEvent when a document is removed', () => {
        collection.add('foo', {foo: 'A', bar: 2, bing: false});
        events = {};

        collection.remove('foo');

        const expectedEvent = {eventType: 'RemoveDocumentEvent', id: 'foo', document: {foo: 'A', bar: 2, bing: false}};
        expect(events).to.eql({
          'datastore.events': [expectedEvent],
          'collection.events': [expectedEvent],
          'collection.removals': [expectedEvent],
        });
      });
    });

    describe('#serialize()', () => {
      it('converts the collection to a string', () => {
      collection.add('f1', {foo: 'A', bar: 2, bing: false});
      collection.add('f2', {foo: 'B', bar: 3, bing: true});

      const serialized = collection.serialize();
      expect(serialized).to.equal(`[
        ["f1","{\\"foo\\":\\"A\\",\\"bar\\":2,\\"bing\\":false}"],
        ["f2","{\\"foo\\":\\"B\\",\\"bar\\":3,\\"bing\\":true}"]
      ]`.replace(/\n\s+/g, ''));
    });
    });

    describe('#deserialize()', () => {
      it('restores a collection\'s state', () => {
        collection.deserialize(`[
          ["f1","{\\"foo\\":\\"A\\",\\"bar\\":2,\\"bing\\":false}"],
          ["f2","{\\"foo\\":\\"B\\",\\"bar\\":3,\\"bing\\":true}"]
        ]`.replace(/\n\s+/g, ''));

        expect(collection.size()).to.eql(2);
        expect(collection.get('f1')).to.eql({foo: 'A', bar: 2, bing: false});
        expect(collection.get('f2')).to.eql({foo: 'B', bar: 3, bing: true});
        expect([...collection.getMap().entries()]).to.eql([
            ['f1', {foo: 'A', bar: 2, bing: false}],
            ['f2', {foo: 'B', bar: 3, bing: true}],
        ]);
      });

      it('throws if the collection is not empty', () => {
        collection.add('f1', {foo: 'A', bar: 2, bing: false});
        expect(() => collection.deserialize(`[
          ["f1","{\\"foo\\":\\"A\\",\\"bar\\":2,\\"bing\\":false}"],
          ["f2","{\\"foo\\":\\"B\\",\\"bar\\":3,\\"bing\\":true}"]
        ]`.replace(/\n\s+/g, '')))
            .to.throw('Attempted to deserialize MyDocumentSchema when it already contains documents.');
      });

      it('throws if it can\'t deserialize', () => {
        expect(() => collection.deserialize('INVALID_SERIALIZATION'))
            .to.throw('Could not deserialize collection MyDocumentSchema: Unexpected token I in JSON at position 0');
      });
    });

    describe('#getAll()', () => {
      it('returns all stored documents', () => {
        collection.add('f1', {foo: 'A', bar: 2, bing: false});
        collection.add('f2', {foo: 'B', bar: 3, bing: true});

        expect(collection.getAll()).to.eql([{foo: 'A', bar: 2, bing: false}, {foo: 'B', bar: 3, bing: true}]);
      });
    });

    describe('#getMap()', () => {
      it('returns a map of stored documents', () => {
        collection.add('f1', {foo: 'A', bar: 2, bing: false});
        collection.add('f2', {foo: 'B', bar: 3, bing: true});

        expect([...collection.getMap().entries()]).to.eql([
          ['f1', {foo: 'A', bar: 2, bing: false}],
          ['f2', {foo: 'B', bar: 3, bing: true}],
        ]);
      });
    });

    describe('#size()', () => {
      it('returns the number of stored documents', () => {
        expect(collection.size()).to.equal(0);

        collection.add('f1', {foo: 'A', bar: 2, bing: false});
        collection.add('f2', {foo: 'B', bar: 3, bing: true});
        collection.add('f3', {foo: 'C', bar: 3, bing: true});

        expect(collection.size()).to.equal(3);

        collection.remove('f2');

        expect(collection.size()).to.equal(2);
      });
    });
  });

  describe('#createSingleton()', () => {
    let singleton: Singleton<TestDocumentType>;
    beforeEach(() => singleton = datastore.createSingleton<TestDocumentType>(TEST_SCHEMA));

    it('Datastore#createSingleton() creates a Singleton', () => {
      expect(singleton).to.be.an.instanceOf(ConcreteSingleton);
    });

    it('emits an AddSingletonEvent', () => {
      const expectedEvent = {eventType: 'AddSingletonEvent', singleton};
      expect(events).to.eql({
        'datastore.addedSingleton': [expectedEvent],
        'datastore.events': [expectedEvent],
      });
    });

    it('makes the collection available via #getSingletons()', () => {
      expect(datastore.getSingletons().get('MyDocumentSchema')).to.eq(singleton);
    });

    it('throws an error when attempting to create two singletons with the same schema name', () => {
      expect(() => datastore.createSingleton<TestDocumentType>(TEST_SCHEMA))
          .to.throw('A singleton called MyDocumentSchema already exists.');
    });

    it('allows multiple singletons with different schema names to be created (sanity check)', () => {
      const s2 = datastore.createSingleton<TestDocumentType>({...TEST_SCHEMA, name: 'MyOtherSchema'});
      expect(datastore.getSingletons().get('MyDocumentSchema')).to.eq(singleton);
      expect(datastore.getSingletons().get('MyOtherSchema')).to.eq(s2);
    });
  });

  describe('Singleton', () => {
    let singleton: Singleton<TestDocumentType>;

    beforeEach(() => {
      singleton = datastore.createSingleton<TestDocumentType>(TEST_SCHEMA);
      singleton.updates.subscribe(captureEvent('singleton.updates'));
      singleton.events.subscribe(captureEvent('singleton.events'));
    });

    describe('#value', () => {
      it('initializes to a blank document from Schema#create()', () => {
        expect(singleton.value).to.eql({foo: 'defaultFoo', bar: undefined, bing: undefined});
      });

      it('updates the value (testing getter/setter)', () => {
        singleton.value = {foo: 'a', bar: 1, bing: true};
        expect(singleton.value).to.eql({foo: 'a', bar: 1, bing: true});
      });

      it('emits UpdateDocumentEvent when set', () => {
        events = {};
        singleton.value = {foo: 'a', bar: 1, bing: true};

        const expectedEvent = {eventType: 'UpdateDocumentEvent', document: {foo: 'a', bar: 1, bing: true}};
        expect(events).to.eql({
          'datastore.events': [expectedEvent],
          'singleton.events': [expectedEvent],
          'singleton.updates': [expectedEvent],
        });
      });
    });

    describe('#update()', () => {
      it('updates the field', () => {
        singleton.value = {foo: 'A', bar: 2, bing: false};

        const result =
            singleton.update(TEST_SCHEMA.fields[0] as StringField<TestDocumentType>, 'bip');
        expect(result).to.eql({foo: 'bip', bar: 2, bing: false});
        expect(singleton.value).to.eql({foo: 'bip', bar: 2, bing: false});

        singleton.update(TEST_SCHEMA.fields[1] as NumberField<TestDocumentType>, 23);
        expect(singleton.value).to.eql({foo: 'bip', bar: 23, bing: false});

        singleton.update(TEST_SCHEMA.fields[2] as BooleanField<TestDocumentType>, true);
        expect(singleton.value).to.eql({foo: 'bip', bar: 23, bing: true});
      });

      it('emits an UpdateDocumentEvent', () => {
        singleton.value = {foo: 'A', bar: 2, bing: false};
        events = {};

        singleton.update(TEST_SCHEMA.fields[0] as StringField<TestDocumentType>, 'B');

        const expectedEvent = {eventType: 'UpdateDocumentEvent', document: {foo: 'B', bar: 2, bing: false}};
        expect(events).to.eql({
          'datastore.events': [expectedEvent],
          'singleton.events': [expectedEvent],
          'singleton.updates': [expectedEvent],
        });
      });
    });

    describe('#serialize()', () => {
      it('converts the singleton to a string', () => {
        singleton.value = {foo: 'A', bar: 2, bing: false};

        const serialized = singleton.serialize();
        expect(serialized).to.equal('{"foo":"A","bar":2,"bing":false}');
      });
    });

    describe('#deserialize()', () => {
      it('restores the singleton\'s state', () => {
        singleton.deserialize('{"foo":"B","bar":2,"bing":false}');
        expect(singleton.value).to.eql({foo: 'B', bar: 2, bing: false});
      });

      it('throws if it can\'t deserialize', () => {
      expect(() => singleton.deserialize('INVALID_SERIALIZATION'))
          .to.throw('Could not deserialize singleton MyDocumentSchema: Unexpected token I in JSON at position 0');
    });
    });
  });
});
