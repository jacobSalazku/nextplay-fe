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
    "query GetUser($teamShortId: String!) {\n  getCurrentUser(teamShortId: $teamShortId) {\n    user {\n      id\n      name\n      email\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n    member {\n      id\n      userId\n      teamId\n      role\n      status\n      number\n      position\n      attendances {\n        id\n        activityId\n        memberId\n        attendanceStatus\n        reason\n        createdAt\n        updatedAt\n        activity {\n          id\n          title\n          time\n          date\n        }\n      }\n    }\n  }\n}": typeof types.GetUserDocument,
    "mutation createTeam($input: CreateTeamInput!) {\n  createTeam(input: $input) {\n    id\n    name\n    image\n    ageGroup\n    code\n    creatorId\n  }\n}": typeof types.CreateTeamDocument,
    "mutation Login($email: String!) {\n  login(email: $email) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Refresh($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Logout {\n  logout\n}": typeof types.LoginDocument,
    "mutation SubmitAttendance($input: PlayerActivityAttendanceInput!) {\n  submitAttendance(input: $input) {\n    id\n    memberId\n    attendanceStatus\n    reason\n  }\n}": typeof types.SubmitAttendanceDocument,
    "mutation AcceptTeamRequest($input: AcceptTeamRequestInput!) {\n  acceptTeamRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}": typeof types.AcceptTeamRequestDocument,
    "mutation JoinTeam($input: JoinTeamInput!) {\n  joinTeam(input: $input) {\n    teamCode\n    position\n    number\n  }\n}": typeof types.JoinTeamDocument,
    "mutation RejectJoinRequest($input: TeamRequestInput!) {\n  rejectJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}": typeof types.RejectJoinRequestDocument,
    "mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    name\n    dateOfBirth\n    phone\n    height\n    weight\n    dominantHand\n  }\n}": typeof types.UpdateUserDocument,
    "query GetTeamForDashboard {\n  getDashboardTeams {\n    id\n    name\n    slug\n    shortId\n    routeKey\n    ageGroup\n    members {\n      id\n    }\n    activities {\n      id\n      type\n      title\n      date\n      time\n    }\n  }\n}": typeof types.GetTeamForDashboardDocument,
    "query GetTeamActivities($teamRef: String!) {\n  getTeamActivities(teamRef: $teamRef) {\n    id\n    name\n    code\n    slug\n    routeKey\n    shortId\n    image\n    ageGroup\n    createdAt\n    updatedAt\n    creatorId\n    members {\n      id\n      name\n      image\n      teamId\n      userId\n    }\n    activities {\n      id\n      teamId\n      type\n      title\n      time\n      duration\n      date\n      createdAt\n      updatedAt\n      attendees {\n        id\n        activityId\n        memberId\n        attendanceStatus\n        reason\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}": typeof types.GetTeamActivitiesDocument,
    "mutation CreateFeedback($input: CreateFeedbackInput!) {\n  createFeedback(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    feedback {\n      notes\n      coach\n    }\n  }\n}": typeof types.CreateFeedbackDocument,
    "mutation CreateFilm($input: CreateFilmInput!) {\n  createFilm(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    film {\n      notes\n    }\n  }\n}": typeof types.CreateFilmDocument,
    "mutation CreateGame($input: CreateGameInput!) {\n  createGame(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    game {\n      location\n    }\n  }\n}": typeof types.CreateGameDocument,
    "mutation CreateMeeting($input: CreateMeetingInput!) {\n  createMeeting(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    meeting {\n      notes\n    }\n  }\n}": typeof types.CreateMeetingDocument,
    "mutation CreatePractice($input: CreatePracticeInput!) {\n  createPractice(input: $input) {\n    title\n    time\n    date\n    duration\n    type\n    practice {\n      facility\n      practicetype\n    }\n  }\n}": typeof types.CreatePracticeDocument,
    "mutation DeleteActivity($input: DeleteActivity!) {\n  deleteActivity(input: $input) {\n    id\n  }\n}": typeof types.DeleteActivityDocument,
    "mutation UpdateFeedback($input: UpdateFeedbackInput!) {\n  updateFeedback(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    teamId\n    feedback {\n      notes\n      coach\n    }\n  }\n}": typeof types.UpdateFeedbackDocument,
    "mutation UpdateFilm($input: UpdateFilmInput!) {\n  updateFilm(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    teamId\n    film {\n      notes\n    }\n  }\n}": typeof types.UpdateFilmDocument,
    "mutation UpdateGame($input: UpdateGameInput!) {\n  updateGame(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    game {\n      location\n    }\n  }\n}": typeof types.UpdateGameDocument,
    "mutation UpdateMeeting($input: UpdateMeetingInput!) {\n  updateMeeting(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    meeting {\n      notes\n    }\n  }\n}": typeof types.UpdateMeetingDocument,
    "mutation UpdatePractice($input: UpdatePracticeInput!) {\n  updatePractice(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    practice {\n      facility\n      practicetype\n    }\n  }\n}": typeof types.UpdatePracticeDocument,
    "mutation DeleteMember($input: DeleteMemberInput!) {\n  deleteMember(input: $input)\n}": typeof types.DeleteMemberDocument,
    "query GetMembers($input: MembersInput!) {\n  getMembers(input: $input) {\n    id\n    userId\n    teamId\n    role\n    status\n    number\n    position\n    name\n    attendances {\n      id\n      activityId\n      memberId\n      attendanceStatus\n      reason\n      createdAt\n      updatedAt\n      activity {\n        id\n        title\n        time\n        date\n      }\n    }\n    user {\n      id\n      name\n      email\n      image\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n  }\n}": typeof types.GetMembersDocument,
    "query GetTeam($input: GetTeamInput!) {\n  getTeam(input: $input) {\n    id\n    name\n    code\n    slug\n    shortId\n    routeKey\n    image\n    ageGroup\n    creatorId\n    createdAt\n    updatedAt\n    members {\n      id\n      teamId\n      name\n      number\n      position\n      image\n      user {\n        id\n        name\n        email\n        image\n        dateOfBirth\n        phone\n        height\n        weight\n        dominantHand\n        hasOnBoarded\n      }\n    }\n  }\n}": typeof types.GetTeamDocument,
    "query GetUserProfile($input: GetMemberProfileInput!) {\n  getUserProfile: getMemberProfile(input: $input) {\n    id\n    userId\n    teamId\n    role\n    status\n    number\n    position\n    name\n    user {\n      id\n      name\n      email\n      image\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n    attendances {\n      id\n      activityId\n      memberId\n      attendanceStatus\n      reason\n      createdAt\n      updatedAt\n      activity {\n        id\n        title\n        time\n        date\n      }\n    }\n  }\n}": typeof types.GetUserProfileDocument,
    "query GetPendingMembers($input: MembersInput!) {\n  getPendingMembers(input: $input) {\n    id\n    name\n    email\n  }\n}": typeof types.GetPendingMembersDocument,
};
const documents: Documents = {
    "query GetUser($teamShortId: String!) {\n  getCurrentUser(teamShortId: $teamShortId) {\n    user {\n      id\n      name\n      email\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n    member {\n      id\n      userId\n      teamId\n      role\n      status\n      number\n      position\n      attendances {\n        id\n        activityId\n        memberId\n        attendanceStatus\n        reason\n        createdAt\n        updatedAt\n        activity {\n          id\n          title\n          time\n          date\n        }\n      }\n    }\n  }\n}": types.GetUserDocument,
    "mutation createTeam($input: CreateTeamInput!) {\n  createTeam(input: $input) {\n    id\n    name\n    image\n    ageGroup\n    code\n    creatorId\n  }\n}": types.CreateTeamDocument,
    "mutation Login($email: String!) {\n  login(email: $email) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Refresh($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken) {\n    accessToken\n    refreshToken\n    hasOnBoarded\n    userId\n  }\n}\n\nmutation Logout {\n  logout\n}": types.LoginDocument,
    "mutation SubmitAttendance($input: PlayerActivityAttendanceInput!) {\n  submitAttendance(input: $input) {\n    id\n    memberId\n    attendanceStatus\n    reason\n  }\n}": types.SubmitAttendanceDocument,
    "mutation AcceptTeamRequest($input: AcceptTeamRequestInput!) {\n  acceptTeamRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}": types.AcceptTeamRequestDocument,
    "mutation JoinTeam($input: JoinTeamInput!) {\n  joinTeam(input: $input) {\n    teamCode\n    position\n    number\n  }\n}": types.JoinTeamDocument,
    "mutation RejectJoinRequest($input: TeamRequestInput!) {\n  rejectJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}": types.RejectJoinRequestDocument,
    "mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    name\n    dateOfBirth\n    phone\n    height\n    weight\n    dominantHand\n  }\n}": types.UpdateUserDocument,
    "query GetTeamForDashboard {\n  getDashboardTeams {\n    id\n    name\n    slug\n    shortId\n    routeKey\n    ageGroup\n    members {\n      id\n    }\n    activities {\n      id\n      type\n      title\n      date\n      time\n    }\n  }\n}": types.GetTeamForDashboardDocument,
    "query GetTeamActivities($teamRef: String!) {\n  getTeamActivities(teamRef: $teamRef) {\n    id\n    name\n    code\n    slug\n    routeKey\n    shortId\n    image\n    ageGroup\n    createdAt\n    updatedAt\n    creatorId\n    members {\n      id\n      name\n      image\n      teamId\n      userId\n    }\n    activities {\n      id\n      teamId\n      type\n      title\n      time\n      duration\n      date\n      createdAt\n      updatedAt\n      attendees {\n        id\n        activityId\n        memberId\n        attendanceStatus\n        reason\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}": types.GetTeamActivitiesDocument,
    "mutation CreateFeedback($input: CreateFeedbackInput!) {\n  createFeedback(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    feedback {\n      notes\n      coach\n    }\n  }\n}": types.CreateFeedbackDocument,
    "mutation CreateFilm($input: CreateFilmInput!) {\n  createFilm(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    film {\n      notes\n    }\n  }\n}": types.CreateFilmDocument,
    "mutation CreateGame($input: CreateGameInput!) {\n  createGame(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    game {\n      location\n    }\n  }\n}": types.CreateGameDocument,
    "mutation CreateMeeting($input: CreateMeetingInput!) {\n  createMeeting(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    meeting {\n      notes\n    }\n  }\n}": types.CreateMeetingDocument,
    "mutation CreatePractice($input: CreatePracticeInput!) {\n  createPractice(input: $input) {\n    title\n    time\n    date\n    duration\n    type\n    practice {\n      facility\n      practicetype\n    }\n  }\n}": types.CreatePracticeDocument,
    "mutation DeleteActivity($input: DeleteActivity!) {\n  deleteActivity(input: $input) {\n    id\n  }\n}": types.DeleteActivityDocument,
    "mutation UpdateFeedback($input: UpdateFeedbackInput!) {\n  updateFeedback(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    teamId\n    feedback {\n      notes\n      coach\n    }\n  }\n}": types.UpdateFeedbackDocument,
    "mutation UpdateFilm($input: UpdateFilmInput!) {\n  updateFilm(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    teamId\n    film {\n      notes\n    }\n  }\n}": types.UpdateFilmDocument,
    "mutation UpdateGame($input: UpdateGameInput!) {\n  updateGame(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    game {\n      location\n    }\n  }\n}": types.UpdateGameDocument,
    "mutation UpdateMeeting($input: UpdateMeetingInput!) {\n  updateMeeting(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    meeting {\n      notes\n    }\n  }\n}": types.UpdateMeetingDocument,
    "mutation UpdatePractice($input: UpdatePracticeInput!) {\n  updatePractice(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    practice {\n      facility\n      practicetype\n    }\n  }\n}": types.UpdatePracticeDocument,
    "mutation DeleteMember($input: DeleteMemberInput!) {\n  deleteMember(input: $input)\n}": types.DeleteMemberDocument,
    "query GetMembers($input: MembersInput!) {\n  getMembers(input: $input) {\n    id\n    userId\n    teamId\n    role\n    status\n    number\n    position\n    name\n    attendances {\n      id\n      activityId\n      memberId\n      attendanceStatus\n      reason\n      createdAt\n      updatedAt\n      activity {\n        id\n        title\n        time\n        date\n      }\n    }\n    user {\n      id\n      name\n      email\n      image\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n  }\n}": types.GetMembersDocument,
    "query GetTeam($input: GetTeamInput!) {\n  getTeam(input: $input) {\n    id\n    name\n    code\n    slug\n    shortId\n    routeKey\n    image\n    ageGroup\n    creatorId\n    createdAt\n    updatedAt\n    members {\n      id\n      teamId\n      name\n      number\n      position\n      image\n      user {\n        id\n        name\n        email\n        image\n        dateOfBirth\n        phone\n        height\n        weight\n        dominantHand\n        hasOnBoarded\n      }\n    }\n  }\n}": types.GetTeamDocument,
    "query GetUserProfile($input: GetMemberProfileInput!) {\n  getUserProfile: getMemberProfile(input: $input) {\n    id\n    userId\n    teamId\n    role\n    status\n    number\n    position\n    name\n    user {\n      id\n      name\n      email\n      image\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n    attendances {\n      id\n      activityId\n      memberId\n      attendanceStatus\n      reason\n      createdAt\n      updatedAt\n      activity {\n        id\n        title\n        time\n        date\n      }\n    }\n  }\n}": types.GetUserProfileDocument,
    "query GetPendingMembers($input: MembersInput!) {\n  getPendingMembers(input: $input) {\n    id\n    name\n    email\n  }\n}": types.GetPendingMembersDocument,
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
export function graphql(source: "query GetUser($teamShortId: String!) {\n  getCurrentUser(teamShortId: $teamShortId) {\n    user {\n      id\n      name\n      email\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n    member {\n      id\n      userId\n      teamId\n      role\n      status\n      number\n      position\n      attendances {\n        id\n        activityId\n        memberId\n        attendanceStatus\n        reason\n        createdAt\n        updatedAt\n        activity {\n          id\n          title\n          time\n          date\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query GetUser($teamShortId: String!) {\n  getCurrentUser(teamShortId: $teamShortId) {\n    user {\n      id\n      name\n      email\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n    member {\n      id\n      userId\n      teamId\n      role\n      status\n      number\n      position\n      attendances {\n        id\n        activityId\n        memberId\n        attendanceStatus\n        reason\n        createdAt\n        updatedAt\n        activity {\n          id\n          title\n          time\n          date\n        }\n      }\n    }\n  }\n}"];
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
export function graphql(source: "mutation SubmitAttendance($input: PlayerActivityAttendanceInput!) {\n  submitAttendance(input: $input) {\n    id\n    memberId\n    attendanceStatus\n    reason\n  }\n}"): (typeof documents)["mutation SubmitAttendance($input: PlayerActivityAttendanceInput!) {\n  submitAttendance(input: $input) {\n    id\n    memberId\n    attendanceStatus\n    reason\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AcceptTeamRequest($input: AcceptTeamRequestInput!) {\n  acceptTeamRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}"): (typeof documents)["mutation AcceptTeamRequest($input: AcceptTeamRequestInput!) {\n  acceptTeamRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation JoinTeam($input: JoinTeamInput!) {\n  joinTeam(input: $input) {\n    teamCode\n    position\n    number\n  }\n}"): (typeof documents)["mutation JoinTeam($input: JoinTeamInput!) {\n  joinTeam(input: $input) {\n    teamCode\n    position\n    number\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RejectJoinRequest($input: TeamRequestInput!) {\n  rejectJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}"): (typeof documents)["mutation RejectJoinRequest($input: TeamRequestInput!) {\n  rejectJoinRequest(input: $input) {\n    memberId\n    teamId\n    status\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    name\n    dateOfBirth\n    phone\n    height\n    weight\n    dominantHand\n  }\n}"): (typeof documents)["mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    name\n    dateOfBirth\n    phone\n    height\n    weight\n    dominantHand\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTeamForDashboard {\n  getDashboardTeams {\n    id\n    name\n    slug\n    shortId\n    routeKey\n    ageGroup\n    members {\n      id\n    }\n    activities {\n      id\n      type\n      title\n      date\n      time\n    }\n  }\n}"): (typeof documents)["query GetTeamForDashboard {\n  getDashboardTeams {\n    id\n    name\n    slug\n    shortId\n    routeKey\n    ageGroup\n    members {\n      id\n    }\n    activities {\n      id\n      type\n      title\n      date\n      time\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTeamActivities($teamRef: String!) {\n  getTeamActivities(teamRef: $teamRef) {\n    id\n    name\n    code\n    slug\n    routeKey\n    shortId\n    image\n    ageGroup\n    createdAt\n    updatedAt\n    creatorId\n    members {\n      id\n      name\n      image\n      teamId\n      userId\n    }\n    activities {\n      id\n      teamId\n      type\n      title\n      time\n      duration\n      date\n      createdAt\n      updatedAt\n      attendees {\n        id\n        activityId\n        memberId\n        attendanceStatus\n        reason\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}"): (typeof documents)["query GetTeamActivities($teamRef: String!) {\n  getTeamActivities(teamRef: $teamRef) {\n    id\n    name\n    code\n    slug\n    routeKey\n    shortId\n    image\n    ageGroup\n    createdAt\n    updatedAt\n    creatorId\n    members {\n      id\n      name\n      image\n      teamId\n      userId\n    }\n    activities {\n      id\n      teamId\n      type\n      title\n      time\n      duration\n      date\n      createdAt\n      updatedAt\n      attendees {\n        id\n        activityId\n        memberId\n        attendanceStatus\n        reason\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateFeedback($input: CreateFeedbackInput!) {\n  createFeedback(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    feedback {\n      notes\n      coach\n    }\n  }\n}"): (typeof documents)["mutation CreateFeedback($input: CreateFeedbackInput!) {\n  createFeedback(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    feedback {\n      notes\n      coach\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateFilm($input: CreateFilmInput!) {\n  createFilm(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    film {\n      notes\n    }\n  }\n}"): (typeof documents)["mutation CreateFilm($input: CreateFilmInput!) {\n  createFilm(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    film {\n      notes\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateGame($input: CreateGameInput!) {\n  createGame(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    game {\n      location\n    }\n  }\n}"): (typeof documents)["mutation CreateGame($input: CreateGameInput!) {\n  createGame(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    game {\n      location\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateMeeting($input: CreateMeetingInput!) {\n  createMeeting(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    meeting {\n      notes\n    }\n  }\n}"): (typeof documents)["mutation CreateMeeting($input: CreateMeetingInput!) {\n  createMeeting(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    meeting {\n      notes\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePractice($input: CreatePracticeInput!) {\n  createPractice(input: $input) {\n    title\n    time\n    date\n    duration\n    type\n    practice {\n      facility\n      practicetype\n    }\n  }\n}"): (typeof documents)["mutation CreatePractice($input: CreatePracticeInput!) {\n  createPractice(input: $input) {\n    title\n    time\n    date\n    duration\n    type\n    practice {\n      facility\n      practicetype\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteActivity($input: DeleteActivity!) {\n  deleteActivity(input: $input) {\n    id\n  }\n}"): (typeof documents)["mutation DeleteActivity($input: DeleteActivity!) {\n  deleteActivity(input: $input) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateFeedback($input: UpdateFeedbackInput!) {\n  updateFeedback(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    teamId\n    feedback {\n      notes\n      coach\n    }\n  }\n}"): (typeof documents)["mutation UpdateFeedback($input: UpdateFeedbackInput!) {\n  updateFeedback(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    teamId\n    feedback {\n      notes\n      coach\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateFilm($input: UpdateFilmInput!) {\n  updateFilm(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    teamId\n    film {\n      notes\n    }\n  }\n}"): (typeof documents)["mutation UpdateFilm($input: UpdateFilmInput!) {\n  updateFilm(input: $input) {\n    id\n    title\n    time\n    date\n    type\n    teamId\n    film {\n      notes\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateGame($input: UpdateGameInput!) {\n  updateGame(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    game {\n      location\n    }\n  }\n}"): (typeof documents)["mutation UpdateGame($input: UpdateGameInput!) {\n  updateGame(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    game {\n      location\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateMeeting($input: UpdateMeetingInput!) {\n  updateMeeting(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    meeting {\n      notes\n    }\n  }\n}"): (typeof documents)["mutation UpdateMeeting($input: UpdateMeetingInput!) {\n  updateMeeting(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    meeting {\n      notes\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePractice($input: UpdatePracticeInput!) {\n  updatePractice(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    practice {\n      facility\n      practicetype\n    }\n  }\n}"): (typeof documents)["mutation UpdatePractice($input: UpdatePracticeInput!) {\n  updatePractice(input: $input) {\n    id\n    title\n    time\n    date\n    duration\n    type\n    teamId\n    practice {\n      facility\n      practicetype\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteMember($input: DeleteMemberInput!) {\n  deleteMember(input: $input)\n}"): (typeof documents)["mutation DeleteMember($input: DeleteMemberInput!) {\n  deleteMember(input: $input)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetMembers($input: MembersInput!) {\n  getMembers(input: $input) {\n    id\n    userId\n    teamId\n    role\n    status\n    number\n    position\n    name\n    attendances {\n      id\n      activityId\n      memberId\n      attendanceStatus\n      reason\n      createdAt\n      updatedAt\n      activity {\n        id\n        title\n        time\n        date\n      }\n    }\n    user {\n      id\n      name\n      email\n      image\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n  }\n}"): (typeof documents)["query GetMembers($input: MembersInput!) {\n  getMembers(input: $input) {\n    id\n    userId\n    teamId\n    role\n    status\n    number\n    position\n    name\n    attendances {\n      id\n      activityId\n      memberId\n      attendanceStatus\n      reason\n      createdAt\n      updatedAt\n      activity {\n        id\n        title\n        time\n        date\n      }\n    }\n    user {\n      id\n      name\n      email\n      image\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTeam($input: GetTeamInput!) {\n  getTeam(input: $input) {\n    id\n    name\n    code\n    slug\n    shortId\n    routeKey\n    image\n    ageGroup\n    creatorId\n    createdAt\n    updatedAt\n    members {\n      id\n      teamId\n      name\n      number\n      position\n      image\n      user {\n        id\n        name\n        email\n        image\n        dateOfBirth\n        phone\n        height\n        weight\n        dominantHand\n        hasOnBoarded\n      }\n    }\n  }\n}"): (typeof documents)["query GetTeam($input: GetTeamInput!) {\n  getTeam(input: $input) {\n    id\n    name\n    code\n    slug\n    shortId\n    routeKey\n    image\n    ageGroup\n    creatorId\n    createdAt\n    updatedAt\n    members {\n      id\n      teamId\n      name\n      number\n      position\n      image\n      user {\n        id\n        name\n        email\n        image\n        dateOfBirth\n        phone\n        height\n        weight\n        dominantHand\n        hasOnBoarded\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUserProfile($input: GetMemberProfileInput!) {\n  getUserProfile: getMemberProfile(input: $input) {\n    id\n    userId\n    teamId\n    role\n    status\n    number\n    position\n    name\n    user {\n      id\n      name\n      email\n      image\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n    attendances {\n      id\n      activityId\n      memberId\n      attendanceStatus\n      reason\n      createdAt\n      updatedAt\n      activity {\n        id\n        title\n        time\n        date\n      }\n    }\n  }\n}"): (typeof documents)["query GetUserProfile($input: GetMemberProfileInput!) {\n  getUserProfile: getMemberProfile(input: $input) {\n    id\n    userId\n    teamId\n    role\n    status\n    number\n    position\n    name\n    user {\n      id\n      name\n      email\n      image\n      dateOfBirth\n      phone\n      height\n      weight\n      dominantHand\n      hasOnBoarded\n    }\n    attendances {\n      id\n      activityId\n      memberId\n      attendanceStatus\n      reason\n      createdAt\n      updatedAt\n      activity {\n        id\n        title\n        time\n        date\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetPendingMembers($input: MembersInput!) {\n  getPendingMembers(input: $input) {\n    id\n    name\n    email\n  }\n}"): (typeof documents)["query GetPendingMembers($input: MembersInput!) {\n  getPendingMembers(input: $input) {\n    id\n    name\n    email\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;