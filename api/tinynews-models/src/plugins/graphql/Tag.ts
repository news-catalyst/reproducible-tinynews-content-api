import { hasScope } from "@webiny/api-security";
import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const tagFetcher = ctx => ctx.models.Tag;

export default {
  typeDefs: `
    type TagDeleteResponse {
        data: Boolean
        error: TagError
    }

    type TagCursors {
        next: String
        previous: String
    }

    type TagListMeta {
        cursors: TagCursors
        hasNextPage: Boolean
        hasPreviousPage: Boolean
        totalCount: Int
    }

    type TagError {
        code: String
        message: String
        data: JSON
    }

    type Tag {
        id: ID
        title: String
        slug: String
    }

    input TagInput {
        title: String
        slug: String
    }

    input TagListWhere {
        title: String
    }

    input TagListSort {
        title: Int
    }

    type TagResponse {
        data: Tag
        error: TagError
    }

    type TagListResponse {
        data: [Tag]
        meta: TagListMeta
        error: TagError
    }

    type TagQuery {
        getTag(id: ID): TagResponse

        listTags(
            where: TagListWhere
            sort: TagListSort
            limit: Int
            after: String
            before: String
        ): TagListResponse
    }

    type TagMutation {
        createTag(data: TagInput!): TagResponse

        updateTag(id: ID!, data: TagInput!): TagResponse

        deleteTag(id: ID!): TagDeleteResponse
    }

  `,
  resolvers: {
    TagQuery: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        getTag: hasScope("tags:get")(resolveGet(tagFetcher)),
        listCategories: hasScope("tags:list")(resolveList(tagFetcher))
    },
    TagMutation: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        createTag: hasScope("tags:create")(resolveCreate(tagFetcher)),
        updateTag: hasScope("tags:update")(resolveUpdate(tagFetcher)),
        deleteTag: hasScope("tags:delete")(resolveDelete(tagFetcher))
    }
  }
}