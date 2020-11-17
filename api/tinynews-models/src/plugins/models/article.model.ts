// @ts-ignore
// import { withFields, withName, string, datetime, boolean, ref } from "@webiny/commodo";
import { withFields, withHooks, withName, string, boolean, ref } from "@webiny/commodo";
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
            published: boolean({ value: false }),
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
        withHooks({
            async beforeCreate() {
                console.log("beforeCreate headline values:", this.headline.values);
                console.log("beforeCreate lang values:", this.lang.values);
                const existingArticle = await Article.findOne({ query: { slug: this.slug } });
                if (existingArticle) {
                    throw Error(`Article with slug "${this.slug}" already exists.`);
                }
            },
        })
    )(createBase());
    return Article;
};