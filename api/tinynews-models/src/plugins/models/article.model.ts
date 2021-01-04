// @ts-ignore
// import { withFields, withName, string, datetime, boolean, ref } from "@webiny/commodo";
import { withFields, withHooks, withProps, withName, string, boolean, number, ref } from "@webiny/commodo";
import { date } from "commodo-fields-date";
import { flow } from "lodash";
import { i18nString } from "@webiny/api-i18n/fields";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type Article = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }: Article) => {
    if (context && context.i18n) {
        console.log("FOUND I18N ON CONTEXT!");
        console.log("default locale:", context.i18n.getDefaultLocale());
    } else {
        console.log(":( did not find i18n on article context :(");
    }

    const Article: any = flow(
        withName("Article"),
        withFields(() => ({
            version: number(),
            latestVersion: boolean(),
            published: boolean({ value: false }),
            parent: context.commodo.fields.id(),
            availableLocales: string(),
            headline: i18nString({ context }),
            lang: i18nString({context}),
            content: i18nString({ context }),
            headlineSearch: string(),
            slug: string(),
            authorSlugs: string(),
            customByline: string(),
            searchTitle: i18nString({ context }),
            searchDescription: i18nString({ context }),
            twitterTitle: i18nString({ context }),
            twitterDescription: i18nString({ context }),
            facebookTitle: i18nString({ context }),
            facebookDescription: i18nString({ context }),
            firstPublishedOn: date(),
            lastPublishedOn: date(),
            googleDocs: string(),
            docIDs: string(),
            authors: ref({
                list: true,
                instanceOf: context.models.Author,
                using: context.models.Article2Author
            }),
            category: ref({
                list: false,
                instanceOf: context.models.Category
            }),
            tags: ref({
                list: true,
                instanceOf: context.models.Tag,
                using: context.models.Article2Tag
            })
        })),
        withProps({
            async getNextVersion() {
                const revision = await Article.findOne({
                    query: { parent: this.parent },
                    sort: { version: -1 }
                });

                if (!revision) {
                    return 1;
                }

                return revision.version + 1;
            }
        }),
        withHooks({
            async beforeCreate() {
                const existingArticle = await Article.findOne({ query: { slug: this.slug } });
                if (existingArticle) {
                    throw Error(`Article with slug "${this.slug}" already exists.`);
                }

                // set the parent ID
                if (!this.parent) {
                    this.parent = this.id;
                }

                // generate the version ID
                this.version = await this.getNextVersion();
                this.latestVersion = true;

                // When creating revisions number 2 and above, we need to load the previous latest version,
                // and unmark it as latest, since the newly created on is now the latest revision.
                if (this.version > 1) {
                    const previousLatest = await Article.findOne({
                        query: {
                            parent: this.parent,
                            latestVersion: true,
                            version: { $ne: this.version }
                        }
                    });

                    if (previousLatest) {
                        const removeCallback = this.hook("afterCreate", async () => {
                            removeCallback();
                            previousLatest.latestVersion = false;
                            await previousLatest.save();
                        });
                    }
                }
            },
            async beforePublish() {
                // Deactivate previously published revision.
                const publishedRev = await Article.findOne({
                    query: { published: true, parent: this.parent }
                });

                if (publishedRev) {
                    this.hook("afterPublish", async () => {
                        publishedRev.published = false;
                        await publishedRev.save();
                    });
                }
            },
            async beforeDelete() {
                // If parent is being deleted, do not do anything. Both parent and children will be deleted anyways.
                if (this.id === this.parent) {
                    return;
                }

                if (this.version > 1 && this.latestVersion) {
                    this.latestVersion = false;
                    const removeCallback = this.hook("afterDelete", async () => {
                        removeCallback();

                        const previousLatest = await Article.findOne({
                            query: {
                                parent: this.parent
                            },
                            sort: {
                                version: -1
                            }
                        });

                        if (previousLatest) {
                            previousLatest.latestVersion = true;
                            await previousLatest.save();
                        }
                    });
                }
            },

            async afterDelete() {
                // If the deleted article is the parent article - delete its revisions.
                if (this.id === this.parent) {
                    // Delete all revisions
                    const revisions = await Article.find({
                        query: { parent: this.parent }
                    });

                    await Promise.all(revisions.map(rev => rev.delete()));
                }
            }
        })
    )(createBase());
    return Article;
};