// @ts-ignore
import { withFields, withHooks, withName, string, datetime, boolean, ref } from "@webiny/commodo";
import { flow } from "lodash";
import { i18nString } from "@webiny/api-i18n/fields";

export default ({ context, createBase }) => {
    const Article: any = flow(
        withName("Article"),
        withFields(() => ({
            headline: i18nString({ context }),
            content: i18nString({ context }),
            authorSlugs: string(),
            customByline: string(),
            slug: string(),
            searchTitle: i18nString({ context }),
            searchDescription: i18nString({ context }),
            twitterTitle: i18nString({ context }),
            twitterDescription: i18nString({ context }),
            facebookTitle: i18nString({ context }),
            facebookDescription: i18nString({ context }),
            authors: ref({
                list: true,
                instanceOf: context.models.Author
            }),
            category: ref({
                list: false,
                instanceOf: context.models.Category
            }),
            tags: ref({
                list: true,
                instanceOf: context.models.Tag
            }),
            firstPublishedOn: datetime(),
            lastPublishedOn: datetime(),
            published: boolean({ value: false })
        })),
        withHooks({
            async beforeCreate() {
                const existingArticle = await Article.findOne({ query: { slug: this.slug } });
                if (existingArticle) {
                    throw Error(`Article with slug "${this.slug}" already exists.`);
                }
            },
        })
    )(createBase());
    return Article;
};