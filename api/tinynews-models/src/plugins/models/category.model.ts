// @ts-ignore
import { withFields, withName, string, pipe } from "@webiny/commodo";
import { validation } from "@webiny/validation";
import { flow } from "lodash";

/**
 * A simple "Category" data model, that consists of a couple of simple fields.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
// https://github.com/fsdevcoder/webiny-js-new/blob/68e2533a1a7c00124f57f6b73336463f122968ad/packages/api-security/src/plugins/models/securityGroup.model.ts
export default ({ createBase }) => {
    const Category: any = flow(
        withName("Category"),
        withFields({
            title: string({ validation: validation.create("required,minLength:3") }),
            slug: string()
        })
    )(createBase());

    return Category;
};

// export default ({ createBase }) => 
//     pipe(
//         withName("Category"),
//         withFields(() => ({
//             title: string({ validation: validation.create("required,minLength:3") }),
//             slug: string()
//         }))
//     )(createBase());