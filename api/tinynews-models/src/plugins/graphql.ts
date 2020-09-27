import gql from "graphql-tag";
import { GraphQLSchemaPlugin } from "@webiny/graphql/types";
import { hasScope } from "@webiny/api-security";
import {
    emptyResolver,
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const articleFetcher = ctx => ctx.models.Article;
const categoryFetcher = ctx => ctx.models.Category;

/**
 * As the name itself suggests, the "graphql-schema" plugin enables us to define our service's GraphQL schema.
 * Use the "schema" and "resolvers" properties to define GraphQL types and resolvers, respectively.
 * Resolvers can be made from scratch, but to make it a bit easier, we rely on a couple of built-in generic
 * resolvers, imported from the "@webiny/commodo-graphql" package.
 *
 * @see https://docs.webiny.com/docs/api-development/graphql
 */
const plugin: GraphQLSchemaPlugin = {
    type: "graphql-schema",
    name: "graphql-schema-tinynews",
    schema: {
        typeDefs: gql`
            type ArticleDeleteResponse {
                data: Boolean
                error: ArticleError
            }

            type ArticleCursors {
                next: String
                previous: String
            }

            type ArticleListMeta {
                cursors: ArticleCursors
                hasNextPage: Boolean
                hasPreviousPage: Boolean
                totalCount: Int
            }

            type ArticleError {
                code: String
                message: String
                data: JSON
            }

            type Article {
                id: ID
                headline: String
                content: String
                authorSlugs: String
                slug: String
                customByline: String
                searchTitle: String
                searchDescription: String
                twitterTitle: String
                twitterDescription: String
                facebookTitle: String
                facebookDescription: String
                createdOn: DateTime
            }

            input ArticleInput {
                id: ID
                headline: String!
                content: String
                authorSlugs: String
                slug: String
                customByline: String
                searchTitle: String
                searchDescription: String
                twitterTitle: String
                twitterDescription: String
                facebookTitle: String
                facebookDescription: String
                createdOn: DateTime
            }

            input ArticleListWhere {
                headline: String
            }

            input ArticleListSort {
                headline: Int
                createdOn: Int
            }

            type ArticleResponse {
                data: Article
                error: ArticleError
            }

            type ArticleListResponse {
                data: [Article]
                meta: ArticleListMeta
                error: ArticleError
            }

            type ArticleQuery {
                getArticle(id: ID): ArticleResponse

                listArticles(
                    where: ArticleListWhere
                    sort: ArticleListSort
                    limit: Int
                    after: String
                    before: String
                ): ArticleListResponse
            }

            type ArticleMutation {
                createArticle(data: ArticleInput!): ArticleResponse

                updateArticle(id: ID!, data: ArticleInput!): ArticleResponse

                deleteArticle(id: ID!): ArticleDeleteResponse
            }

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
                title: String
                slug: String
            }

            input CategoryInput {
                id: ID
                title: String!
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

                listCategorys(
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

            extend type Query {
                articles: ArticleQuery
                categories: CategoryQuery
            }

            extend type Mutation {
                articles: ArticleMutation
                categories: CategoryMutation
            }
        `,
        resolvers: {
            Query: {
                // Needs to be here, otherwise the resolvers below cannot return any result.
                articles: emptyResolver,
                categories: emptyResolver
            },
            Mutation: {
                // Needs to be here, otherwise the resolvers below cannot return any result.
                articles: emptyResolver,
                categories: emptyResolver
            },
            ArticleQuery: {
                // With the generic resolvers, we also rely on the "hasScope" helper function from the
                // "@webiny/api-security" package, in order to define the required security scopes (permissions).
                getArticle: hasScope("articles:get")(resolveGet(articleFetcher)),
                listArticles: hasScope("articles:list")(resolveList(articleFetcher))
            },
            ArticleMutation: {
                // With the generic resolvers, we also rely on the "hasScope" helper function from the
                // "@webiny/api-security" package, in order to define the required security scopes (permissions).
                createArticle: hasScope("articles:create")(resolveCreate(articleFetcher)),
                updateArticle: hasScope("articles:update")(resolveUpdate(articleFetcher)),
                deleteArticle: hasScope("articles:delete")(resolveDelete(articleFetcher))
            },
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
};

export default plugin;
