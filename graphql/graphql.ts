/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AcceptTeamRequestInput = {
  memberId: Scalars['String']['input'];
  teamRef: Scalars['String']['input'];
};

export type Activity = {
  __typename?: 'Activity';
  attendees: Array<PlayerActivityAttendance>;
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  duration?: Maybe<Scalars['Float']['output']>;
  feedback?: Maybe<Feedback>;
  film?: Maybe<Film>;
  game?: Maybe<Game>;
  id: Scalars['ID']['output'];
  meeting?: Maybe<Meeting>;
  practice?: Maybe<Practice>;
  teamId: Scalars['String']['output'];
  time: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: ActivityType;
  updatedAt: Scalars['DateTime']['output'];
};

export enum ActivityType {
  Feedback = 'FEEDBACK',
  Film = 'FILM',
  Game = 'GAME',
  Meeting = 'MEETING',
  Practice = 'PRACTICE'
}

export type AttendanceActivity = {
  __typename?: 'AttendanceActivity';
  date: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  time: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export enum AttendanceStatus {
  Attending = 'ATTENDING',
  Late = 'LATE',
  NotAttending = 'NOT_ATTENDING'
}

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  hasOnBoarded: Scalars['Boolean']['output'];
  refreshToken: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type CreateFeedbackInput = {
  coach: Scalars['String']['input'];
  date: Scalars['DateTime']['input'];
  duration: Scalars['Float']['input'];
  notes: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
  time: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: ActivityType;
};

export type CreateFilmInput = {
  date: Scalars['DateTime']['input'];
  duration: Scalars['Float']['input'];
  notes: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
  time: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: ActivityType;
};

export type CreateGameInput = {
  date: Scalars['DateTime']['input'];
  duration: Scalars['Float']['input'];
  location: Location;
  teamId: Scalars['String']['input'];
  time: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: ActivityType;
};

export type CreateMeetingInput = {
  date: Scalars['DateTime']['input'];
  duration: Scalars['Float']['input'];
  notes: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
  time: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: ActivityType;
};

export type CreatePracticeInput = {
  date: Scalars['DateTime']['input'];
  duration: Scalars['Float']['input'];
  facility: Scalars['String']['input'];
  practiceType: PracticeType;
  teamId: Scalars['String']['input'];
  time: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: ActivityType;
};

export type CreateTeamInput = {
  ageGroup: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type DeleteActivity = {
  id: Scalars['ID']['input'];
};

export type DeleteMemberInput = {
  id: Scalars['String']['input'];
};

export type Feedback = {
  __typename?: 'Feedback';
  activityId: Scalars['String']['output'];
  coach: Scalars['String']['output'];
  notes: Scalars['String']['output'];
};

export type Film = {
  __typename?: 'Film';
  activityId: Scalars['String']['output'];
  notes: Scalars['String']['output'];
};

export type Game = {
  __typename?: 'Game';
  activityId: Scalars['String']['output'];
  location: Location;
};

export type GetAttendanceByActivitiesInput = {
  activityId: Scalars['String']['input'];
  memberId: Scalars['String']['input'];
};

export type GetTeamInput = {
  teamRef: Scalars['String']['input'];
};

export type GetUserResponse = {
  __typename?: 'GetUserResponse';
  member: Member;
  user: UserProfile;
};

export type JoinTeamInput = {
  number: Scalars['String']['input'];
  position: Scalars['String']['input'];
  teamCode: Scalars['String']['input'];
};

export type JoinTeamResponse = {
  __typename?: 'JoinTeamResponse';
  number: Scalars['String']['output'];
  position: Scalars['String']['output'];
  teamCode: Scalars['String']['output'];
};

export enum Location {
  Away = 'AWAY',
  Home = 'HOME'
}

export type Meeting = {
  __typename?: 'Meeting';
  activityId: Scalars['String']['output'];
  notes: Scalars['String']['output'];
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  role: Role;
  status: Status;
  teamId: Scalars['String']['output'];
  user?: Maybe<UserDetail>;
  userId: Scalars['String']['output'];
};

export type MemberId = {
  __typename?: 'MemberId';
  id: Scalars['String']['output'];
};

export type MemberWithAttendances = {
  __typename?: 'MemberWithAttendances';
  attendances: Array<PlayerActivityAttendance>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  role: Role;
  status: Status;
  teamId: Scalars['String']['output'];
  user?: Maybe<UserDetail>;
  userId: Scalars['String']['output'];
};

export type MembersInput = {
  teamRef: Scalars['String']['input'];
};

export type ModerateJoinRequestResult = {
  __typename?: 'ModerateJoinRequestResult';
  memberId: Scalars['String']['output'];
  status: Status;
  teamId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptTeamRequest: ModerateJoinRequestResult;
  createFeedback: Activity;
  createFilm: Activity;
  createGame: Activity;
  createMeeting: Activity;
  createPractice: Activity;
  createTeam: Team;
  deleteActivity: Activity;
  deleteMember: Scalars['Boolean']['output'];
  getAttendanceByActivities: PlayerActivityAttendance;
  joinTeam: JoinTeamResponse;
  login: AuthPayload;
  logout: Scalars['Boolean']['output'];
  refresh: AuthPayload;
  rejectJoinRequest: ModerateJoinRequestResult;
  submitAttendance: PlayerActivityAttendance;
  updateFeedback: Activity;
  updateFilm: Activity;
  updateGame: Activity;
  updateMeeting: Activity;
  updatePractice: Activity;
  updateUser: User;
};


export type MutationAcceptTeamRequestArgs = {
  input: AcceptTeamRequestInput;
};


export type MutationCreateFeedbackArgs = {
  input: CreateFeedbackInput;
};


export type MutationCreateFilmArgs = {
  input: CreateFilmInput;
};


export type MutationCreateGameArgs = {
  input: CreateGameInput;
};


export type MutationCreateMeetingArgs = {
  input: CreateMeetingInput;
};


export type MutationCreatePracticeArgs = {
  input: CreatePracticeInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationDeleteActivityArgs = {
  input: DeleteActivity;
};


export type MutationDeleteMemberArgs = {
  input: DeleteMemberInput;
};


export type MutationGetAttendanceByActivitiesArgs = {
  input: GetAttendanceByActivitiesInput;
};


export type MutationJoinTeamArgs = {
  input: JoinTeamInput;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRejectJoinRequestArgs = {
  input: TeamRequestInput;
};


export type MutationSubmitAttendanceArgs = {
  input: PlayerActivityAttendanceInput;
};


export type MutationUpdateFeedbackArgs = {
  input: UpdateFeedbackInput;
};


export type MutationUpdateFilmArgs = {
  input: UpdateFilmInput;
};


export type MutationUpdateGameArgs = {
  input: UpdateGameInput;
};


export type MutationUpdateMeetingArgs = {
  input: UpdateMeetingInput;
};


export type MutationUpdatePracticeArgs = {
  input: UpdatePracticeInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type PendingMember = {
  __typename?: 'PendingMember';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type PlayerActivityAttendance = {
  __typename?: 'PlayerActivityAttendance';
  activity?: Maybe<AttendanceActivity>;
  activityId: Scalars['String']['output'];
  attendanceStatus: AttendanceStatus;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  memberId: Scalars['String']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PlayerActivityAttendanceInput = {
  activityId: Scalars['String']['input'];
  attendanceStatus: AttendanceStatus;
  memberId: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};

export type Practice = {
  __typename?: 'Practice';
  activityId: Scalars['String']['output'];
  facility: Scalars['String']['output'];
  practicetype: Scalars['String']['output'];
};

export enum PracticeType {
  Physical = 'PHYSICAL',
  Shooting = 'SHOOTING',
  Specialisation = 'SPECIALISATION',
  Team = 'TEAM'
}

export type Query = {
  __typename?: 'Query';
  _ping: Scalars['Boolean']['output'];
  getActivities: Array<Activity>;
  getDashboardTeams: Array<TeamDashboard>;
  getMembers: Array<MemberWithAttendances>;
  getPendingMembers: Array<PendingMember>;
  getTeam: TeamInformation;
  getTeamActivities: Team;
  getUserById: GetUserResponse;
  me: User;
};


export type QueryGetActivitiesArgs = {
  teamShortId: Scalars['String']['input'];
};


export type QueryGetMembersArgs = {
  input: MembersInput;
};


export type QueryGetPendingMembersArgs = {
  input: MembersInput;
};


export type QueryGetTeamArgs = {
  input: GetTeamInput;
};


export type QueryGetTeamActivitiesArgs = {
  teamRef: Scalars['String']['input'];
};


export type QueryGetUserByIdArgs = {
  teamShortId: Scalars['String']['input'];
};

export enum Role {
  Coach = 'COACH',
  Player = 'PLAYER'
}

export enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

export type Team = {
  __typename?: 'Team';
  activities: Array<Activity>;
  ageGroup?: Maybe<Scalars['String']['output']>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  creatorId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  members: Array<TeamMemberUser>;
  name: Scalars['String']['output'];
  routeKey: Scalars['String']['output'];
  shortId: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TeamDashboard = {
  __typename?: 'TeamDashboard';
  activities: Array<Activity>;
  ageGroup?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  members: Array<MemberId>;
  name: Scalars['String']['output'];
  routeKey: Scalars['String']['output'];
  shortId: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type TeamInformation = {
  __typename?: 'TeamInformation';
  ageGroup?: Maybe<Scalars['String']['output']>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  creatorId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  members: Array<TeamMemberInfo>;
  name: Scalars['String']['output'];
  routeKey: Scalars['String']['output'];
  shortId: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TeamMemberInfo = {
  __typename?: 'TeamMemberInfo';
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  teamId: Scalars['String']['output'];
  user: UserDetail;
};

export type TeamMemberUser = {
  __typename?: 'TeamMemberUser';
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  teamId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type TeamRequestInput = {
  memberId: Scalars['String']['input'];
};

export type UpdateFeedbackInput = {
  coach?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFilmInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGameInput = {
  location?: InputMaybe<Location>;
};

export type UpdateMeetingInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePracticeInput = {
  facility?: InputMaybe<Scalars['String']['input']>;
  practiceType?: InputMaybe<PracticeType>;
};

export type UpdateUserInput = {
  dateOfBirth: Scalars['String']['input'];
  dominantHand: Scalars['String']['input'];
  height: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  weight: Scalars['Float']['input'];
};

export type User = {
  __typename?: 'User';
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  dominantHand?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailVerified?: Maybe<Scalars['DateTime']['output']>;
  hasOnBoarded: Scalars['Boolean']['output'];
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  isBlocked: Scalars['Boolean']['output'];
  members: Array<Member>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  tokenVersion: Scalars['Float']['output'];
  weight?: Maybe<Scalars['Float']['output']>;
};

export type UserDetail = {
  __typename?: 'UserDetail';
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  dominantHand?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  hasOnBoarded: Scalars['Boolean']['output'];
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type UserProfile = {
  __typename?: 'UserProfile';
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  dominantHand?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  hasOnBoarded?: Maybe<Scalars['Boolean']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type GetUserQueryVariables = Exact<{
  teamShortId: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUserById: { __typename?: 'GetUserResponse', user: { __typename?: 'UserProfile', id: string, name?: string | null, email?: string | null, dateOfBirth?: any | null, phone?: string | null, height?: number | null, weight?: number | null, dominantHand?: string | null, hasOnBoarded?: boolean | null }, member: { __typename?: 'Member', id: string, userId: string, teamId: string, role: Role, status: Status, number?: string | null, position?: string | null } } };

export type CreateTeamMutationVariables = Exact<{
  input: CreateTeamInput;
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'Team', id: string, name: string, image?: string | null, ageGroup?: string | null, code: string, creatorId?: string | null } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, hasOnBoarded: boolean, userId: string } };

export type RefreshMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshMutation = { __typename?: 'Mutation', refresh: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, hasOnBoarded: boolean, userId: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type SubmitAttendanceMutationVariables = Exact<{
  input: PlayerActivityAttendanceInput;
}>;


export type SubmitAttendanceMutation = { __typename?: 'Mutation', submitAttendance: { __typename?: 'PlayerActivityAttendance', id: string, memberId: string, attendanceStatus: AttendanceStatus, reason?: string | null } };

export type AcceptTeamRequestMutationVariables = Exact<{
  input: AcceptTeamRequestInput;
}>;


export type AcceptTeamRequestMutation = { __typename?: 'Mutation', acceptTeamRequest: { __typename?: 'ModerateJoinRequestResult', memberId: string, teamId: string, status: Status } };

export type JoinTeamMutationVariables = Exact<{
  input: JoinTeamInput;
}>;


export type JoinTeamMutation = { __typename?: 'Mutation', joinTeam: { __typename?: 'JoinTeamResponse', teamCode: string, position: string, number: string } };

export type RejectJoinRequestMutationVariables = Exact<{
  input: TeamRequestInput;
}>;


export type RejectJoinRequestMutation = { __typename?: 'Mutation', rejectJoinRequest: { __typename?: 'ModerateJoinRequestResult', memberId: string, teamId: string, status: Status } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', name?: string | null, dateOfBirth?: any | null, phone?: string | null, height?: number | null, weight?: number | null, dominantHand?: string | null } };

export type GetTeamForDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeamForDashboardQuery = { __typename?: 'Query', getDashboardTeams: Array<{ __typename?: 'TeamDashboard', id: string, name: string, slug: string, shortId: string, routeKey: string, ageGroup?: string | null, members: Array<{ __typename?: 'MemberId', id: string }>, activities: Array<{ __typename?: 'Activity', id: string, type: ActivityType, title: string, date: any, time: string }> }> };

export type GetTeamActivitiesQueryVariables = Exact<{
  teamRef: Scalars['String']['input'];
}>;


export type GetTeamActivitiesQuery = { __typename?: 'Query', getTeamActivities: { __typename?: 'Team', id: string, name: string, code: string, slug: string, routeKey: string, shortId: string, image?: string | null, ageGroup?: string | null, createdAt?: any | null, updatedAt?: any | null, creatorId?: string | null, members: Array<{ __typename?: 'TeamMemberUser', id: string, name?: string | null, image?: string | null, teamId: string, userId: string }>, activities: Array<{ __typename?: 'Activity', id: string, teamId: string, type: ActivityType, title: string, time: string, duration?: number | null, date: any, createdAt: any, updatedAt: any, attendees: Array<{ __typename?: 'PlayerActivityAttendance', id: string, activityId: string, memberId: string, attendanceStatus: AttendanceStatus, reason?: string | null, createdAt: any, updatedAt: any }> }> } };

export type CreateFeedbackMutationVariables = Exact<{
  input: CreateFeedbackInput;
}>;


export type CreateFeedbackMutation = { __typename?: 'Mutation', createFeedback: { __typename?: 'Activity', id: string, title: string, time: string, date: any, type: ActivityType, feedback?: { __typename?: 'Feedback', notes: string, coach: string } | null } };

export type CreateFilmMutationVariables = Exact<{
  input: CreateFilmInput;
}>;


export type CreateFilmMutation = { __typename?: 'Mutation', createFilm: { __typename?: 'Activity', id: string, title: string, time: string, date: any, type: ActivityType, film?: { __typename?: 'Film', notes: string } | null } };

export type CreateGameMutationVariables = Exact<{
  input: CreateGameInput;
}>;


export type CreateGameMutation = { __typename?: 'Mutation', createGame: { __typename?: 'Activity', id: string, title: string, time: string, date: any, duration?: number | null, type: ActivityType, game?: { __typename?: 'Game', location: Location } | null } };

export type CreateMeetingMutationVariables = Exact<{
  input: CreateMeetingInput;
}>;


export type CreateMeetingMutation = { __typename?: 'Mutation', createMeeting: { __typename?: 'Activity', id: string, title: string, time: string, date: any, duration?: number | null, type: ActivityType, meeting?: { __typename?: 'Meeting', notes: string } | null } };

export type CreatePracticeMutationVariables = Exact<{
  input: CreatePracticeInput;
}>;


export type CreatePracticeMutation = { __typename?: 'Mutation', createPractice: { __typename?: 'Activity', title: string, time: string, date: any, duration?: number | null, type: ActivityType, practice?: { __typename?: 'Practice', facility: string, practicetype: string } | null } };

export type DeleteActivityMutationVariables = Exact<{
  input: DeleteActivity;
}>;


export type DeleteActivityMutation = { __typename?: 'Mutation', deleteActivity: { __typename?: 'Activity', id: string } };

export type UpdateFeedbackMutationVariables = Exact<{
  input: UpdateFeedbackInput;
}>;


export type UpdateFeedbackMutation = { __typename?: 'Mutation', updateFeedback: { __typename?: 'Activity', id: string, title: string, time: string, date: any, type: ActivityType, teamId: string, feedback?: { __typename?: 'Feedback', notes: string, coach: string } | null } };

export type UpdateFilmMutationVariables = Exact<{
  input: UpdateFilmInput;
}>;


export type UpdateFilmMutation = { __typename?: 'Mutation', updateFilm: { __typename?: 'Activity', id: string, title: string, time: string, date: any, type: ActivityType, teamId: string, film?: { __typename?: 'Film', notes: string } | null } };

export type UpdateGameMutationVariables = Exact<{
  input: UpdateGameInput;
}>;


export type UpdateGameMutation = { __typename?: 'Mutation', updateGame: { __typename?: 'Activity', id: string, title: string, time: string, date: any, duration?: number | null, type: ActivityType, teamId: string, game?: { __typename?: 'Game', location: Location } | null } };

export type UpdateMeetingMutationVariables = Exact<{
  input: UpdateMeetingInput;
}>;


export type UpdateMeetingMutation = { __typename?: 'Mutation', updateMeeting: { __typename?: 'Activity', id: string, title: string, time: string, date: any, duration?: number | null, type: ActivityType, teamId: string, meeting?: { __typename?: 'Meeting', notes: string } | null } };

export type UpdatePracticeMutationVariables = Exact<{
  input: UpdatePracticeInput;
}>;


export type UpdatePracticeMutation = { __typename?: 'Mutation', updatePractice: { __typename?: 'Activity', id: string, title: string, time: string, date: any, duration?: number | null, type: ActivityType, teamId: string, practice?: { __typename?: 'Practice', facility: string, practicetype: string } | null } };

export type DeleteMemberMutationVariables = Exact<{
  input: DeleteMemberInput;
}>;


export type DeleteMemberMutation = { __typename?: 'Mutation', deleteMember: boolean };

export type GetMembersQueryVariables = Exact<{
  input: MembersInput;
}>;


export type GetMembersQuery = { __typename?: 'Query', getMembers: Array<{ __typename?: 'MemberWithAttendances', id: string, userId: string, teamId: string, role: Role, status: Status, number?: string | null, position?: string | null, name?: string | null, attendances: Array<{ __typename?: 'PlayerActivityAttendance', id: string, activityId: string, memberId: string, attendanceStatus: AttendanceStatus, reason?: string | null, createdAt: any, updatedAt: any, activity?: { __typename?: 'AttendanceActivity', id: string, title: string, time: string, date: any } | null }>, user?: { __typename?: 'UserDetail', id: string, name?: string | null, email?: string | null, image?: string | null, dateOfBirth?: any | null, phone?: string | null, height?: number | null, weight?: number | null, dominantHand?: string | null, hasOnBoarded: boolean } | null }> };

export type GetTeamQueryVariables = Exact<{
  input: GetTeamInput;
}>;


export type GetTeamQuery = { __typename?: 'Query', getTeam: { __typename?: 'TeamInformation', id: string, name: string, code: string, slug: string, shortId: string, routeKey: string, image?: string | null, ageGroup?: string | null, creatorId: string, createdAt: any, updatedAt: any, members: Array<{ __typename?: 'TeamMemberInfo', id: string, teamId: string, name?: string | null, number?: string | null, position?: string | null, image?: string | null, user: { __typename?: 'UserDetail', id: string, name?: string | null, email?: string | null, image?: string | null, dateOfBirth?: any | null, phone?: string | null, height?: number | null, weight?: number | null, dominantHand?: string | null, hasOnBoarded: boolean } }> } };

export type GetPendingMembersQueryVariables = Exact<{
  input: MembersInput;
}>;


export type GetPendingMembersQuery = { __typename?: 'Query', getPendingMembers: Array<{ __typename?: 'PendingMember', id: string, name?: string | null, email?: string | null }> };


export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamShortId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamShortId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamShortId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"dominantHand"}},{"kind":"Field","name":{"kind":"Name","value":"hasOnBoarded"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const CreateTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]}}]} as unknown as DocumentNode<CreateTeamMutation, CreateTeamMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"hasOnBoarded"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"hasOnBoarded"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const SubmitAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlayerActivityAttendanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<SubmitAttendanceMutation, SubmitAttendanceMutationVariables>;
export const AcceptTeamRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptTeamRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptTeamRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptTeamRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<AcceptTeamRequestMutation, AcceptTeamRequestMutationVariables>;
export const JoinTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JoinTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamCode"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]} as unknown as DocumentNode<JoinTeamMutation, JoinTeamMutationVariables>;
export const RejectJoinRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectJoinRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectJoinRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<RejectJoinRequestMutation, RejectJoinRequestMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"dominantHand"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetTeamForDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeamForDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDashboardTeams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"shortId"}},{"kind":"Field","name":{"kind":"Name","value":"routeKey"}},{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]}}]} as unknown as DocumentNode<GetTeamForDashboardQuery, GetTeamForDashboardQueryVariables>;
export const GetTeamActivitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeamActivities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamRef"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTeamActivities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamRef"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamRef"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"routeKey"}},{"kind":"Field","name":{"kind":"Name","value":"shortId"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetTeamActivitiesQuery, GetTeamActivitiesQueryVariables>;
export const CreateFeedbackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFeedback"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFeedbackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFeedback"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"coach"}}]}}]}}]}}]} as unknown as DocumentNode<CreateFeedbackMutation, CreateFeedbackMutationVariables>;
export const CreateFilmDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFilm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFilmInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFilm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"film"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<CreateFilmMutation, CreateFilmMutationVariables>;
export const CreateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const CreateMeetingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMeeting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMeetingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMeeting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"meeting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<CreateMeetingMutation, CreateMeetingMutationVariables>;
export const CreatePracticeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePractice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePracticeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPractice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"practice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facility"}},{"kind":"Field","name":{"kind":"Name","value":"practicetype"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePracticeMutation, CreatePracticeMutationVariables>;
export const DeleteActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteActivity"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteActivityMutation, DeleteActivityMutationVariables>;
export const UpdateFeedbackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFeedback"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFeedbackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFeedback"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"coach"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFeedbackMutation, UpdateFeedbackMutationVariables>;
export const UpdateFilmDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFilm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFilmInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFilm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"film"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFilmMutation, UpdateFilmMutationVariables>;
export const UpdateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateGameMutation, UpdateGameMutationVariables>;
export const UpdateMeetingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMeeting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMeetingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMeeting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"meeting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateMeetingMutation, UpdateMeetingMutationVariables>;
export const UpdatePracticeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePractice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePracticeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePractice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"practice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facility"}},{"kind":"Field","name":{"kind":"Name","value":"practicetype"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePracticeMutation, UpdatePracticeMutationVariables>;
export const DeleteMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteMemberMutation, DeleteMemberMutationVariables>;
export const GetMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MembersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attendances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"dominantHand"}},{"kind":"Field","name":{"kind":"Name","value":"hasOnBoarded"}}]}}]}}]}}]} as unknown as DocumentNode<GetMembersQuery, GetMembersQueryVariables>;
export const GetTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"shortId"}},{"kind":"Field","name":{"kind":"Name","value":"routeKey"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"dominantHand"}},{"kind":"Field","name":{"kind":"Name","value":"hasOnBoarded"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetTeamQuery, GetTeamQueryVariables>;
export const GetPendingMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPendingMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MembersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPendingMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetPendingMembersQuery, GetPendingMembersQueryVariables>;