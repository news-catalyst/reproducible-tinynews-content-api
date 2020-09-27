import useGqlHandler from "./useGqlHandler";
import { CREATE_ARTICLE, LIST_ARTICLES } from "./graphql/articles";

/**
 * This is a simple test that asserts basic CRUD operations work as expected.
 * Feel free to update this test according to changes you made in the actual code.
 *
 * @see https://docs.webiny.com/docs/api-development/introduction
 */
describe("CRUD Test", () => {
    const { invoke } = useGqlHandler();

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Let's create a couple of articles.
        let [article1] = await invoke({
            body: {
                query: CREATE_ARTICLE,
                variables: {
                    data: {
                        headline: "Article 1",
                        content: "This is my 1st article."
                    }
                }
            }
        });

        let [article2] = await invoke({
            body: {
                query: CREATE_ARTICLE,
                variables: {
                    data: { headline: "Article 2", content: "This is my 2nd article." }
                }
            }
        });

        let [article3] = await invoke({
            body: {
                query: CREATE_ARTICLE,
                variables: {
                    data: { headline: "Article 3" }
                }
            }
        });

        // 2. Now that we have articles created, let's see if they come up in a basic listArticles query.
        let [articlesList] = await invoke({
            body: {
                query: LIST_ARTICLES
            }
        });

        expect(articlesList).toEqual({
            data: {
                articles: {
                    listArticles: {
                        data: [
                            {
                                id: article3.data.articles.createArticle.data.id,
                                headline: "Article 3",
                                content: null
                            },
                            {
                                id: article2.data.articles.createArticle.data.id,
                                headline: "Article 2",
                                content: "This is my 2nd article."
                            },
                            {
                                id: article1.data.articles.createArticle.data.id,
                                headline: "Article 1",
                                content: "This is my 1st article."
                            }
                        ],
                        error: null
                    }
                }
            }
        });
    });

    it("should throw a validation error if headline is invalid", async () => {
        // The title field is missing, the error should be thrown from the GraphQL and the resolver won't be executedd.
        let [body] = await invoke({
            body: {
                query: CREATE_ARTICLE,
                variables: {
                    data: { content: "This is my 1st article."}
                }
            }
        });

        let [error] = body.errors;
        expect(error.message).toBe(
            'Variable "$data" got invalid value { content: "This is my 1st article." }; Field headline of required type String! was not provided.'
        );

        // Even though the headline is provided, it is still too short (because of the validation
        // set on the "Article" Commodo model).
        [body] = await invoke({
            body: {
                query: CREATE_ARTICLE,
                variables: {
                    data: { headline: "Aa", content: "This is my 1st article."}
                }
            }
        });

        expect(body).toEqual({
            data: {
                articles: {
                    createArticle: {
                        data: null,
                        error: {
                            code: "VALIDATION_FAILED_INVALID_FIELDS",
                            message: "Validation failed.",
                            data: {
                                invalidFields: {
                                    headline: "Value requires at least 3 characters."
                                }
                            }
                        }
                    }
                }
            }
        });
    });
});
