import parseBoolean from "@webiny/commodo-graphql/parseBoolean";
import {
    ListResponse,
    requiresTotalCount
} from "@webiny/graphql";
import { FieldResolver } from "@webiny/commodo-graphql/types";

type GetModelType = (context: Object) => any; // TODO: add commodo type when available

export const resolveList = (getModel: GetModelType): FieldResolver => async (
  root,
  args,
  context,
  info
) => {
  const Model: any = getModel(context);

  parseBoolean(args);
  const query = { ...args.where };
  const find: any = {
      query,
      limit: args.limit,
      after: args.after,
      before: args.before,
      sort: args.sort,
      totalCount: requiresTotalCount(info)
  };

  console.log("args:", args);
  if (args.where && args.where.headline_contains) {
    console.log("found arg for headline_contains:", args.where.headline_contains)
    const regex = new RegExp(`${args.where.headline_contains}`, 'i');
    find.query.headlineSearch = { $regex: regex }
    // todo: figure out how to keep other bits of the `where` (line #19) except this?
    // or maybe it's fine to just use `delete` here.
    delete find.query.headline_contains;
  }

  if (args.search && args.search.query) {
      find.search = {
          query: args.search.query,
          fields: args.search.fields,
          operator: args.search.operator || "or"
      };
  }

  console.log("find:", find);
  console.log("findJSON:", JSON.stringify(find));
  const data = await Model.find(find);
  console.log("data:", data);
  // console.log("dataJSON:", JSON.stringify(data));

  return new ListResponse(data, data.getMeta());
};
