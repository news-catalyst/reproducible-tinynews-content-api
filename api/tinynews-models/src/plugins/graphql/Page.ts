import { hasScope } from "@webiny/api-security";
import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const pageFetcher = ctx => ctx.models.Page;

export default {
  typeDefs: `
    type PageDeleteResponse {
        data: Boolean
        error: PageError
    }

    type PageCursors {
        next: String
        previous: String
    }

    type PageListMeta {
        cursors: PageCursors
        hasNextPage: Boolean
        hasPreviousPage: Boolean
        totalCount: Int
    }

    type PageError {
        code: String
        message: String
        data: JSON
    }

    type Page {
        id: ID
        headline: String
        content: String
        slug: String
        searchTitle: String
        searchDescription: String
        twitterTitle: String
        twitterDescription: String
        facebookTitle: String
        facebookDescription: String
        createdOn: DateTime
        updatedOn: DateTime
    }

    input PageInput {
        id: ID
        headline: String
        content: String
        slug: String
        searchTitle: String
        searchDescription: String
        twitterTitle: String
        twitterDescription: String
        facebookTitle: String
        facebookDescription: String
        createdOn: DateTime
        updatedOn: DateTime
    }

    input PageListWhere {
        headline: String
        slug: String
    }

    input PageListSort {
        headline: Int
        createdOn: Int
    }

    type PageResponse {
        data: Page
        error: PageError
    }

    type PageListResponse {
        data: [Page]
        meta: PageListMeta
        error: PageError
    }

    type PageQuery {
        getPage(id: ID): PageResponse

        listPages(
            where: PageListWhere
            sort: PageListSort
            limit: Int
            after: String
            before: String
        ): PageListResponse
    }

    type PageMutation {
        createPage(data: PageInput!): PageResponse

        updatePage(id: ID!, data: PageInput!): PageResponse

        deletePage(id: ID!): PageDeleteResponse
    }
  `,
  resolvers: {
    PageQuery: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        getPage: hasScope("pages:get")(resolveGet(pageFetcher)),
        listPages: hasScope("pages:list")(resolveList(pageFetcher))
    },
    PageMutation: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        createPage: hasScope("pages:create")(resolveCreate(pageFetcher)),
        updatePage: hasScope("pages:update")(resolveUpdate(pageFetcher)),
        deletePage: hasScope("pages:delete")(resolveDelete(pageFetcher))
    },
  }
}