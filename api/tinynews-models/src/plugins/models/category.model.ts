// @ts-ignore
import { withFields, withName, withHooks, string, boolean } from "@webiny/commodo";
import { flow } from "lodash";
import { i18nString } from "@webiny/api-i18n/fields";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type Category = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }: Category) => {
    const Category: any = flow(
        withName("Category"),
        withFields({
            title: i18nString({ context }),
            slug: string(),
            published: boolean({ value: false })
        }),
        withHooks({
            async beforeCreate() {
                const existing = await Category.findOne({ query: { slug: this.slug } });
                if (existing) {
                    throw Error(`Category with slug "${this.slug}" already exists.`);
                }
            },
        })
    )(createBase());
    return Category;
};
