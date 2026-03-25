import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { Context } from '../types/context';
import GraphQLJSON from 'graphql-type-json';
@Global()
@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      context: ({ req, res }: Context) => ({ req, res }),
      autoSchemaFile: join(process.cwd(), 'src/common/graph-ql/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      debug: true,
      installSubscriptionHandlers: true,
      resolvers: { JSON: GraphQLJSON },
      subscriptions: {
        'graphql-ws': true,
      },
    }),
  ],
})
export class GraphQlModule {}
