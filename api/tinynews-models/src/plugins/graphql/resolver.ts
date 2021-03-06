import parseBoolean from "@webiny/commodo-graphql/parseBoolean";
import { WithFieldsError } from "@webiny/commodo";
import { InvalidFieldsError } from "@webiny/commodo-graphql";
import {
  Response,
  ErrorResponse,
    ListResponse,
    requiresTotalCount
} from "@webiny/graphql";
import { FieldResolver } from "@webiny/commodo-graphql/types";

type GetModelType = (context: Object) => any; // TODO: add commodo type when available

export const resolveCreateFrom = (getModel: GetModelType): FieldResolver => async (
  root,
  args,
  context
) => {
  const Model: any = getModel(context);

  const baseRevision = await Model.findById(args.revision);
  if (!baseRevision) {
      console.log("existing entry not found")
      return new ErrorResponse({
          code: "404",
          message: "Existing entry not found",
          data: args
      });
      // return entryNotFound(JSON.stringify(args.where));
  }

  // create a new version of the content
  const newRevision = new Model();

  // ensure the new version shares the same parent, slug and env (what's the env? think we're missing that one)
  newRevision.parent = baseRevision.parent;
  newRevision.slug = baseRevision.slug;

  newRevision.firstPublishedOn = baseRevision.firstPublishedOn;
  newRevision.lastPublishedOn = baseRevision.lastPublishedOn;

  try {
    // now overwrite fields with incoming data, which will never include parent
      await newRevision.populate(args.data).save();
  } catch (e) {
      if (
          e instanceof WithFieldsError &&
          e.code === WithFieldsError.VALIDATION_FAILED_INVALID_FIELDS
      ) {
          const fieldError = InvalidFieldsError.from(e);
          return new ErrorResponse({
              code: fieldError.code || WithFieldsError.VALIDATION_FAILED_INVALID_FIELDS,
              message: fieldError.message,
              data: fieldError.data
          });
      }
      return new ErrorResponse({
          code: e.code,
          message: e.message,
          data: e.data
      });
  }
  return new Response(newRevision);
};

export const resolvePublish = (getModel: GetModelType): FieldResolver => async (
  root,
  args,
  context
) => {
  const Model: any = getModel(context);

  const existingEntry = await Model.findById(args.revision);
  if (!existingEntry) {
      return new ErrorResponse({
          code: "404",
          message: "Existing entry not found",
          data: args
      });
  }

  try {
    existingEntry.published = true;
    if (existingEntry.firstPublishedOn === null || existingEntry.firstPublishedOn === undefined) {
      existingEntry.firstPublishedOn = new Date();
    }
    existingEntry.lastPublishedOn = new Date();
    await existingEntry.save();
    return new Response(existingEntry);
  } catch (e) {
    return new ErrorResponse({
        code: e.code,
        message: e.message,
        data: e.data || null
    });
  }
}

export const resolveUnpublish = (getModel: GetModelType): FieldResolver => async (
  root,
  args,
  context
) => {
  const Model: any = getModel(context);

  const existingEntry = await Model.findById(args.revision);
  if (!existingEntry) {
      console.log("existing entry not found")
      return new ErrorResponse({
          code: "404",
          message: "Existing entry not found",
          data: args
      });
  }

  try {
    existingEntry.published = false;
    await existingEntry.save();
    return new Response(existingEntry);
  } catch (e) {
    return new ErrorResponse({
        code: e.code,
        message: e.message,
        data: e.data || null
    });
  }
}

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

  if (args.where && args.where.headline_contains) {
    console.log("found arg for headline_contains:", args.where.headline_contains)
    const regex = new RegExp(`${args.where.headline_contains}`, 'i');
    find.query.headlineSearch = { $regex: regex }
    delete find.query.headline_contains;
  }

  if (args.where && args.where.authorSlugs_contains) {
    console.log("found arg for authorSlugs_contains:", args.where.authorSlugs_contains)
    const regex = new RegExp(`${args.where.authorSlugs_contains}`, 'i');
    find.query.authorSlugs = { $regex: regex }
    delete find.query.authorSlugs_contains;
  }

  if (args.where && args.where.availableLocales_contains) {
    console.log("found arg for availableLocales_contains:", args.where.availableLocales_contains)
    const regex = new RegExp(`${args.where.availableLocales_contains}`, 'i');
    find.query.availableLocales = { $regex: regex }
    delete find.query.availableLocales_contains;
  }

  if (args.where && args.where.docIDs_contains) {
    console.log("found arg for docIDs_contains:", args.where.docIDs_contains)
    const regex = new RegExp(`${args.where.docIDs_contains}`, 'i');
    find.query.docIDs = { $regex: regex }
    delete find.query.docIDs_contains;
  }

  if (args.search && args.search.query) {
      find.search = {
          query: args.search.query,
          fields: args.search.fields,
          operator: args.search.operator || "or"
      };
  }

  // console.log("find:", find);
  // console.log("findJSON:", JSON.stringify(find));
  const data = await Model.find(find);
  // console.log("data:", data);
  // console.log("dataJSON:", JSON.stringify(data));

  return new ListResponse(data, data.getMeta());
};

export const resolveArticleList = (getModel: GetModelType): FieldResolver => async (
  root,
  args,
  context,
  info
) => {
  const Model: any = getModel(context);

  parseBoolean(args);
  const query = { ...args.where };

  query.latestVersion = true;
  console.log("resolveArticleList query:", query);

  const find: any = {
      query,
      limit: args.limit,
      after: args.after,
      before: args.before,
      sort: args.sort,
      totalCount: requiresTotalCount(info)
  };

  if (args.where && args.where.headline_contains) {
    console.log("found arg for headline_contains:", args.where.headline_contains)
    const regex = new RegExp(`${args.where.headline_contains}`, 'i');
    find.query.headlineSearch = { $regex: regex }
    delete find.query.headline_contains;
  }

  if (args.where && args.where.authorSlugs_contains) {
    console.log("found arg for authorSlugs_contains:", args.where.authorSlugs_contains)
    const regex = new RegExp(`${args.where.authorSlugs_contains}`, 'i');
    find.query.authorSlugs = { $regex: regex }
    delete find.query.authorSlugs_contains;
  }

  if (args.where && args.where.availableLocales_contains) {
    console.log("found arg for availableLocales_contains:", args.where.availableLocales_contains)
    const regex = new RegExp(`${args.where.availableLocales_contains}`, 'i');
    find.query.availableLocales = { $regex: regex }
    delete find.query.availableLocales_contains;
  }

  if (args.where && args.where.docIDs_contains) {
    console.log("found arg for docIDs_contains:", args.where.docIDs_contains)
    const regex = new RegExp(`${args.where.docIDs_contains}`, 'i');
    find.query.docIDs = { $regex: regex }
    delete find.query.docIDs_contains;
  }

  if (args.search && args.search.query) {
      find.search = {
          query: args.search.query,
          fields: args.search.fields,
          operator: args.search.operator || "or"
      };
  }

  // console.log("find:", find);
  // console.log("findJSON:", JSON.stringify(find));
  const data = await Model.find(find);
  // console.log("data:", data);
  // console.log("dataJSON:", JSON.stringify(data));

  return new ListResponse(data, data.getMeta());
};
