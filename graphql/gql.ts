/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation createTeam($input: CreateTeamInput!) {\n  createTeam(input: $input) {\n    id\n    name\n    image\n    ageGroup\n    code\n    creatorId\n  }\n}": typeof types.CreateTeamDocument,
    "mutation Login($email: String!) {\n  login(email: $email) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Refresh($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Logout {\n  logout\n}": typeof types.LoginDocument,
    "mutation ApproveJoinRequest($input: ApproveJoinRequestInput!) {\n  approveJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}": typeof types.ApproveJoinRequestDocument,
    "mutation JoinTeam($input: JoinTeamInput!) {\n  joinTeam(input: $input) {\n    teamCode\n    position\n    number\n  }\n}": typeof types.JoinTeamDocument,
    "mutation RejectJoinRequest($input: ApproveJoinRequestInput!) {\n  rejectJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}": typeof types.RejectJoinRequestDocument,
    "mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    name\n    dateOfBirth\n    phone\n    height\n    weight\n    dominantHand\n  }\n}": typeof types.UpdateUserDocument,
    "query GetTeamForDashboard {\n  getDashboardTeams {\n    id\n    name\n    ageGroup\n    members {\n      id\n    }\n    activities {\n      id\n      type\n      title\n      date\n      time\n    }\n  }\n}": typeof types.GetTeamForDashboardDocument,
};
const documents: Documents = {
    "mutation createTeam($input: CreateTeamInput!) {\n  createTeam(input: $input) {\n    id\n    name\n    image\n    ageGroup\n    code\n    creatorId\n  }\n}": types.CreateTeamDocument,
    "mutation Login($email: String!) {\n  login(email: $email) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Refresh($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Logout {\n  logout\n}": types.LoginDocument,
    "mutation ApproveJoinRequest($input: ApproveJoinRequestInput!) {\n  approveJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}": types.ApproveJoinRequestDocument,
    "mutation JoinTeam($input: JoinTeamInput!) {\n  joinTeam(input: $input) {\n    teamCode\n    position\n    number\n  }\n}": types.JoinTeamDocument,
    "mutation RejectJoinRequest($input: ApproveJoinRequestInput!) {\n  rejectJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}": types.RejectJoinRequestDocument,
    "mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    name\n    dateOfBirth\n    phone\n    height\n    weight\n    dominantHand\n  }\n}": types.UpdateUserDocument,
    "query GetTeamForDashboard {\n  getDashboardTeams {\n    id\n    name\n    ageGroup\n    members {\n      id\n    }\n    activities {\n      id\n      type\n      title\n      date\n      time\n    }\n  }\n}": types.GetTeamForDashboardDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation createTeam($input: CreateTeamInput!) {\n  createTeam(input: $input) {\n    id\n    name\n    image\n    ageGroup\n    code\n    creatorId\n  }\n}"): (typeof documents)["mutation createTeam($input: CreateTeamInput!) {\n  createTeam(input: $input) {\n    id\n    name\n    image\n    ageGroup\n    code\n    creatorId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($email: String!) {\n  login(email: $email) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Refresh($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Logout {\n  logout\n}"): (typeof documents)["mutation Login($email: String!) {\n  login(email: $email) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Refresh($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ApproveJoinRequest($input: ApproveJoinRequestInput!) {\n  approveJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}"): (typeof documents)["mutation ApproveJoinRequest($input: ApproveJoinRequestInput!) {\n  approveJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation JoinTeam($input: JoinTeamInput!) {\n  joinTeam(input: $input) {\n    teamCode\n    position\n    number\n  }\n}"): (typeof documents)["mutation JoinTeam($input: JoinTeamInput!) {\n  joinTeam(input: $input) {\n    teamCode\n    position\n    number\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RejectJoinRequest($input: ApproveJoinRequestInput!) {\n  rejectJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}"): (typeof documents)["mutation RejectJoinRequest($input: ApproveJoinRequestInput!) {\n  rejectJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    name\n    dateOfBirth\n    phone\n    height\n    weight\n    dominantHand\n  }\n}"): (typeof documents)["mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    name\n    dateOfBirth\n    phone\n    height\n    weight\n    dominantHand\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTeamForDashboard {\n  getDashboardTeams {\n    id\n    name\n    ageGroup\n    members {\n      id\n    }\n    activities {\n      id\n      type\n      title\n      date\n      time\n    }\n  }\n}"): (typeof documents)["query GetTeamForDashboard {\n  getDashboardTeams {\n    id\n    name\n    ageGroup\n    members {\n      id\n    }\n    activities {\n      id\n      type\n      title\n      date\n      time\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;