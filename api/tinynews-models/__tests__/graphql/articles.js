// We use these fields in every query / mutation below.
const ERROR_FIELDS = /* GraphQL */ `
    {
        code
        message
        data
    }
`;

// A basic create "Article" mutation.
export const CREATE_ARTICLE = /* GraphQL */ `
    mutation CreateArticle($data: ArticleInput!) {
        articles {
            createArticle(data: $data) {
                data {
                    id
                    headline {
                        values {
                            value
                        }
                    }
                }
                error ${ERROR_FIELDS}
            }
        }
    }
`;

// A basic list "Articles" query.
export const LIST_ARTICLES = /* GraphQL */ `
    query ListArticles(
        $where: ArticleListWhere
        $sort: ArticleListSort
        $limit: Int
        $after: String
        $before: String
    ) {
        articles {
            listArticles(where: $where, sort: $sort, limit: $limit, after: $after, before: $before) {
                data {
                    id
                    headline {
                        values {
                            value
                        }
                    }
                }
                error ${ERROR_FIELDS}

            }
        }
    }
`;
