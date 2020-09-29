import { hasScope } from "@webiny/api-security";
import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const articleFetcher = ctx => ctx.models.Article;

export default {
  typeDefs: `
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

    type CmsRefArticleAuthorsList {
      value(locale: String): [Author]
      values: [CmsRefArticleAuthorsListLocalized]!
    }
    
    type CmsRefArticleAuthorsListLocalized {
      value: [Author]
      locale: ID!
    }

    type CmsRefArticleTagsList {
        value(locale: String): [Tag]
        values: [CmsRefArticleTagsListLocalized]!
    }
      
    type CmsRefArticleTagsListLocalized {
        value: [Tag]
        locale: ID!
    }

    type CmsRefArticleCategory {
        value(locale: String): Category
        values: [CmsRefArticleCategoryLocalized]!
      }
      
    type CmsRefArticleCategoryLocalized {
        value: Category
        locale: ID!
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
        updatedOn: DateTime
        firstPublishedOn: DateTime
        lastPublishedOn: DateTime
        category: Category
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
        firstPublishedOn: DateTime
        lastPublishedOn: DateTime
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
  `,
  resolvers: {
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
  }
}