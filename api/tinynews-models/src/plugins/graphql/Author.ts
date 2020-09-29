import { hasScope } from "@webiny/api-security";
import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const authorFetcher = ctx => ctx.models.Author;

export default {
  typeDefs: `
    type AuthorDeleteResponse {
        data: Boolean
        error: AuthorError
    }

    type AuthorCursors {
        next: String
        previous: String
    }

    type AuthorListMeta {
        cursors: AuthorCursors
        hasNextPage: Boolean
        hasPreviousPage: Boolean
        totalCount: Int
    }

    type AuthorError {
        code: String
        message: String
        data: JSON
    }

    type Author {
        id: ID
        createdOn: DateTime
        updatedOn: DateTime
        name: CmsText
        title: CmsText
        bio: CmsLongText
        twitter: CmsText
        photoUrl: CmsText
        slug: CmsText
        staff: CmsBoolean
    }

    input AuthorInput {
        id: ID
        name: CmsTextInput
        title: CmsTextInput
        bio: CmsLongTextInput
        twitter: CmsTextInput
        photoUrl: CmsTextInput
        slug: CmsTextInput
        staff: CmsBooleanInput
    }

    input AuthorListWhere {
        name: String
    }

    input AuthorListSort {
        name: Int
    }

    type AuthorResponse {
        data: Author
        error: AuthorError
    }

    type AuthorListResponse {
        data: [Author]
        meta: AuthorListMeta
        error: AuthorError
    }

    type AuthorQuery {
        getAuthor(id: ID): AuthorResponse

        listAuthors(
            where: AuthorListWhere
            sort: AuthorListSort
            limit: Int
            after: String
            before: String
        ): AuthorListResponse
    }

    type AuthorMutation {
        createAuthor(data: AuthorInput!): AuthorResponse

        updateAuthor(id: ID!, data: AuthorInput!): AuthorResponse

        deleteAuthor(id: ID!): AuthorDeleteResponse
    }

  `,
  resolvers: {
    AuthorQuery: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        getAuthor: hasScope("authors:get")(resolveGet(authorFetcher)),
        listAuthors: hasScope("authors:list")(resolveList(authorFetcher))
    },
    AuthorMutation: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        createAuthor: hasScope("authors:create")(resolveCreate(authorFetcher)),
        updateAuthor: hasScope("authors:update")(resolveUpdate(authorFetcher)),
        deleteAuthor: hasScope("authors:delete")(resolveDelete(authorFetcher))
    }
  }
}