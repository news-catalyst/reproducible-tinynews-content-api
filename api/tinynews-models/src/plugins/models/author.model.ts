// @ts-ignore
import { withFields, withName, withHooks, boolean, string, ref } from "@webiny/commodo";
import { i18nString } from "@webiny/api-i18n/fields";
import { flow } from "lodash";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type Author = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }: Author) => {
    const Author: any = flow(
        withName("Author"),
        withFields({
            name: string(),
            title: i18nString({ context }),
            bio: i18nString({context}),
            twitter: string(),
            photoUrl: string(),
            staff: boolean(),
            slug: string(),
            published: boolean({ value: false }),
            articles: ref({
                list: true,
                instanceOf: context.models.Article,
                using: context.models.Article2Author
            })
        }),
        withHooks({
            async beforeCreate() {
                const existing = await Author.findOne({ query: { slug: this.slug } });
                if (existing) {
                    throw Error(`Author with slug "${this.slug}" already exists.`);
                }
            },
        })
    )(createBase());
    return Author;
};