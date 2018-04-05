import 'reflect-metadata';

import { EsField } from '../src/decorators/EsField';
import { EsMapping } from '../src/decorators/EsMapping';
import { EsProperty } from '../src/decorators/EsProperty';
import { EsSubMapping } from '../src/decorators/EsSubMapping';
import { getMetadata } from '../src/utils/metadata';

describe('decorators', () => {
  describe('EsObject ', () => {
    it('generates metadata', () => {

      @EsSubMapping()
      class Obj {
        @EsProperty()
        aProperty: string;
      }

      @EsSubMapping({ type: 'nested' })
      class Nested {
        @EsProperty()
        aProperty: string;
      }

      @EsSubMapping({ type: 'keyword' })
      class WithFields {
        @EsField()
        keyword: string;
      }

      @EsMapping({
        dynamic: 'strict',
        _source: {
          enabled: true,
        },
      })
      class A {
        @EsProperty()
        keyword: string;

        @EsProperty({ type: String })
        keywordArray: string[];

        @EsProperty({ type: 'text' })
        text: string;
      
        @EsProperty({ type: Obj })
        b: Obj;

        @EsProperty({ type: Nested })
        b: Nested;

        @EsProperty({ type: WithFields })
        withFields: WithFields;
      }

      expect(getMetadata(A.prototype)).toMatchSnapshot();
      expect(getMetadata(A.prototype, 'properties')).toMatchSnapshot();
      expect(getMetadata(A.prototype, 'fields')).toMatchSnapshot();
      expect(getMetadata(Obj.prototype)).toMatchSnapshot();
      expect(getMetadata(Obj.prototype, 'properties')).toMatchSnapshot();
      expect(getMetadata(Obj.prototype, 'fields')).toMatchSnapshot();
      expect(getMetadata(Nested.prototype)).toMatchSnapshot();
      expect(getMetadata(Nested.prototype, 'properties')).toMatchSnapshot();
      expect(getMetadata(Nested.prototype, 'fields')).toMatchSnapshot();
      expect(getMetadata(WithFields.prototype)).toMatchSnapshot();
      expect(getMetadata(WithFields.prototype, 'properties')).toMatchSnapshot();
      expect(getMetadata(WithFields.prototype, 'fields')).toMatchSnapshot();
    });
  });
});
