// @ts-ignore
import { withFields, withName, ref } from "@webiny/commodo";
import { flow } from "lodash";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type Article2Author = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }) => {
    const Article2Author: any = flow(
        withName("Article2Author"),
        withFields({
            article: ref({
                list: false,
                instanceOf: context.models.Article
            }),
            author: ref({
                list: false,
                instanceOf: context.models.Author
            })
        }),
    )(createBase());
    return Article2Author;
};
