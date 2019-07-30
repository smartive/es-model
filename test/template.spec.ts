import 'reflect-metadata';

import { EsField } from '../src/decorators/EsField';
import { EsMapping } from '../src/decorators/EsMapping';
import { EsProperty } from '../src/decorators/EsProperty';
import { EsSubMapping } from '../src/decorators/EsSubMapping';
import { buildMappings } from '../src/utils/template';

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
        c: Nested;

        @EsProperty({ type: WithFields })
        withFields: WithFields;
      }

      expect(buildMappings([A])).toMatchSnapshot();
    });
  });
});
