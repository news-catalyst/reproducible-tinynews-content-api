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
        headline: I18NStringValue
        content: I18NStringValue
        slug: String
        searchTitle: I18NStringValue
        searchDescription: I18NStringValue
        twitterTitle: I18NStringValue
        twitterDescription: I18NStringValue
        facebookTitle: I18NStringValue
        facebookDescription: I18NStringValue
        createdOn: DateTime
        updatedOn: DateTime
        firstPublishedOn: DateTime
        lastPublishedOn: DateTime
        published: Boolean
    }

    input PageInput {
        id: ID
        headline: I18NStringValueInput
        content: I18NStringValueInput
        slug: String
        searchTitle: I18NStringValueInput
        searchDescription: I18NStringValueInput
        twitterTitle: I18NStringValueInput
        twitterDescription: I18NStringValueInput
        facebookTitle: I18NStringValueInput
        facebookDescription: I18NStringValueInput
        firstPublishedOn: DateTime
        lastPublishedOn: DateTime
        published: Boolean
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