// @ts-ignore
import { withFields, withHooks, withName, string, boolean, ref } from "@webiny/commodo";
import { flow } from "lodash";
import { i18nString } from "@webiny/api-i18n/fields";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type Tag = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }) => {
    const Tag: any = flow(
        withName("Tag"),
        withFields({
            title: i18nString({ context }),
            slug: string(),
            published: boolean({ value: false }),
            articles: ref({
                list: true,
                instanceOf: context.models.Article,
                using: context.models.Article2Tag
            })
        }),
        withHooks({
            async beforeCreate() {
                const existingTag = await Tag.findOne({ query: { slug: this.slug } });
                if (existingTag) {
                    throw Error(`Tag with slug "${this.slug}" already exists.`);
                }
            },
        })
    )(createBase());
    return Tag;
};
