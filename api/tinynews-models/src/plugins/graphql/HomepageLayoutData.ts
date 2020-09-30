import { hasScope } from "@webiny/api-security";
import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const homepageLayoutDataFetcher = ctx => ctx.models.HomepageLayoutData;

export default {
  typeDefs: `
    type HomepageLayoutDataDeleteResponse {
        data: Boolean
        error: HomepageLayoutDataError
    }

    type HomepageLayoutDataCursors {
        next: String
        previous: String
    }

    type HomepageLayoutDataListMeta {
        cursors: HomepageLayoutDataCursors
        hasNextPage: Boolean
        hasPreviousPage: Boolean
        totalCount: Int
    }

    type HomepageLayoutDataError {
        code: String
        message: String
        data: JSON
    }

    type HomepageLayoutData {
        id: ID
        data: String
        layoutSchema: HomepageLayoutSchema
    }

    input HomepageLayoutDataInput {
        id: ID
        data: String
        layoutSchema: ID
    }

    input HomepageLayoutDataListWhere {
        id: ID
    }

    input HomepageLayoutDataListSort {
        id: ID
    }

    type HomepageLayoutDataResponse {
        data: HomepageLayoutData
        error: HomepageLayoutDataError
    }

    type HomepageLayoutDataListResponse {
        data: [HomepageLayoutData]
        meta: HomepageLayoutDataListMeta
        error: HomepageLayoutDataError
    }

    type HomepageLayoutDataQuery {
        getHomepageLayoutData(id: ID): HomepageLayoutDataResponse

        listHomepageLayoutDatas(
            where: HomepageLayoutDataListWhere
            sort: HomepageLayoutDataListSort
            limit: Int
            after: String
            before: String
        ): HomepageLayoutDataListResponse
    }

    type HomepageLayoutDataMutation {
        createHomepageLayoutData(data: HomepageLayoutDataInput!): HomepageLayoutDataResponse

        updateHomepageLayoutData(id: ID!, data: HomepageLayoutDataInput!): HomepageLayoutDataResponse

        deleteHomepageLayoutData(id: ID!): HomepageLayoutDataDeleteResponse
    }
  `,
  resolvers: {
    HomepageLayoutDataQuery: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        getHomepageLayoutData: hasScope("homepageLayoutDatas:get")(resolveGet(homepageLayoutDataFetcher)),
        listHomepageLayoutDatas: hasScope("homepageLayoutDatas:list")(resolveList(homepageLayoutDataFetcher))
    },
    HomepageLayoutDataMutation: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        createHomepageLayoutData: hasScope("homepageLayoutDatas:create")(resolveCreate(homepageLayoutDataFetcher)),
        updateHomepageLayoutData: hasScope("homepageLayoutDatas:update")(resolveUpdate(homepageLayoutDataFetcher)),
        deleteHomepageLayoutData: hasScope("homepageLayoutDatas:delete")(resolveDelete(homepageLayoutDataFetcher))
    },
  }
}