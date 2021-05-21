import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from '../graphql'

const schema = makeSchema({
  shouldGenerateArtifacts: true,
  types,
  // all fields are non nullable by default
  nonNullDefaults: { output: true, input: true },
  outputs: {
    typegen: join(__dirname, 'generated/types.gen.ts'),
    schema: join(__dirname, 'generated/schema.gen.graphql'),
  },
  contextType: {
    alias: 'ctx',
    export: 'ResolverContext',
    module: join(__dirname, '../api'),
  },
  sourceTypes: {
    modules: [
      {
        module: join(__dirname, '../graphql/sourceTypes.ts'),
        alias: 'sourceTypes',
      },
    ],
  },
})

export default schema
