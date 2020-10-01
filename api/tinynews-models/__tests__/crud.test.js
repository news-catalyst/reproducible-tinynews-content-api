import useGqlHandler from "./useGqlHandler";
import { CREATE_ARTICLE, LIST_ARTICLES } from "./graphql/articles";
import { CREATE_AUTHOR, LIST_AUTHORS } from "./graphql/authors";

/**
 * This is a simple test that asserts basic CRUD operations work as expected.
 * Feel free to update this test according to changes you made in the actual code.
 *
 * @see https://docs.webiny.com/docs/api-development/introduction
 */
describe("CRUD Test", () => {
    const { invoke } = useGqlHandler();
    const LOCALE_ID = "5f72a88c08c5c000077849bd";

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Let's create a couple of articles.
        let [author1] = await invoke({
            body: {
                query: CREATE_AUTHOR,
                variables: {
                    data: {
                            name: "Jacqui Lough",
                            title: {
                                values: [
                                    {
                                        value: "Staff Writer",
                                        locale: LOCALE_ID,
                                    }
                                ]
                            },
                            bio: { 
                              values: [
                                  {
                                    value: "Jacqui Lough is a staff writer.",
                                    locale: LOCALE_ID,
                                  }
                              ]
                            },
                            twitter: "@jacqui",
                            slug: "jacqui-lough",
                            photoUrl: "http://imgur.com/photo.jpg"
                    }
                }
            }
        });
        console.log("author1:", author1);

        // 1. Let's create a couple of articles.
        let [article1] = await invoke({
            body: {
                query: CREATE_ARTICLE,
                variables: {
                    data: {
                        headline: {
                            values: [
                                {
                                    value: "Article 1",
                                    locale: LOCALE_ID,
                                }
                            ]
                        }
                    }
                }
            }
        });
        console.log("article1:", article1);

        let [article2] = await invoke({
            body: {
                query: CREATE_ARTICLE,
                variables: {
                    data: {
                        headline: {
                            values: [
                                {
                                    value: "Article 2",
                                    locale: LOCALE_ID,
                                }
                            ]
                        }
                    }
                }
            }
        });

        console.log("article2:", article2);

        let [article3] = await invoke({
            body: {
                query: CREATE_ARTICLE,
                variables: {
                    data: {
                        headline: {
                            values: [
                                {
                                    value: "Article 3",
                                    locale: LOCALE_ID,
                                }
                            ]
                        }
                    }
                }
            }
        });

        console.log("article3:", article3);

    //     // 2. Now that we have articles created, let's see if they come up in a basic listArticles query.
    //     let [articlesList] = await invoke({
    //         body: {
    //             query: LIST_ARTICLES
    //         }
    //     });

    //     expect(articlesList).toEqual({
    //         data: {
    //             articles: {
    //                 listArticles: {
    //                     data: [
    //                         {
    //                             id: article3.data.articles.createArticle.data.id,
    //                             headline: { value: "Article 3" },
    //                         },
    //                         {
    //                             id: article2.data.articles.createArticle.data.id,
    //                             headline: { value: "Article 2" },
    //                         },
    //                         {
    //                             id: article1.data.articles.createArticle.data.id,
    //                             headline: { value: "Article 1" },
    //                         }
    //                     ],
    //                     error: null
    //                 }
    //             }
    //         }
    //     });
    // });

    // it("should throw a validation error if headline is invalid", async () => {
    //     // The title field is missing, the error should be thrown from the GraphQL and the resolver won't be executedd.
    //     let [body] = await invoke({
    //         body: {
    //             query: CREATE_ARTICLE,
    //             variables: {
    //                 data: { 
    //                     content: {
    //                         values: [
    //                             {
    //                                 value: "This is my 1st article.",
    //                                 locale: "5f72a88c08c5c000077849bd"
    //                             }
    //                         ]
    //                     }
    //                 }
    //             }
    //         }
    //     });

    //     let [error] = body.errors;
    //     expect(error.message).toBe(
    //         'Field "headline" of type "I18NStringValue" must have a selection of subfields. Did you mean "headline { ... }"?'
    //     );

    //     // Even though the headline is provided, it is still too short (because of the validation
    //     // set on the "Article" Commodo model).
    //     [body] = await invoke({
    //         body: {
    //             query: CREATE_ARTICLE,
    //             variables: {
    //                 data: { 
    //                     headline: {
    //                         values: [
    //                             {
    //                                 value: "Aa",
    //                                 locale: "5f72a88c08c5c000077849bd"
    //                             }
    //                         ]
    //                     }
    //                 }
    //             }
    //         }
    //     });

    //     expect(body).toEqual({
    //         data: {
    //             articles: {
    //                 createArticle: {
    //                     data: null,
    //                     error: {
    //                         code: "VALIDATION_FAILED_INVALID_FIELDS",
    //                         message: "Validation failed.",
    //                         data: {
    //                             invalidFields: {
    //                                 headline: "Value requires at least 3 characters."
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     });
    });
});
