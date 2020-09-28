import { hasScope } from "@webiny/api-security";
import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const homepageLayoutSchemaFetcher = ctx => ctx.models.HomepageLayoutSchema;

export default {
  typeDefs: `
    type HomepageLayoutSchemaDeleteResponse {
        data: Boolean
        error: HomepageLayoutSchemaError
    }

    type HomepageLayoutSchemaCursors {
        next: String
        previous: String
    }

    type HomepageLayoutSchemaListMeta {
        cursors: HomepageLayoutSchemaCursors
        hasNextPage: Boolean
        hasPreviousPage: Boolean
        totalCount: Int
    }

    type HomepageLayoutSchemaError {
        code: String
        message: String
        data: JSON
    }

    type HomepageLayoutSchema {
        id: ID
        name: String
        data: String
    }

    input HomepageLayoutSchemaInput {
        id: ID
        name: String
        data: String
    }

    input HomepageLayoutSchemaListWhere {
        id: ID
    }

    input HomepageLayoutSchemaListSort {
        id: ID
    }

    type HomepageLayoutSchemaResponse {
        data: HomepageLayoutSchema
        error: HomepageLayoutSchemaError
    }

    type HomepageLayoutSchemaListResponse {
        data: [HomepageLayoutSchema]
        meta: HomepageLayoutSchemaListMeta
        error: HomepageLayoutSchemaError
    }

    type HomepageLayoutSchemaQuery {
        getHomepageLayoutSchema(id: ID): HomepageLayoutSchemaResponse

        listHomepageLayoutSchemas(
            where: HomepageLayoutSchemaListWhere
            sort: HomepageLayoutSchemaListSort
            limit: Int
            after: String
            before: String
        ): HomepageLayoutSchemaListResponse
    }

    type HomepageLayoutSchemaMutation {
        createHomepageLayoutSchema(data: HomepageLayoutSchemaInput!): HomepageLayoutSchemaResponse

        updateHomepageLayoutSchema(id: ID!, data: HomepageLayoutSchemaInput!): HomepageLayoutSchemaResponse

        deleteHomepageLayoutSchema(id: ID!): HomepageLayoutSchemaDeleteResponse
    }
  `,
  resolvers: {
    HomepageLayoutSchemaQuery: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        getHomepageLayoutSchema: hasScope("homepageLayoutSchemas:get")(resolveGet(homepageLayoutSchemaFetcher)),
        listHomepageLayoutSchemas: hasScope("homepageLayoutSchemas:list")(resolveList(homepageLayoutSchemaFetcher))
    },
    HomepageLayoutSchemaMutation: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        createHomepageLayoutSchema: hasScope("homepageLayoutSchemas:create")(resolveCreate(homepageLayoutSchemaFetcher)),
        updateHomepageLayoutSchema: hasScope("homepageLayoutSchemas:update")(resolveUpdate(homepageLayoutSchemaFetcher)),
        deleteHomepageLayoutSchema: hasScope("homepageLayoutSchemas:delete")(resolveDelete(homepageLayoutSchemaFetcher))
    },
  }
}