// @ts-ignore
import { withFields, withName, boolean } from "@webiny/commodo";
import { i18nString } from "@webiny/api-i18n/fields";
import { flow } from "lodash";
import { date } from "commodo-fields-date";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type SiteMetadata = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }: SiteMetadata) => {
    const SiteMetadata: any = flow(
        withName("SiteMetadata"),
        withFields({
            data: i18nString({ context }),
            published: boolean({ value: false }),
            firstPublishedOn: date(),
            lastPublishedOn: date(),
        })
    )(createBase());
    return SiteMetadata;
};
