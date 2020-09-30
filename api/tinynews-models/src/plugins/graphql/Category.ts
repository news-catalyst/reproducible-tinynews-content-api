import { hasScope } from "@webiny/api-security";
import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const categoryFetcher = ctx => ctx.models.Category;

export default {
  typeDefs: `
    type CategoryDeleteResponse {
        data: Boolean
        error: CategoryError
    }

    type CategoryCursors {
        next: String
        previous: String
    }

    type CategoryListMeta {
        cursors: CategoryCursors
        hasNextPage: Boolean
        hasPreviousPage: Boolean
        totalCount: Int
    }

    type CategoryError {
        code: String
        message: String
        data: JSON
    }

    type Category {
        id: ID
        title: I18NStringValue
        slug: String
    }

    input CategoryInput {
        id: ID
        title: I18NStringValueInput
        slug: String
    }

    input CategoryListWhere {
        title: String
    }

    input CategoryListSort {
        title: Int
    }

    type CategoryResponse {
        data: Category
        error: CategoryError
    }

    type CategoryListResponse {
        data: [Category]
        meta: CategoryListMeta
        error: CategoryError
    }

    type CategoryQuery {
        getCategory(id: ID): CategoryResponse

        listCategories(
            where: CategoryListWhere
            sort: CategoryListSort
            limit: Int
            after: String
            before: String
        ): CategoryListResponse
    }

    type CategoryMutation {
        createCategory(data: CategoryInput!): CategoryResponse

        updateCategory(id: ID!, data: CategoryInput!): CategoryResponse

        deleteCategory(id: ID!): CategoryDeleteResponse
    }

  `,
  resolvers: {
    CategoryQuery: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        getCategory: hasScope("categories:get")(resolveGet(categoryFetcher)),
        listCategories: hasScope("categories:list")(resolveList(categoryFetcher))
    },
    CategoryMutation: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        createCategory: hasScope("categories:create")(resolveCreate(categoryFetcher)),
        updateCategory: hasScope("categories:update")(resolveUpdate(categoryFetcher)),
        deleteCategory: hasScope("categories:delete")(resolveDelete(categoryFetcher))
    }
  }
}