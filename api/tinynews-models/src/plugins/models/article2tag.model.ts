// @ts-ignore
import { withFields, withName, ref } from "@webiny/commodo";
import { flow } from "lodash";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type Article2Tag = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }) => {
    const Article2Tag: any = flow(
        withName("Article2Tag"),
        withFields({
            article: ref({ instanceOf: context.models.Article }),
            tag: ref({ instanceOf: context.models.Tag }),
        }),
    )(createBase());
    return Article2Tag;
};
