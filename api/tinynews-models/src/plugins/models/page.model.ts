// @ts-ignore
import { withFields, withName, withHooks, string, boolean } from "@webiny/commodo";
import { date } from "commodo-fields-date";
import { flow } from "lodash";
import { i18nString } from "@webiny/api-i18n/fields";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type Page = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }: Page) => {
    const Page: any = flow(
        withName("Page"),
        withFields(() => ({
            headline: i18nString({ context }),
            content: i18nString({ context }),
            slug: string(),
            searchTitle: i18nString({ context }),
            searchDescription: i18nString({ context }),
            twitterTitle: i18nString({ context }),
            twitterDescription: i18nString({ context }),
            facebookTitle: i18nString({ context }),
            facebookDescription: i18nString({ context }),
            firstPublishedOn: date(),
            lastPublishedOn: date(),
            published: boolean({ value: false })
        })),
        withHooks({
            async beforeCreate() {
                const existing = await Page.findOne({ query: { slug: this.slug } });
                if (existing) {
                    throw Error(`Page with slug "${this.slug}" already exists.`);
                }
            },
        })
    )(createBase());
    return Page;
};