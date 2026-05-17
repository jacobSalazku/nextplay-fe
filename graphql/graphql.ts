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
  routeKey: Scalars['String']['input'];
};

export type ActiveAttendedMembersInput = {
  activityId: Scalars['String']['input'];
  routeKey: Scalars['String']['input'];
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

export enum Category {
  Defensive = 'DEFENSIVE',
  Offensive = 'OFFENSIVE',
  Special = 'SPECIAL'
}

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

export type CreateGamePlanInput = {
  activityId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  opponent?: InputMaybe<Scalars['String']['input']>;
  playsId: Array<Scalars['String']['input']>;
  routeKey: Scalars['String']['input'];
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

export type CreatePlayInput = {
  canvas: Scalars['String']['input'];
  category: Category;
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  routeKey: Scalars['String']['input'];
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

export type CreatePracticePreparationInput = {
  activityId: Scalars['String']['input'];
  focus?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  playsId: Array<Scalars['String']['input']>;
  routeKey: Scalars['String']['input'];
};

export type CreateTeamInput = {
  ageGroup: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type DeleteActivity = {
  id: Scalars['ID']['input'];
};

export type DeleteGamePlanInput = {
  gamePlanId: Scalars['String']['input'];
  routeKey: Scalars['String']['input'];
};

export type DeleteMemberInput = {
  id: Scalars['String']['input'];
};

export type DeletePlayInput = {
  id: Scalars['String']['input'];
  routeKey: Scalars['String']['input'];
};

export type DeletePracticePreparationInput = {
  practicePreparationId: Scalars['String']['input'];
  routeKey: Scalars['String']['input'];
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
  date: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  location: Location;
  opponentStatline?: Maybe<OpponentStatline>;
  time: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type GamePlan = {
  __typename?: 'GamePlan';
  activity?: Maybe<GamePlanActivity>;
  activityId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  opponent?: Maybe<Scalars['String']['output']>;
  plays: Array<GamePlanPlay>;
  teamId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GamePlanActivity = {
  __typename?: 'GamePlanActivity';
  date: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type GamePlanPlay = {
  __typename?: 'GamePlanPlay';
  category: Category;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GameWithBoxScore = {
  __typename?: 'GameWithBoxScore';
  activityId: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  opponentName: Scalars['String']['output'];
  opponentStats: OpponentTotalsBoxScore;
  playerStats: Array<PlayerBoxScore>;
  teamTotals: TeamTotalsBoxScore;
  title: Scalars['String']['output'];
};

export type GetActivitiesInput = {
  routeKey: Scalars['String']['input'];
};

export type GetActivityInput = {
  activityId: Scalars['String']['input'];
  routeKey: Scalars['String']['input'];
};

export type GetAttendanceByActivitiesInput = {
  activityId: Scalars['String']['input'];
  memberId: Scalars['String']['input'];
};

export type GetGamePlanByIdInput = {
  id: Scalars['String']['input'];
  routeKey: Scalars['String']['input'];
};

export type GetGamePlansInput = {
  routeKey: Scalars['String']['input'];
};

export type GetMemberProfileInput = {
  id: Scalars['String']['input'];
  teamShortId: Scalars['String']['input'];
};

export type GetPlayInput = {
  id: Scalars['String']['input'];
};

export type GetPlaysInput = {
  routeKey: Scalars['String']['input'];
};

export type GetPracticePreparationByIdInput = {
  id: Scalars['String']['input'];
  routeKey: Scalars['String']['input'];
};

export type GetPracticePreparationsInput = {
  routeKey: Scalars['String']['input'];
};

export type GetTeamInput = {
  routeKey: Scalars['String']['input'];
};

export type GetUserResponse = {
  __typename?: 'GetUserResponse';
  member: MemberWithAttendances;
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

export type MemberStatline = {
  __typename?: 'MemberStatline';
  activityId: Scalars['String']['output'];
  assists: Scalars['Float']['output'];
  blocks: Scalars['Float']['output'];
  defensiveRebounds: Scalars['Float']['output'];
  fieldGoalsMade: Scalars['Float']['output'];
  fieldGoalsMissed: Scalars['Float']['output'];
  freeThrows: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  missedFreeThrows: Scalars['Float']['output'];
  offensiveRebounds: Scalars['Float']['output'];
  steals: Scalars['Float']['output'];
  threePointersMade: Scalars['Float']['output'];
  threePointersMissed: Scalars['Float']['output'];
  turnovers: Scalars['Float']['output'];
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

export type MemberWithStatlines = {
  __typename?: 'MemberWithStatlines';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  role: Role;
  statlines: Array<MemberStatline>;
  status: Status;
  teamId: Scalars['String']['output'];
  user?: Maybe<UserDetail>;
  userId: Scalars['String']['output'];
};

export type MembersInput = {
  routeKey: Scalars['String']['input'];
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
  createGamePlan: GamePlan;
  createMeeting: Activity;
  createPlay: Play;
  createPractice: Activity;
  createPracticePreparation: PracticePreparation;
  createTeam: Team;
  deleteActivity: Activity;
  deleteGamePlan: GamePlan;
  deleteMember: Scalars['Boolean']['output'];
  deletePlay: Scalars['Boolean']['output'];
  deletePracticePreparation: PracticePreparation;
  getAttendanceByActivities: PlayerActivityAttendance;
  joinTeam: JoinTeamResponse;
  login: AuthPayload;
  logout: Scalars['Boolean']['output'];
  refresh: AuthPayload;
  rejectJoinRequest: ModerateJoinRequestResult;
  submitAttendance: PlayerActivityAttendance;
  submitStatlines: SubmitStatlinesResult;
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


export type MutationCreateGamePlanArgs = {
  input: CreateGamePlanInput;
};


export type MutationCreateMeetingArgs = {
  input: CreateMeetingInput;
};


export type MutationCreatePlayArgs = {
  input: CreatePlayInput;
};


export type MutationCreatePracticeArgs = {
  input: CreatePracticeInput;
};


export type MutationCreatePracticePreparationArgs = {
  input: CreatePracticePreparationInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationDeleteActivityArgs = {
  input: DeleteActivity;
};


export type MutationDeleteGamePlanArgs = {
  input: DeleteGamePlanInput;
};


export type MutationDeleteMemberArgs = {
  input: DeleteMemberInput;
};


export type MutationDeletePlayArgs = {
  input: DeletePlayInput;
};


export type MutationDeletePracticePreparationArgs = {
  input: DeletePracticePreparationInput;
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


export type MutationSubmitStatlinesArgs = {
  input: SubmitStatlinesInput;
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

export type OpponentStatline = {
  __typename?: 'OpponentStatline';
  activityId: Scalars['String']['output'];
  fieldGoalsMade: Scalars['Float']['output'];
  freeThrowsMade: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  threePointersMade: Scalars['Float']['output'];
};

export type OpponentStatlineInput = {
  activityId: Scalars['String']['input'];
  fieldGoalsMade: Scalars['Int']['input'];
  freeThrowsMade: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  threePointersMade: Scalars['Int']['input'];
};

export type OpponentTotalsBoxScore = {
  __typename?: 'OpponentTotalsBoxScore';
  fieldGoalsMade: Scalars['Float']['output'];
  freeThrowsMade: Scalars['Float']['output'];
  points: Scalars['Float']['output'];
  threePointersMade: Scalars['Float']['output'];
};

export type PendingMember = {
  __typename?: 'PendingMember';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type Play = {
  __typename?: 'Play';
  canvas: Scalars['String']['output'];
  category: Category;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  routeKey: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
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

export type PlayerBoxScore = {
  __typename?: 'PlayerBoxScore';
  assists: Scalars['Float']['output'];
  blocks: Scalars['Float']['output'];
  defensiveRebounds: Scalars['Float']['output'];
  fieldGoalsMade: Scalars['Float']['output'];
  freeThrows: Scalars['Float']['output'];
  memberId: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  offensiveRebounds: Scalars['Float']['output'];
  points: Scalars['Float']['output'];
  steals: Scalars['Float']['output'];
  threePointersMade: Scalars['Float']['output'];
  turnovers: Scalars['Float']['output'];
};

export type PlayerStatlineAverage = {
  __typename?: 'PlayerStatlineAverage';
  averages: PlayerStatlineAverageValues;
  gamesPlayed: Scalars['Int']['output'];
  memberId: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  totalPoints: Scalars['Float']['output'];
};

export type PlayerStatlineAverageValues = {
  __typename?: 'PlayerStatlineAverageValues';
  assists: Scalars['Float']['output'];
  blocks: Scalars['Float']['output'];
  defensiveRebound: Scalars['Float']['output'];
  fieldGoalPercentage: Scalars['Float']['output'];
  freeThrowPercentage: Scalars['Float']['output'];
  offensiveRebound: Scalars['Float']['output'];
  pointsPerGame: Scalars['Float']['output'];
  steals: Scalars['Float']['output'];
  threePointPercentage: Scalars['Float']['output'];
  turnovers: Scalars['Float']['output'];
};

export type PlayerStatlineEntryInput = {
  activityId: Scalars['String']['input'];
  memberId: Scalars['String']['input'];
  statlines: Array<StatlineValueInput>;
};

export type Practice = {
  __typename?: 'Practice';
  activityId: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  facility: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  practicetype: Scalars['String']['output'];
  time: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type PracticePreparation = {
  __typename?: 'PracticePreparation';
  activity?: Maybe<PracticePreparationActivity>;
  activityId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  focus?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  plays: Array<PracticePreparationPlay>;
  teamId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PracticePreparationActivity = {
  __typename?: 'PracticePreparationActivity';
  date: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type PracticePreparationPlay = {
  __typename?: 'PracticePreparationPlay';
  category: Category;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
  getActiveAttendedMembers: Array<MemberWithStatlines>;
  getActivities: Array<Activity>;
  getActivity: Activity;
  getCurrentUser: GetUserResponse;
  getDashboardTeams: Array<TeamDashboard>;
  getGameplan: Array<GamePlan>;
  getGameplanById?: Maybe<GamePlan>;
  getGames: Array<Activity>;
  getGamesWithBoxScores: Array<GameWithBoxScore>;
  getMemberProfile: MemberWithAttendances;
  getMembers: Array<MemberWithAttendances>;
  getPendingMembers: Array<PendingMember>;
  getPlay?: Maybe<Play>;
  getPlays: Array<Play>;
  getPracticePreparationById?: Maybe<PracticePreparation>;
  getPracticePreparations: Array<PracticePreparation>;
  getPractices: Array<Activity>;
  getStatlineAverages: Array<PlayerStatlineAverage>;
  getStatsPerGame: Array<StatsPerGame>;
  getTeam: TeamInformation;
  getTeamActivities: Team;
  getTeamStats: TeamStats;
  getWeeklyTeamAverages: Array<WeeklyTeamAverage>;
  me: User;
};


export type QueryGetActiveAttendedMembersArgs = {
  input: ActiveAttendedMembersInput;
};


export type QueryGetActivitiesArgs = {
  teamShortId: Scalars['String']['input'];
};


export type QueryGetActivityArgs = {
  input: GetActivityInput;
};


export type QueryGetCurrentUserArgs = {
  teamShortId: Scalars['String']['input'];
};


export type QueryGetGameplanArgs = {
  input: GetGamePlansInput;
};


export type QueryGetGameplanByIdArgs = {
  input: GetGamePlanByIdInput;
};


export type QueryGetGamesArgs = {
  input: GetActivitiesInput;
};


export type QueryGetGamesWithBoxScoresArgs = {
  input: TeamStatlineInput;
};


export type QueryGetMemberProfileArgs = {
  input: GetMemberProfileInput;
};


export type QueryGetMembersArgs = {
  input: MembersInput;
};


export type QueryGetPendingMembersArgs = {
  input: MembersInput;
};


export type QueryGetPlayArgs = {
  input: GetPlayInput;
};


export type QueryGetPlaysArgs = {
  input: GetPlaysInput;
};


export type QueryGetPracticePreparationByIdArgs = {
  input: GetPracticePreparationByIdInput;
};


export type QueryGetPracticePreparationsArgs = {
  input: GetPracticePreparationsInput;
};


export type QueryGetPracticesArgs = {
  input: GetActivitiesInput;
};


export type QueryGetStatlineAveragesArgs = {
  input: TeamStatlineInput;
};


export type QueryGetStatsPerGameArgs = {
  input: StatsPerGameInput;
};


export type QueryGetTeamArgs = {
  input: GetTeamInput;
};


export type QueryGetTeamActivitiesArgs = {
  routeKey: Scalars['String']['input'];
};


export type QueryGetTeamStatsArgs = {
  input: TeamStatlineInput;
};


export type QueryGetWeeklyTeamAveragesArgs = {
  input: TeamStatlineInput;
};

export enum Role {
  Coach = 'COACH',
  Player = 'PLAYER'
}

export type SavedOpponentStatline = {
  __typename?: 'SavedOpponentStatline';
  fieldGoalsMade: Scalars['Float']['output'];
  freeThrowsMade: Scalars['Float']['output'];
  gameId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  threePointersMade: Scalars['Float']['output'];
};

export type StatlineValueInput = {
  assists?: InputMaybe<Scalars['Int']['input']>;
  blocks?: InputMaybe<Scalars['Int']['input']>;
  defensiveRebounds?: InputMaybe<Scalars['Int']['input']>;
  fieldGoalsMade?: InputMaybe<Scalars['Int']['input']>;
  fieldGoalsMissed?: InputMaybe<Scalars['Int']['input']>;
  freeThrows?: InputMaybe<Scalars['Int']['input']>;
  freeThrowsMissed?: InputMaybe<Scalars['Int']['input']>;
  offensiveRebounds?: InputMaybe<Scalars['Int']['input']>;
  steals?: InputMaybe<Scalars['Int']['input']>;
  threePointersMade?: InputMaybe<Scalars['Int']['input']>;
  threePointersMissed?: InputMaybe<Scalars['Int']['input']>;
  turnovers?: InputMaybe<Scalars['Int']['input']>;
};

export type StatsPerGame = {
  __typename?: 'StatsPerGame';
  assists: Scalars['Float']['output'];
  date?: Maybe<Scalars['DateTime']['output']>;
  gameTitle: Scalars['String']['output'];
  points: Scalars['Float']['output'];
  rebounds: Scalars['Float']['output'];
  steals: Scalars['Float']['output'];
};

export type StatsPerGameInput = {
  memberId: Scalars['String']['input'];
  month: Scalars['Int']['input'];
  routeKey: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};

export enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

export type SubmitStatlinesInput = {
  opponentStatline?: InputMaybe<OpponentStatlineInput>;
  players: Array<PlayerStatlineEntryInput>;
  routeKey: Scalars['String']['input'];
};

export type SubmitStatlinesResult = {
  __typename?: 'SubmitStatlinesResult';
  count: Scalars['Int']['output'];
  opponentStatline?: Maybe<SavedOpponentStatline>;
  success: Scalars['Boolean']['output'];
};

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

export type TeamAdvancedValues = {
  __typename?: 'TeamAdvancedValues';
  assistToTurnoverRatio: Scalars['Float']['output'];
  effectiveFieldGoalPercentage: Scalars['Float']['output'];
  netRating: Scalars['Float']['output'];
  offensiveRating: Scalars['Float']['output'];
  trueShootingPercentage: Scalars['Float']['output'];
};

export type TeamAverageValues = {
  __typename?: 'TeamAverageValues';
  assists: Scalars['Float']['output'];
  blocks: Scalars['Float']['output'];
  fieldGoalPercentage: Scalars['Float']['output'];
  freeThrowPercentage: Scalars['Float']['output'];
  pointsPerGame: Scalars['Float']['output'];
  rebounds: Scalars['Float']['output'];
  steals: Scalars['Float']['output'];
  threePointPercentage: Scalars['Float']['output'];
  turnovers: Scalars['Float']['output'];
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

export type TeamStatlineInput = {
  routeKey: Scalars['String']['input'];
};

export type TeamStats = {
  __typename?: 'TeamStats';
  advanced: TeamAdvancedValues;
  averages: TeamAverageValues;
  totalAssists: Scalars['Float']['output'];
  totalBlocks: Scalars['Float']['output'];
  totalFieldGoalsMade: Scalars['Float']['output'];
  totalFieldGoalsMissed: Scalars['Float']['output'];
  totalFreeThrows: Scalars['Float']['output'];
  totalFreeThrowsMissed: Scalars['Float']['output'];
  totalGames: Scalars['Int']['output'];
  totalOpponentPoints: Scalars['Float']['output'];
  totalPoints: Scalars['Float']['output'];
  totalRebounds: Scalars['Float']['output'];
  totalSteals: Scalars['Float']['output'];
  totalThreePointersMade: Scalars['Float']['output'];
  totalThreePointersMissed: Scalars['Float']['output'];
  totalTurnovers: Scalars['Float']['output'];
};

export type TeamTotalsBoxScore = {
  __typename?: 'TeamTotalsBoxScore';
  assists: Scalars['Float']['output'];
  blocks: Scalars['Float']['output'];
  defensiveRebounds: Scalars['Float']['output'];
  fieldGoalsMade: Scalars['Float']['output'];
  freeThrows: Scalars['Float']['output'];
  offensiveRebounds: Scalars['Float']['output'];
  points: Scalars['Float']['output'];
  steals: Scalars['Float']['output'];
  threePointersMade: Scalars['Float']['output'];
  turnovers: Scalars['Float']['output'];
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

export type WeeklyTeamAverage = {
  __typename?: 'WeeklyTeamAverage';
  assists: Scalars['Float']['output'];
  averages: WeeklyTeamAverageValues;
  blocks: Scalars['Float']['output'];
  fieldGoalsMade: Scalars['Float']['output'];
  fieldGoalsMissed: Scalars['Float']['output'];
  freeThrows: Scalars['Float']['output'];
  freeThrowsMissed: Scalars['Float']['output'];
  gamesPlayed: Scalars['Int']['output'];
  rebounds: Scalars['Float']['output'];
  steals: Scalars['Float']['output'];
  threePointersMade: Scalars['Float']['output'];
  threePointersMissed: Scalars['Float']['output'];
  totalPoints: Scalars['Float']['output'];
  turnovers: Scalars['Float']['output'];
  weekStart: Scalars['String']['output'];
};

export type WeeklyTeamAverageValues = {
  __typename?: 'WeeklyTeamAverageValues';
  assistsPerGame: Scalars['Float']['output'];
  blocksPerGame: Scalars['Float']['output'];
  pointsPerGame: Scalars['Float']['output'];
  reboundsPerGame: Scalars['Float']['output'];
  stealsPerGame: Scalars['Float']['output'];
  turnoversPerGame: Scalars['Float']['output'];
};

export type GetUserQueryVariables = Exact<{
  teamShortId: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'GetUserResponse', user: { __typename?: 'UserProfile', id: string, name?: string | null, email?: string | null, dateOfBirth?: any | null, phone?: string | null, height?: number | null, weight?: number | null, dominantHand?: string | null, hasOnBoarded?: boolean | null }, member: { __typename?: 'MemberWithAttendances', id: string, userId: string, teamId: string, role: Role, status: Status, number?: string | null, position?: string | null, attendances: Array<{ __typename?: 'PlayerActivityAttendance', id: string, activityId: string, memberId: string, attendanceStatus: AttendanceStatus, reason?: string | null, createdAt: any, updatedAt: any, activity?: { __typename?: 'AttendanceActivity', id: string, title: string, time: string, date: any } | null }> } } };

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

export type CreateGamePlanMutationVariables = Exact<{
  input: CreateGamePlanInput;
}>;


export type CreateGamePlanMutation = { __typename?: 'Mutation', createGamePlan: { __typename?: 'GamePlan', id: string, name: string, opponent?: string | null, notes?: string | null, activityId: string, teamId: string, createdAt: any, updatedAt: any, activity?: { __typename?: 'GamePlanActivity', id: string, title: string, date: any, time: string } | null, plays: Array<{ __typename?: 'GamePlanPlay', id: string, name: string, category: Category }> } };

export type CreatePlayMutationVariables = Exact<{
  input: CreatePlayInput;
}>;


export type CreatePlayMutation = { __typename?: 'Mutation', createPlay: { __typename?: 'Play', id: string, routeKey: string, name: string, description: string, category: Category, canvas: string, createdAt: any, updatedAt: any } };

export type CreatePracticePreparationMutationVariables = Exact<{
  input: CreatePracticePreparationInput;
}>;


export type CreatePracticePreparationMutation = { __typename?: 'Mutation', createPracticePreparation: { __typename?: 'PracticePreparation', id: string, name: string, focus?: string | null, notes?: string | null, activityId?: string | null, teamId: string, createdAt: any, updatedAt: any, activity?: { __typename?: 'PracticePreparationActivity', id: string, title: string, date: any, time: string } | null, plays: Array<{ __typename?: 'PracticePreparationPlay', id: string, name: string, category: Category }> } };

export type DeleteGamePlanMutationVariables = Exact<{
  input: DeleteGamePlanInput;
}>;


export type DeleteGamePlanMutation = { __typename?: 'Mutation', deleteGamePlan: { __typename?: 'GamePlan', id: string, name: string, opponent?: string | null, notes?: string | null, activityId: string, teamId: string, createdAt: any, updatedAt: any, activity?: { __typename?: 'GamePlanActivity', id: string, title: string, date: any, time: string } | null, plays: Array<{ __typename?: 'GamePlanPlay', id: string, name: string, category: Category }> } };

export type DeletePlayMutationVariables = Exact<{
  input: DeletePlayInput;
}>;


export type DeletePlayMutation = { __typename?: 'Mutation', deletePlay: boolean };

export type DeletePracticePreparationMutationVariables = Exact<{
  input: DeletePracticePreparationInput;
}>;


export type DeletePracticePreparationMutation = { __typename?: 'Mutation', deletePracticePreparation: { __typename?: 'PracticePreparation', id: string, name: string, focus?: string | null, notes?: string | null, activityId?: string | null, teamId: string, createdAt: any, updatedAt: any, activity?: { __typename?: 'PracticePreparationActivity', id: string, title: string, date: any, time: string } | null, plays: Array<{ __typename?: 'PracticePreparationPlay', id: string, name: string, category: Category }> } };

export type GetGameplanQueryVariables = Exact<{
  input: GetGamePlansInput;
}>;


export type GetGameplanQuery = { __typename?: 'Query', getGameplan: Array<{ __typename?: 'GamePlan', id: string, name: string, opponent?: string | null, notes?: string | null, activityId: string, teamId: string, createdAt: any, updatedAt: any, activity?: { __typename?: 'GamePlanActivity', id: string, title: string, date: any, time: string } | null, plays: Array<{ __typename?: 'GamePlanPlay', id: string, name: string, category: Category }> }> };

export type GetGameplanByIdQueryVariables = Exact<{
  input: GetGamePlanByIdInput;
}>;


export type GetGameplanByIdQuery = { __typename?: 'Query', getGameplanById?: { __typename?: 'GamePlan', id: string, name: string, opponent?: string | null, notes?: string | null, activityId: string, teamId: string, createdAt: any, updatedAt: any, activity?: { __typename?: 'GamePlanActivity', id: string, title: string, date: any, time: string } | null, plays: Array<{ __typename?: 'GamePlanPlay', id: string, name: string, category: Category }> } | null };

export type GetGamesQueryVariables = Exact<{
  input: GetActivitiesInput;
}>;


export type GetGamesQuery = { __typename?: 'Query', getGames: Array<{ __typename?: 'Activity', id: string, date: any, time: string, game?: { __typename?: 'Game', id: string, title: string, date: any, time: string, activityId: string, location: Location, opponentStatline?: { __typename?: 'OpponentStatline', activityId: string, name: string, fieldGoalsMade: number, threePointersMade: number, freeThrowsMade: number } | null } | null }> };

export type GetPlayQueryVariables = Exact<{
  input: GetPlayInput;
}>;


export type GetPlayQuery = { __typename?: 'Query', getPlay?: { __typename?: 'Play', id: string, routeKey: string, name: string, category: Category, description: string, canvas: string, createdAt: any, updatedAt: any } | null };

export type GetPlaysQueryVariables = Exact<{
  input: GetPlaysInput;
}>;


export type GetPlaysQuery = { __typename?: 'Query', getPlays: Array<{ __typename?: 'Play', id: string, routeKey: string, name: string, category: Category, description: string, canvas: string, createdAt: any, updatedAt: any }> };

export type GetPracticePreparationByIdQueryVariables = Exact<{
  input: GetPracticePreparationByIdInput;
}>;


export type GetPracticePreparationByIdQuery = { __typename?: 'Query', getPracticePreparationById?: { __typename?: 'PracticePreparation', id: string, name: string, focus?: string | null, notes?: string | null, activityId?: string | null, teamId: string, createdAt: any, updatedAt: any, activity?: { __typename?: 'PracticePreparationActivity', id: string, title: string, date: any, time: string } | null, plays: Array<{ __typename?: 'PracticePreparationPlay', id: string, name: string, category: Category }> } | null };

export type GetPracticePreparationsQueryVariables = Exact<{
  input: GetPracticePreparationsInput;
}>;


export type GetPracticePreparationsQuery = { __typename?: 'Query', getPracticePreparations: Array<{ __typename?: 'PracticePreparation', id: string, name: string, focus?: string | null, notes?: string | null, activityId?: string | null, teamId: string, createdAt: any, updatedAt: any, activity?: { __typename?: 'PracticePreparationActivity', id: string, title: string, date: any, time: string } | null, plays: Array<{ __typename?: 'PracticePreparationPlay', id: string, name: string, category: Category }> }> };

export type GetPracticesQueryVariables = Exact<{
  input: GetActivitiesInput;
}>;


export type GetPracticesQuery = { __typename?: 'Query', getPractices: Array<{ __typename?: 'Activity', practice?: { __typename?: 'Practice', id: string, title: string, date: any, time: string, activityId: string, facility: string, practicetype: string } | null }> };

export type GetTeamActivitiesQueryVariables = Exact<{
  routeKey: Scalars['String']['input'];
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

export type GetActiveAttendedMembersQueryVariables = Exact<{
  input: ActiveAttendedMembersInput;
}>;


export type GetActiveAttendedMembersQuery = { __typename?: 'Query', getActiveAttendedMembers: Array<{ __typename?: 'MemberWithStatlines', id: string, userId: string, teamId: string, role: Role, status: Status, number?: string | null, position?: string | null, name?: string | null, user?: { __typename?: 'UserDetail', id: string, name?: string | null, image?: string | null, email?: string | null, dateOfBirth?: any | null, phone?: string | null, height?: number | null, weight?: number | null, dominantHand?: string | null, hasOnBoarded: boolean } | null, statlines: Array<{ __typename?: 'MemberStatline', id: string, activityId: string, fieldGoalsMade: number, fieldGoalsMissed: number, threePointersMade: number, threePointersMissed: number, freeThrows: number, missedFreeThrows: number, assists: number, steals: number, turnovers: number, offensiveRebounds: number, defensiveRebounds: number, blocks: number }> }> };

export type GetActivityQueryVariables = Exact<{
  input: GetActivityInput;
}>;


export type GetActivityQuery = { __typename?: 'Query', getActivity: { __typename?: 'Activity', id: string, title: string, time: string, type: ActivityType, duration?: number | null, date: any, createdAt: any, updatedAt: any, teamId: string, attendees: Array<{ __typename?: 'PlayerActivityAttendance', id: string, activityId: string, memberId: string, attendanceStatus: AttendanceStatus, reason?: string | null, createdAt: any, updatedAt: any }>, game?: { __typename?: 'Game', activityId: string, location: Location, opponentStatline?: { __typename?: 'OpponentStatline', activityId: string, name: string, fieldGoalsMade: number, threePointersMade: number, freeThrowsMade: number } | null } | null } };

export type GetGamesWithBoxScoresQueryVariables = Exact<{
  input: TeamStatlineInput;
}>;


export type GetGamesWithBoxScoresQuery = { __typename?: 'Query', getGamesWithBoxScores: Array<{ __typename?: 'GameWithBoxScore', activityId: string, title: string, date: any, opponentName: string, opponentStats: { __typename?: 'OpponentTotalsBoxScore', fieldGoalsMade: number, threePointersMade: number, freeThrowsMade: number, points: number }, teamTotals: { __typename?: 'TeamTotalsBoxScore', fieldGoalsMade: number, threePointersMade: number, freeThrows: number, assists: number, offensiveRebounds: number, defensiveRebounds: number, steals: number, blocks: number, turnovers: number, points: number }, playerStats: Array<{ __typename?: 'PlayerBoxScore', memberId: string, name?: string | null, fieldGoalsMade: number, threePointersMade: number, freeThrows: number, assists: number, offensiveRebounds: number, defensiveRebounds: number, steals: number, blocks: number, turnovers: number, points: number }> }> };

export type GetStatlineAveragesQueryVariables = Exact<{
  input: TeamStatlineInput;
}>;


export type GetStatlineAveragesQuery = { __typename?: 'Query', getStatlineAverages: Array<{ __typename?: 'PlayerStatlineAverage', memberId: string, name?: string | null, totalPoints: number, gamesPlayed: number, averages: { __typename?: 'PlayerStatlineAverageValues', pointsPerGame: number, fieldGoalPercentage: number, threePointPercentage: number, freeThrowPercentage: number, assists: number, offensiveRebound: number, defensiveRebound: number, blocks: number, steals: number, turnovers: number } }> };

export type GetStatsPerGameQueryVariables = Exact<{
  input: StatsPerGameInput;
}>;


export type GetStatsPerGameQuery = { __typename?: 'Query', getStatsPerGame: Array<{ __typename?: 'StatsPerGame', gameTitle: string, date?: any | null, points: number, assists: number, rebounds: number, steals: number }> };

export type GetTeamStatsQueryVariables = Exact<{
  input: TeamStatlineInput;
}>;


export type GetTeamStatsQuery = { __typename?: 'Query', getTeamStats: { __typename?: 'TeamStats', totalGames: number, totalFieldGoalsMade: number, totalFieldGoalsMissed: number, totalThreePointersMade: number, totalThreePointersMissed: number, totalFreeThrows: number, totalFreeThrowsMissed: number, totalAssists: number, totalRebounds: number, totalSteals: number, totalBlocks: number, totalTurnovers: number, totalPoints: number, totalOpponentPoints: number, averages: { __typename?: 'TeamAverageValues', pointsPerGame: number, fieldGoalPercentage: number, threePointPercentage: number, freeThrowPercentage: number, assists: number, rebounds: number, steals: number, blocks: number, turnovers: number }, advanced: { __typename?: 'TeamAdvancedValues', offensiveRating: number, trueShootingPercentage: number, assistToTurnoverRatio: number, netRating: number, effectiveFieldGoalPercentage: number } } };

export type GetWeeklyTeamAveragesQueryVariables = Exact<{
  input: TeamStatlineInput;
}>;


export type GetWeeklyTeamAveragesQuery = { __typename?: 'Query', getWeeklyTeamAverages: Array<{ __typename?: 'WeeklyTeamAverage', weekStart: string, gamesPlayed: number, totalPoints: number, fieldGoalsMade: number, fieldGoalsMissed: number, threePointersMade: number, threePointersMissed: number, freeThrows: number, freeThrowsMissed: number, assists: number, rebounds: number, steals: number, blocks: number, turnovers: number, averages: { __typename?: 'WeeklyTeamAverageValues', pointsPerGame: number, assistsPerGame: number, reboundsPerGame: number, blocksPerGame: number, stealsPerGame: number, turnoversPerGame: number } }> };

export type SubmitStatlinesMutationVariables = Exact<{
  input: SubmitStatlinesInput;
}>;


export type SubmitStatlinesMutation = { __typename?: 'Mutation', submitStatlines: { __typename?: 'SubmitStatlinesResult', success: boolean, count: number, opponentStatline?: { __typename?: 'SavedOpponentStatline', gameId: string, name: string, fieldGoalsMade: number, threePointersMade: number, freeThrowsMade: number } | null } };

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

export type GetUserProfileQueryVariables = Exact<{
  input: GetMemberProfileInput;
}>;


export type GetUserProfileQuery = { __typename?: 'Query', getUserProfile: { __typename?: 'MemberWithAttendances', id: string, userId: string, teamId: string, role: Role, status: Status, number?: string | null, position?: string | null, name?: string | null, user?: { __typename?: 'UserDetail', id: string, name?: string | null, email?: string | null, image?: string | null, dateOfBirth?: any | null, phone?: string | null, height?: number | null, weight?: number | null, dominantHand?: string | null, hasOnBoarded: boolean } | null, attendances: Array<{ __typename?: 'PlayerActivityAttendance', id: string, activityId: string, memberId: string, attendanceStatus: AttendanceStatus, reason?: string | null, createdAt: any, updatedAt: any, activity?: { __typename?: 'AttendanceActivity', id: string, title: string, time: string, date: any } | null }> } };

export type GetPendingMembersQueryVariables = Exact<{
  input: MembersInput;
}>;


export type GetPendingMembersQuery = { __typename?: 'Query', getPendingMembers: Array<{ __typename?: 'PendingMember', id: string, name?: string | null, email?: string | null }> };


export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamShortId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamShortId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamShortId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"dominantHand"}},{"kind":"Field","name":{"kind":"Name","value":"hasOnBoarded"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"attendances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
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
export const CreateGamePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGamePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGamePlanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGamePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"opponent"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode<CreateGamePlanMutation, CreateGamePlanMutationVariables>;
export const CreatePlayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePlay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlayInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"routeKey"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"canvas"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreatePlayMutation, CreatePlayMutationVariables>;
export const CreatePracticePreparationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePracticePreparation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePracticePreparationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPracticePreparation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"focus"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePracticePreparationMutation, CreatePracticePreparationMutationVariables>;
export const DeleteGamePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGamePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteGamePlanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGamePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"opponent"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteGamePlanMutation, DeleteGamePlanMutationVariables>;
export const DeletePlayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePlay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePlayInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePlay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeletePlayMutation, DeletePlayMutationVariables>;
export const DeletePracticePreparationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePracticePreparation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePracticePreparationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePracticePreparation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"focus"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode<DeletePracticePreparationMutation, DeletePracticePreparationMutationVariables>;
export const GetGameplanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGameplan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetGamePlansInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGameplan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"opponent"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode<GetGameplanQuery, GetGameplanQueryVariables>;
export const GetGameplanByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGameplanById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetGamePlanByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGameplanById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"opponent"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode<GetGameplanByIdQuery, GetGameplanByIdQueryVariables>;
export const GetGamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetActivitiesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"opponentStatline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fieldGoalsMade"}},{"kind":"Field","name":{"kind":"Name","value":"threePointersMade"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrowsMade"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetGamesQuery, GetGamesQueryVariables>;
export const GetPlayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetPlayInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPlay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"routeKey"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"canvas"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetPlayQuery, GetPlayQueryVariables>;
export const GetPlaysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlays"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetPlaysInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPlays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"routeKey"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"canvas"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetPlaysQuery, GetPlaysQueryVariables>;
export const GetPracticePreparationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPracticePreparationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetPracticePreparationByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPracticePreparationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"focus"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode<GetPracticePreparationByIdQuery, GetPracticePreparationByIdQueryVariables>;
export const GetPracticePreparationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPracticePreparations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetPracticePreparationsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPracticePreparations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"focus"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode<GetPracticePreparationsQuery, GetPracticePreparationsQueryVariables>;
export const GetPracticesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPractices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetActivitiesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPractices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"facility"}},{"kind":"Field","name":{"kind":"Name","value":"practicetype"}}]}}]}}]}}]} as unknown as DocumentNode<GetPracticesQuery, GetPracticesQueryVariables>;
export const GetTeamActivitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeamActivities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"routeKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTeamActivities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"routeKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"routeKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"routeKey"}},{"kind":"Field","name":{"kind":"Name","value":"shortId"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetTeamActivitiesQuery, GetTeamActivitiesQueryVariables>;
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
export const GetActiveAttendedMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveAttendedMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ActiveAttendedMembersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActiveAttendedMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"dominantHand"}},{"kind":"Field","name":{"kind":"Name","value":"hasOnBoarded"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statlines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"fieldGoalsMade"}},{"kind":"Field","name":{"kind":"Name","value":"fieldGoalsMissed"}},{"kind":"Field","name":{"kind":"Name","value":"threePointersMade"}},{"kind":"Field","name":{"kind":"Name","value":"threePointersMissed"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrows"}},{"kind":"Field","name":{"kind":"Name","value":"missedFreeThrows"}},{"kind":"Field","name":{"kind":"Name","value":"assists"}},{"kind":"Field","name":{"kind":"Name","value":"steals"}},{"kind":"Field","name":{"kind":"Name","value":"turnovers"}},{"kind":"Field","name":{"kind":"Name","value":"offensiveRebounds"}},{"kind":"Field","name":{"kind":"Name","value":"defensiveRebounds"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveAttendedMembersQuery, GetActiveAttendedMembersQueryVariables>;
export const GetActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetActivityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"opponentStatline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fieldGoalsMade"}},{"kind":"Field","name":{"kind":"Name","value":"threePointersMade"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrowsMade"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetActivityQuery, GetActivityQueryVariables>;
export const GetGamesWithBoxScoresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGamesWithBoxScores"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamStatlineInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGamesWithBoxScores"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"opponentName"}},{"kind":"Field","name":{"kind":"Name","value":"opponentStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldGoalsMade"}},{"kind":"Field","name":{"kind":"Name","value":"threePointersMade"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrowsMade"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teamTotals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldGoalsMade"}},{"kind":"Field","name":{"kind":"Name","value":"threePointersMade"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrows"}},{"kind":"Field","name":{"kind":"Name","value":"assists"}},{"kind":"Field","name":{"kind":"Name","value":"offensiveRebounds"}},{"kind":"Field","name":{"kind":"Name","value":"defensiveRebounds"}},{"kind":"Field","name":{"kind":"Name","value":"steals"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"turnovers"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"playerStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fieldGoalsMade"}},{"kind":"Field","name":{"kind":"Name","value":"threePointersMade"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrows"}},{"kind":"Field","name":{"kind":"Name","value":"assists"}},{"kind":"Field","name":{"kind":"Name","value":"offensiveRebounds"}},{"kind":"Field","name":{"kind":"Name","value":"defensiveRebounds"}},{"kind":"Field","name":{"kind":"Name","value":"steals"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"turnovers"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]}}]}}]} as unknown as DocumentNode<GetGamesWithBoxScoresQuery, GetGamesWithBoxScoresQueryVariables>;
export const GetStatlineAveragesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStatlineAverages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamStatlineInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStatlineAverages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"gamesPlayed"}},{"kind":"Field","name":{"kind":"Name","value":"averages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pointsPerGame"}},{"kind":"Field","name":{"kind":"Name","value":"fieldGoalPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"threePointPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrowPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"assists"}},{"kind":"Field","name":{"kind":"Name","value":"offensiveRebound"}},{"kind":"Field","name":{"kind":"Name","value":"defensiveRebound"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"steals"}},{"kind":"Field","name":{"kind":"Name","value":"turnovers"}}]}}]}}]}}]} as unknown as DocumentNode<GetStatlineAveragesQuery, GetStatlineAveragesQueryVariables>;
export const GetStatsPerGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStatsPerGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StatsPerGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStatsPerGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameTitle"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"assists"}},{"kind":"Field","name":{"kind":"Name","value":"rebounds"}},{"kind":"Field","name":{"kind":"Name","value":"steals"}}]}}]}}]} as unknown as DocumentNode<GetStatsPerGameQuery, GetStatsPerGameQueryVariables>;
export const GetTeamStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeamStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamStatlineInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTeamStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalGames"}},{"kind":"Field","name":{"kind":"Name","value":"totalFieldGoalsMade"}},{"kind":"Field","name":{"kind":"Name","value":"totalFieldGoalsMissed"}},{"kind":"Field","name":{"kind":"Name","value":"totalThreePointersMade"}},{"kind":"Field","name":{"kind":"Name","value":"totalThreePointersMissed"}},{"kind":"Field","name":{"kind":"Name","value":"totalFreeThrows"}},{"kind":"Field","name":{"kind":"Name","value":"totalFreeThrowsMissed"}},{"kind":"Field","name":{"kind":"Name","value":"totalAssists"}},{"kind":"Field","name":{"kind":"Name","value":"totalRebounds"}},{"kind":"Field","name":{"kind":"Name","value":"totalSteals"}},{"kind":"Field","name":{"kind":"Name","value":"totalBlocks"}},{"kind":"Field","name":{"kind":"Name","value":"totalTurnovers"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"totalOpponentPoints"}},{"kind":"Field","name":{"kind":"Name","value":"averages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pointsPerGame"}},{"kind":"Field","name":{"kind":"Name","value":"fieldGoalPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"threePointPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrowPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"assists"}},{"kind":"Field","name":{"kind":"Name","value":"rebounds"}},{"kind":"Field","name":{"kind":"Name","value":"steals"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"turnovers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"advanced"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"offensiveRating"}},{"kind":"Field","name":{"kind":"Name","value":"trueShootingPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"assistToTurnoverRatio"}},{"kind":"Field","name":{"kind":"Name","value":"netRating"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveFieldGoalPercentage"}}]}}]}}]}}]} as unknown as DocumentNode<GetTeamStatsQuery, GetTeamStatsQueryVariables>;
export const GetWeeklyTeamAveragesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWeeklyTeamAverages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamStatlineInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWeeklyTeamAverages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekStart"}},{"kind":"Field","name":{"kind":"Name","value":"gamesPlayed"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"fieldGoalsMade"}},{"kind":"Field","name":{"kind":"Name","value":"fieldGoalsMissed"}},{"kind":"Field","name":{"kind":"Name","value":"threePointersMade"}},{"kind":"Field","name":{"kind":"Name","value":"threePointersMissed"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrows"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrowsMissed"}},{"kind":"Field","name":{"kind":"Name","value":"assists"}},{"kind":"Field","name":{"kind":"Name","value":"rebounds"}},{"kind":"Field","name":{"kind":"Name","value":"steals"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"turnovers"}},{"kind":"Field","name":{"kind":"Name","value":"averages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pointsPerGame"}},{"kind":"Field","name":{"kind":"Name","value":"assistsPerGame"}},{"kind":"Field","name":{"kind":"Name","value":"reboundsPerGame"}},{"kind":"Field","name":{"kind":"Name","value":"blocksPerGame"}},{"kind":"Field","name":{"kind":"Name","value":"stealsPerGame"}},{"kind":"Field","name":{"kind":"Name","value":"turnoversPerGame"}}]}}]}}]}}]} as unknown as DocumentNode<GetWeeklyTeamAveragesQuery, GetWeeklyTeamAveragesQueryVariables>;
export const SubmitStatlinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitStatlines"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmitStatlinesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitStatlines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"opponentStatline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fieldGoalsMade"}},{"kind":"Field","name":{"kind":"Name","value":"threePointersMade"}},{"kind":"Field","name":{"kind":"Name","value":"freeThrowsMade"}}]}}]}}]}}]} as unknown as DocumentNode<SubmitStatlinesMutation, SubmitStatlinesMutationVariables>;
export const DeleteMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteMemberMutation, DeleteMemberMutationVariables>;
export const GetMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MembersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attendances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"dominantHand"}},{"kind":"Field","name":{"kind":"Name","value":"hasOnBoarded"}}]}}]}}]}}]} as unknown as DocumentNode<GetMembersQuery, GetMembersQueryVariables>;
export const GetTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"shortId"}},{"kind":"Field","name":{"kind":"Name","value":"routeKey"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"dominantHand"}},{"kind":"Field","name":{"kind":"Name","value":"hasOnBoarded"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetTeamQuery, GetTeamQueryVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetMemberProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"getUserProfile"},"name":{"kind":"Name","value":"getMemberProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"dominantHand"}},{"kind":"Field","name":{"kind":"Name","value":"hasOnBoarded"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetPendingMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPendingMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MembersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPendingMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetPendingMembersQuery, GetPendingMembersQueryVariables>;