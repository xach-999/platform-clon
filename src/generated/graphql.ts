/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AddClassroomInput = {
  name: Scalars['String'];
  schoolId: Scalars['ID'];
};

export type AddDistrictInput = {
  country: Scalars['String'];
  name: Scalars['String'];
  state: Scalars['String'];
};

export type Classroom = {
  __typename?: 'Classroom';
  _id?: Maybe<Scalars['ID']>;
  assignedTeachers?: Maybe<Array<Maybe<Scalars['ID']>>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<Scalars['String']>;
  /** Get pending invitations to this classroom */
  invitations?: Maybe<Array<Maybe<Invitation>>>;
  isArchived?: Maybe<Scalars['Boolean']>;
  joinCode?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  school?: Maybe<School>;
  schoolId?: Maybe<Scalars['ID']>;
  /** Is joining to classroom allowed or not */
  status?: Maybe<ClassroomStatus>;
  students?: Maybe<UsersResponse>;
  teachers?: Maybe<Array<Maybe<User>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  waitingList?: Maybe<Array<Maybe<WaitingList>>>;
};


export type ClassroomStudentsArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};

export enum ClassroomStatus {
  Closed = 'closed',
  Opened = 'opened'
}

export type ClassroomsResponse = {
  __typename?: 'ClassroomsResponse';
  hasMore?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<Maybe<Classroom>>>;
  total?: Maybe<Scalars['Int']>;
};

export type CodeSnippetDetails = {
  __typename?: 'CodeSnippetDetails';
  code?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
};

export type CreateInvitationInput = {
  classroomId: Scalars['ID'];
  comment?: InputMaybe<Scalars['String']>;
  userId: Scalars['ID'];
};

export type CreateUserPayload = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  schoolId: Scalars['ID'];
};

export type District = {
  __typename?: 'District';
  _id?: Maybe<Scalars['ID']>;
  country: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  schools?: Maybe<SchoolsResponse>;
  state: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type DistrictSchoolsArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type DistrictsResponse = {
  __typename?: 'DistrictsResponse';
  hasMore?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<Maybe<District>>>;
  total?: Maybe<Scalars['Int']>;
};

export type Exam = {
  __typename?: 'Exam';
  _id?: Maybe<Scalars['ID']>;
  accredibleGroupName?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  displayCode?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  enable?: Maybe<Scalars['Boolean']>;
  examVersions?: Maybe<Array<Maybe<ExamVersion>>>;
  language?: Maybe<Scalars['String']>;
  passingScoreRate?: Maybe<Scalars['Float']>;
  practicalTaskAmount?: Maybe<Scalars['Float']>;
  productIdsForVoucher?: Maybe<Array<Maybe<Scalars['Float']>>>;
  productIdsForVoucherTesting?: Maybe<Array<Maybe<Scalars['Float']>>>;
  sessionTimeoutSeconds?: Maybe<Scalars['Float']>;
  tasksAmount?: Maybe<Scalars['Float']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ExamVersion = {
  __typename?: 'ExamVersion';
  _id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  examCode: Scalars['String'];
  questionCodes: Array<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  version: Scalars['String'];
};

export type ExamsResponse = {
  __typename?: 'ExamsResponse';
  hasMore?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<Maybe<Exam>>>;
  total?: Maybe<Scalars['Int']>;
};

export type Invitation = {
  __typename?: 'Invitation';
  _id?: Maybe<Scalars['ID']>;
  classroom?: Maybe<Classroom>;
  classroomId?: Maybe<Scalars['ID']>;
  comment?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  decidedAt?: Maybe<Scalars['DateTime']>;
  failedReason?: Maybe<Scalars['String']>;
  /** `ID` of user that created invite */
  invitationSourceId?: Maybe<Scalars['ID']>;
  status?: Maybe<InvitationStatus>;
  /** @deprecated Always `classroom` */
  targetEntity?: Maybe<InvitationTarget>;
  /** @deprecated Use `classroomId` instead */
  targetId?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  userId?: Maybe<Scalars['ID']>;
};

export enum InvitationStatus {
  Accepted = 'accepted',
  Failed = 'failed',
  Pending = 'pending',
  Rejected = 'rejected'
}

export enum InvitationTarget {
  Classroom = 'classroom'
}

export type MultipleDetailsOptions = {
  __typename?: 'MultipleDetailsOptions';
  isValid?: Maybe<Scalars['Boolean']>;
  text?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addClassroom?: Maybe<Classroom>;
  addDistrict?: Maybe<District>;
  archiveClassroom?: Maybe<Classroom>;
  createInvitation?: Maybe<Invitation>;
  createStudent?: Maybe<User>;
  createTeacher?: Maybe<User>;
  deleteClassroom?: Maybe<Classroom>;
  deleteInvitation?: Maybe<Invitation>;
  deleteJoinRequest?: Maybe<WaitingList>;
  joinClassroomByCode?: Maybe<WaitingList>;
  /** Students can leave classrooms with this mutation */
  leaveClassroom?: Maybe<User>;
  moveUserToAnotherClassroom?: Maybe<User>;
  respondClassroomJoinRequest?: Maybe<WaitingList>;
  respondInvitation?: Maybe<Invitation>;
  setClassroomStatus?: Maybe<Classroom>;
  updateMyPassword?: Maybe<User>;
  updateUserById?: Maybe<User>;
};


export type MutationAddClassroomArgs = {
  newClassroomData?: InputMaybe<AddClassroomInput>;
};


export type MutationAddDistrictArgs = {
  newDistrictData?: InputMaybe<AddDistrictInput>;
};


export type MutationArchiveClassroomArgs = {
  archived?: InputMaybe<Scalars['Boolean']>;
  classroomId: Scalars['ID'];
};


export type MutationCreateInvitationArgs = {
  createInvitationInput?: InputMaybe<CreateInvitationInput>;
};


export type MutationCreateStudentArgs = {
  userPayload: CreateUserPayload;
};


export type MutationCreateTeacherArgs = {
  userPayload: CreateUserPayload;
};


export type MutationDeleteClassroomArgs = {
  classroomId: Scalars['ID'];
};


export type MutationDeleteInvitationArgs = {
  invitationId?: InputMaybe<Scalars['ID']>;
};


export type MutationDeleteJoinRequestArgs = {
  joinRequestId: Scalars['ID'];
};


export type MutationJoinClassroomByCodeArgs = {
  joinCode: Scalars['String'];
};


export type MutationLeaveClassroomArgs = {
  classroomId: Scalars['ID'];
};


export type MutationMoveUserToAnotherClassroomArgs = {
  fromClassroom: Scalars['ID'];
  toClassroom: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationRespondClassroomJoinRequestArgs = {
  decision: WaitingListStatus;
  waitingListId: Scalars['ID'];
};


export type MutationRespondInvitationArgs = {
  decision: InvitationStatus;
  invitationId: Scalars['ID'];
};


export type MutationSetClassroomStatusArgs = {
  classroomId: Scalars['ID'];
  classroomStatus: ClassroomStatus;
};


export type MutationUpdateMyPasswordArgs = {
  newPassword: Scalars['String'];
};


export type MutationUpdateUserByIdArgs = {
  userId: Scalars['ID'];
  userPayload: UpdateUserPayload;
};

export enum Proctoring {
  Classroom = 'Classroom',
  NotApplicable = 'NotApplicable',
  OnlineProctoring = 'OnlineProctoring'
}

export enum ProductType {
  Exam = 'Exam',
  PracticeTest = 'PracticeTest'
}

export type Query = {
  __typename?: 'Query';
  classrooms?: Maybe<ClassroomsResponse>;
  createCompilerSubmissionForTask?: Maybe<SphereEngineSubmissionIdResponse>;
  createProblemSubmissionForTask?: Maybe<SphereEngineSubmissionIdResponse>;
  districts?: Maybe<DistrictsResponse>;
  exams?: Maybe<ExamsResponse>;
  getClassroom?: Maybe<Classroom>;
  getDistrict?: Maybe<District>;
  getExam?: Maybe<Exam>;
  getPendingInvitations?: Maybe<Array<Maybe<Invitation>>>;
  getSchool?: Maybe<School>;
  getTask?: Maybe<Task>;
  getUser?: Maybe<User>;
  /**
   * Get current user. Authorization token should be provided in `idtoken` header.
   *     If no token is provided, the user will be null.
   */
  me?: Maybe<User>;
  retrieveCompilerSubmission?: Maybe<SphereEngineSubmissionResultResponse>;
  retrieveProblem?: Maybe<SphereEngineProblemDetails>;
  retrieveProblemSubmission?: Maybe<SphereEngineSubmissionResultResponse>;
  schools?: Maybe<SchoolsResponse>;
  tasks?: Maybe<TasksResponse>;
  users?: Maybe<UsersResponse>;
};


export type QueryClassroomsArgs = {
  includeArchived?: InputMaybe<Scalars['Boolean']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  schoolId?: InputMaybe<Scalars['ID']>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryCreateCompilerSubmissionForTaskArgs = {
  compilerId?: InputMaybe<Scalars['Float']>;
  compilerVersionId?: InputMaybe<Scalars['Float']>;
  input?: InputMaybe<Scalars['String']>;
  source?: InputMaybe<Scalars['String']>;
  taskId?: InputMaybe<Scalars['String']>;
};


export type QueryCreateProblemSubmissionForTaskArgs = {
  compilerId?: InputMaybe<Scalars['Float']>;
  compilerVersionId?: InputMaybe<Scalars['Float']>;
  source?: InputMaybe<Scalars['String']>;
  taskId?: InputMaybe<Scalars['String']>;
};


export type QueryDistrictsArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryExamsArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryGetClassroomArgs = {
  classroomId: Scalars['ID'];
};


export type QueryGetDistrictArgs = {
  districtId: Scalars['ID'];
};


export type QueryGetExamArgs = {
  examId: Scalars['ID'];
};


export type QueryGetPendingInvitationsArgs = {
  classroomId: Scalars['ID'];
};


export type QueryGetSchoolArgs = {
  schoolId: Scalars['ID'];
};


export type QueryGetTaskArgs = {
  taskId: Scalars['ID'];
};


export type QueryGetUserArgs = {
  userId: Scalars['ID'];
};


export type QueryRetrieveCompilerSubmissionArgs = {
  submissionId?: InputMaybe<Scalars['Float']>;
};


export type QueryRetrieveProblemArgs = {
  problemId?: InputMaybe<Scalars['Float']>;
};


export type QueryRetrieveProblemSubmissionArgs = {
  submissionId?: InputMaybe<Scalars['Float']>;
};


export type QuerySchoolsArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryTasksArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryUsersArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type ResultObjective = {
  __typename?: 'ResultObjective';
  objectiveId?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
  title?: Maybe<Scalars['String']>;
};

export type School = {
  __typename?: 'School';
  _id?: Maybe<Scalars['ID']>;
  city?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  logo?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  students?: Maybe<UsersResponse>;
  teachers?: Maybe<UsersResponse>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type SchoolStudentsArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type SchoolTeachersArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type SchoolsResponse = {
  __typename?: 'SchoolsResponse';
  hasMore?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<Maybe<School>>>;
  total?: Maybe<Scalars['Int']>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type SphereEngineProblem = {
  __typename?: 'SphereEngineProblem';
  code?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
};

export type SphereEngineProblemDetails = {
  __typename?: 'SphereEngineProblemDetails';
  body?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
};

export type SphereEngineStatus = {
  __typename?: 'SphereEngineStatus';
  /** Normalized status for frontend */
  _statusText?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type SphereEngineStreamsData = {
  __typename?: 'SphereEngineStreamsData';
  cmpinfo?: Maybe<UriPath>;
  error?: Maybe<UriPath>;
  output?: Maybe<UriPath>;
  source?: Maybe<UriPath>;
};

export type SphereEngineSubmissionIdResponse = {
  __typename?: 'SphereEngineSubmissionIdResponse';
  id?: Maybe<Scalars['Float']>;
};

export type SphereEngineSubmissionResult = {
  __typename?: 'SphereEngineSubmissionResult';
  score?: Maybe<Scalars['Float']>;
  status?: Maybe<SphereEngineStatus>;
  streams?: Maybe<SphereEngineStreamsData>;
};

export type SphereEngineSubmissionResultResponse = {
  __typename?: 'SphereEngineSubmissionResultResponse';
  date?: Maybe<Scalars['String']>;
  executing?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['Float']>;
  problem?: Maybe<SphereEngineProblem>;
  result?: Maybe<SphereEngineSubmissionResult>;
};

export type Task = {
  __typename?: 'Task';
  _id?: Maybe<Scalars['ID']>;
  answers?: Maybe<Array<Maybe<TaskPositionedContent>>>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  examCode?: Maybe<Scalars['String']>;
  multipleDetails?: Maybe<TaskMultipleQuestionDetails>;
  practicalDetails?: Maybe<TaskPracticalDetails>;
  problem?: Maybe<SphereEngineProblemDetails>;
  questions?: Maybe<Array<Maybe<TaskPositionedContent>>>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  validatorName?: Maybe<Scalars['String']>;
};

export type TaskMultipleQuestionDetails = {
  __typename?: 'TaskMultipleQuestionDetails';
  codeSnippet?: Maybe<CodeSnippetDetails>;
  options?: Maybe<Array<Maybe<MultipleDetailsOptions>>>;
};

export type TaskPositionedContent = {
  __typename?: 'TaskPositionedContent';
  content?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Float']>;
};

export type TaskPracticalDetails = {
  __typename?: 'TaskPracticalDetails';
  appendCode?: Maybe<Scalars['String']>;
  compilerId?: Maybe<Scalars['Float']>;
  compilerVersionId?: Maybe<Scalars['Float']>;
  input?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  prependCode?: Maybe<Scalars['String']>;
  problemId?: Maybe<Scalars['Float']>;
  template?: Maybe<Scalars['String']>;
};

export type TasksResponse = {
  __typename?: 'TasksResponse';
  hasMore?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<Maybe<Task>>>;
  total?: Maybe<Scalars['Int']>;
};

export type TestingSession = {
  __typename?: 'TestingSession';
  _id?: Maybe<Scalars['ID']>;
  createDate?: Maybe<Scalars['DateTime']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  examCode?: Maybe<Scalars['String']>;
  expirationDate?: Maybe<Scalars['DateTime']>;
  finishDate?: Maybe<Scalars['DateTime']>;
  flags?: Maybe<Array<Maybe<Scalars['String']>>>;
  instanceId?: Maybe<Scalars['String']>;
  result?: Maybe<TestingSessionResult>;
  startDate?: Maybe<Scalars['DateTime']>;
  status?: Maybe<Scalars['String']>;
  tasks?: Maybe<Array<Maybe<Scalars['String']>>>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  userId?: Maybe<Scalars['String']>;
  voucherId?: Maybe<Scalars['String']>;
};

export type TestingSessionResult = {
  __typename?: 'TestingSessionResult';
  isPassed?: Maybe<Scalars['Boolean']>;
  objectives?: Maybe<Array<Maybe<ResultObjective>>>;
  score?: Maybe<Scalars['Float']>;
};

export type TestingSesssionsResponse = {
  __typename?: 'TestingSesssionsResponse';
  hasMore?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<Maybe<TestingSession>>>;
  total?: Maybe<Scalars['Int']>;
};

export type TestingVoucher = {
  __typename?: 'TestingVoucher';
  _id?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createDate?: Maybe<Scalars['DateTime']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  duration?: Maybe<Scalars['Float']>;
  exam?: Maybe<Exam>;
  examCode?: Maybe<Scalars['String']>;
  expirationDate?: Maybe<Scalars['DateTime']>;
  expired?: Maybe<Scalars['Boolean']>;
  forTesting?: Maybe<Scalars['Boolean']>;
  licenseId?: Maybe<Scalars['String']>;
  proctoring?: Maybe<Proctoring>;
  productType?: Maybe<ProductType>;
  schoolId?: Maybe<Scalars['String']>;
  status?: Maybe<VoucherStatus>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type UpdateUserPayload = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type UriPath = {
  __typename?: 'UriPath';
  content?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ID']>;
  address?: Maybe<Scalars['String']>;
  birthdate?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  classroomIds?: Maybe<Array<Maybe<Scalars['ID']>>>;
  classrooms?: Maybe<Array<Maybe<Classroom>>>;
  cognitoUserId?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  /** Get invitations to classrooms */
  invitations?: Maybe<Array<Maybe<Invitation>>>;
  isProctor?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  /** Hardcoded dummy link */
  photoUrl?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  proctorSignedAt?: Maybe<Scalars['DateTime']>;
  /** Role that stored in DB collection (we also store role at cognito, which can be ambiguous) */
  role?: Maybe<Scalars['String']>;
  schoolId?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  studentId?: Maybe<Scalars['String']>;
  /** Fetch testing sessions of user */
  testingSessions?: Maybe<TestingSesssionsResponse>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  username?: Maybe<Scalars['String']>;
  vouchers?: Maybe<Array<Maybe<TestingVoucher>>>;
  /** Get user's join requests to classrooms */
  waitingList?: Maybe<Array<Maybe<WaitingList>>>;
};


export type UserTestingSessionsArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortOrder>;
  sortBy?: InputMaybe<Scalars['String']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type UserVouchersArgs = {
  onlyValid?: InputMaybe<Scalars['Boolean']>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  hasMore?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<Maybe<User>>>;
  total?: Maybe<Scalars['Int']>;
};

export enum VoucherStatus {
  Assigned = 'Assigned',
  Available = 'Available',
  Used = 'Used'
}

export type WaitingList = {
  __typename?: 'WaitingList';
  _id?: Maybe<Scalars['ID']>;
  classroom?: Maybe<Classroom>;
  classroomId: Scalars['ID'];
  createdAt?: Maybe<Scalars['DateTime']>;
  decidedAt?: Maybe<Scalars['DateTime']>;
  failedReason?: Maybe<Scalars['String']>;
  status?: Maybe<WaitingListStatus>;
  student?: Maybe<User>;
  studentId: Scalars['ID'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export enum WaitingListStatus {
  Accepted = 'accepted',
  Deleted = 'deleted',
  Failed = 'failed',
  Pending = 'pending',
  Rejected = 'rejected'
}

export type UpdateMyPasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
}>;


export type UpdateMyPasswordMutation = { __typename?: 'Mutation', updateMyPassword?: { __typename?: 'User', _id?: string | null } | null };

export type CreateInvitationMutationVariables = Exact<{
  createInvitationInput?: InputMaybe<CreateInvitationInput>;
}>;


export type CreateInvitationMutation = { __typename?: 'Mutation', createInvitation?: { __typename?: 'Invitation', _id?: string | null, comment?: string | null, createdAt?: any | null, decidedAt?: any | null, updatedAt?: any | null, invitationSourceId?: string | null, status?: InvitationStatus | null, userId?: string | null, classroomId?: string | null, classroom?: { __typename?: 'Classroom', _id?: string | null, name?: string | null, school?: { __typename?: 'School', _id?: string | null, name?: string | null } | null } | null } | null };

export type DeleteInvitationMutationVariables = Exact<{
  invitationId?: InputMaybe<Scalars['ID']>;
}>;


export type DeleteInvitationMutation = { __typename?: 'Mutation', deleteInvitation?: { __typename?: 'Invitation', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, status?: InvitationStatus | null, decidedAt?: any | null, userId?: string | null, invitationSourceId?: string | null, comment?: string | null, classroomId?: string | null, classroom?: { __typename?: 'Classroom', _id?: string | null, name?: string | null, school?: { __typename?: 'School', _id?: string | null, name?: string | null } | null } | null } | null };

export type RespondInvitationMutationVariables = Exact<{
  decision: InvitationStatus;
  invitationId: Scalars['ID'];
}>;


export type RespondInvitationMutation = { __typename?: 'Mutation', respondInvitation?: { __typename?: 'Invitation', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, status?: InvitationStatus | null, decidedAt?: any | null, userId?: string | null, invitationSourceId?: string | null, comment?: string | null, classroomId?: string | null, classroom?: { __typename?: 'Classroom', _id?: string | null, name?: string | null, school?: { __typename?: 'School', _id?: string | null, name?: string | null } | null } | null } | null };

export type JoinClassroomByCodeMutationVariables = Exact<{
  joinCode: Scalars['String'];
}>;


export type JoinClassroomByCodeMutation = { __typename?: 'Mutation', joinClassroomByCode?: { __typename?: 'WaitingList', _id?: string | null } | null };

export type DeleteJoinRequestMutationVariables = Exact<{
  joinRequestId: Scalars['ID'];
}>;


export type DeleteJoinRequestMutation = { __typename?: 'Mutation', deleteJoinRequest?: { __typename?: 'WaitingList', _id?: string | null, status?: WaitingListStatus | null } | null };

export type RespondClassroomJoinRequestMutationVariables = Exact<{
  decision: WaitingListStatus;
  waitingListId: Scalars['ID'];
}>;


export type RespondClassroomJoinRequestMutation = { __typename?: 'Mutation', respondClassroomJoinRequest?: { __typename?: 'WaitingList', _id?: string | null } | null };

export type AddClassroomMutationVariables = Exact<{
  newClassroomData?: InputMaybe<AddClassroomInput>;
}>;


export type AddClassroomMutation = { __typename?: 'Mutation', addClassroom?: { __typename?: 'Classroom', _id?: string | null } | null };

export type LeaveClassroomMutationVariables = Exact<{
  classroomId: Scalars['ID'];
}>;


export type LeaveClassroomMutation = { __typename?: 'Mutation', leaveClassroom?: { __typename?: 'User', _id?: string | null } | null };

export type ArchiveClassroomMutationVariables = Exact<{
  classroomId: Scalars['ID'];
  archived: Scalars['Boolean'];
}>;


export type ArchiveClassroomMutation = { __typename?: 'Mutation', archiveClassroom?: { __typename?: 'Classroom', _id?: string | null } | null };

export type SetClassroomStatusMutationVariables = Exact<{
  classroomStatus: ClassroomStatus;
  classroomId: Scalars['ID'];
}>;


export type SetClassroomStatusMutation = { __typename?: 'Mutation', setClassroomStatus?: { __typename?: 'Classroom', _id?: string | null, status?: ClassroomStatus | null } | null };

export type UpdateUserByIdMutationVariables = Exact<{
  userPayload: UpdateUserPayload;
  userId: Scalars['ID'];
}>;


export type UpdateUserByIdMutation = { __typename?: 'Mutation', updateUserById?: { __typename?: 'User', _id?: string | null } | null };

export type MoveUserToAnotherClassroomMutationVariables = Exact<{
  fromClassroom: Scalars['ID'];
  toClassroom: Scalars['ID'];
  userId: Scalars['ID'];
}>;


export type MoveUserToAnotherClassroomMutation = { __typename?: 'Mutation', moveUserToAnotherClassroom?: { __typename?: 'User', _id?: string | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', _id?: string | null, username?: string | null, studentId?: string | null, schoolId?: string | null, firstName?: string | null, lastName?: string | null, photoUrl?: string | null, proctorSignedAt?: any | null, role?: string | null, email?: string | null, country?: string | null, city?: string | null, postcode?: string | null, address?: string | null, birthdate?: string | null, phone?: string | null, isProctor?: boolean | null, classroomIds?: Array<string | null> | null, id?: string | null, classrooms?: Array<{ __typename?: 'Classroom', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, name?: string | null, assignedTeachers?: Array<string | null> | null, createdBy?: string | null, school?: { __typename?: 'School', _id?: string | null, name?: string | null } | null, teachers?: Array<{ __typename?: 'User', _id?: string | null, username?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phone?: string | null } | null> | null } | null> | null, invitations?: Array<{ __typename?: 'Invitation', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, status?: InvitationStatus | null, decidedAt?: any | null, userId?: string | null, invitationSourceId?: string | null, comment?: string | null, classroomId?: string | null, classroom?: { __typename?: 'Classroom', _id?: string | null, name?: string | null, school?: { __typename?: 'School', _id?: string | null, name?: string | null } | null } | null } | null> | null, waitingList?: Array<{ __typename?: 'WaitingList', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, status?: WaitingListStatus | null, failedReason?: string | null, decidedAt?: any | null, studentId: string, classroomId: string, classroom?: { __typename?: 'Classroom', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, status?: ClassroomStatus | null, name?: string | null, schoolId?: string | null, school?: { __typename?: 'School', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, name?: string | null, logo?: string | null } | null, teachers?: Array<{ __typename?: 'User', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, username?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, fullName?: string | null } | null> | null } | null, student?: { __typename?: 'User', _id?: string | null, username?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, fullName?: string | null, photoUrl?: string | null } | null } | null> | null } | null };

export type TaskQueryVariables = Exact<{
  taskId: Scalars['ID'];
}>;


export type TaskQuery = { __typename?: 'Query', getTask?: { __typename?: 'Task', displayName?: string | null, description?: string | null, validatorName?: string | null, practicalDetails?: { __typename?: 'TaskPracticalDetails', compilerId?: number | null, language?: string | null, template?: string | null, compilerVersionId?: number | null } | null, problem?: { __typename?: 'SphereEngineProblemDetails', id?: number | null, name?: string | null, body?: string | null, code?: string | null } | null } | null };

export type ClassroomsQueryVariables = Exact<{
  schoolId?: InputMaybe<Scalars['ID']>;
  includeArchived?: InputMaybe<Scalars['Boolean']>;
}>;


export type ClassroomsQuery = { __typename?: 'Query', classrooms?: { __typename?: 'ClassroomsResponse', items?: Array<{ __typename?: 'Classroom', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, isArchived?: boolean | null, joinCode?: string | null, name?: string | null, status?: ClassroomStatus | null, assignedTeachers?: Array<string | null> | null, createdBy?: string | null, school?: { __typename?: 'School', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, code?: string | null, name?: string | null, state?: string | null, city?: string | null, logo?: string | null } | null, students?: { __typename?: 'UsersResponse', total?: number | null, hasMore?: boolean | null } | null, teachers?: Array<{ __typename?: 'User', _id?: string | null, username?: string | null, firstName?: string | null, lastName?: string | null } | null> | null, waitingList?: Array<{ __typename?: 'WaitingList', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, status?: WaitingListStatus | null, failedReason?: string | null, decidedAt?: any | null, studentId: string, classroomId: string, classroom?: { __typename?: 'Classroom', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, status?: ClassroomStatus | null, name?: string | null, schoolId?: string | null, school?: { __typename?: 'School', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, name?: string | null, logo?: string | null } | null, teachers?: Array<{ __typename?: 'User', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, username?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, fullName?: string | null } | null> | null } | null, student?: { __typename?: 'User', _id?: string | null, username?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, fullName?: string | null, photoUrl?: string | null } | null } | null> | null } | null> | null } | null };

export type GetSchoolQueryVariables = Exact<{
  schoolId: Scalars['ID'];
}>;


export type GetSchoolQuery = { __typename?: 'Query', getSchool?: { __typename?: 'School', students?: { __typename?: 'UsersResponse', total?: number | null, hasMore?: boolean | null, items?: Array<{ __typename?: 'User', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, cognitoUserId?: string | null, username?: string | null, studentId?: string | null, schoolId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, country?: string | null, city?: string | null, postcode?: string | null, state?: string | null, address?: string | null, role?: string | null, birthdate?: string | null, phone?: string | null, classroomIds?: Array<string | null> | null, fullName?: string | null, photoUrl?: string | null, vouchers?: Array<{ __typename?: 'TestingVoucher', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, code?: string | null, createDate?: any | null, expirationDate?: any | null, examCode?: string | null, forTesting?: boolean | null, expired?: boolean | null } | null> | null } | null> | null } | null } | null };

export type GetClassroomQueryVariables = Exact<{
  classroomId: Scalars['ID'];
}>;


export type GetClassroomQuery = { __typename?: 'Query', getClassroom?: { __typename?: 'Classroom', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, isArchived?: boolean | null, joinCode?: string | null, name?: string | null, status?: ClassroomStatus | null, assignedTeachers?: Array<string | null> | null, createdBy?: string | null, school?: { __typename?: 'School', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, code?: string | null, name?: string | null, state?: string | null, city?: string | null, logo?: string | null } | null, students?: { __typename?: 'UsersResponse', total?: number | null, hasMore?: boolean | null, items?: Array<{ __typename?: 'User', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, cognitoUserId?: string | null, username?: string | null, studentId?: string | null, schoolId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, country?: string | null, city?: string | null, postcode?: string | null, state?: string | null, address?: string | null, role?: string | null, birthdate?: string | null, phone?: string | null, classroomIds?: Array<string | null> | null, fullName?: string | null, photoUrl?: string | null, vouchers?: Array<{ __typename?: 'TestingVoucher', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, code?: string | null, createDate?: any | null, expirationDate?: any | null, examCode?: string | null, forTesting?: boolean | null, expired?: boolean | null } | null> | null } | null> | null } | null, teachers?: Array<{ __typename?: 'User', _id?: string | null, username?: string | null, firstName?: string | null, lastName?: string | null } | null> | null, waitingList?: Array<{ __typename?: 'WaitingList', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, status?: WaitingListStatus | null, failedReason?: string | null, decidedAt?: any | null, studentId: string, classroomId: string, classroom?: { __typename?: 'Classroom', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, status?: ClassroomStatus | null, name?: string | null, schoolId?: string | null, school?: { __typename?: 'School', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, name?: string | null, logo?: string | null } | null, teachers?: Array<{ __typename?: 'User', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, username?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, fullName?: string | null } | null> | null } | null, student?: { __typename?: 'User', _id?: string | null, username?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, fullName?: string | null, photoUrl?: string | null } | null } | null> | null } | null };

export type ExampleQueryQueryVariables = Exact<{
  classroomId: Scalars['ID'];
}>;


export type ExampleQueryQuery = { __typename?: 'Query', getPendingInvitations?: Array<{ __typename?: 'Invitation', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, status?: InvitationStatus | null, decidedAt?: any | null, userId?: string | null, invitationSourceId?: string | null, comment?: string | null, classroomId?: string | null, classroom?: { __typename?: 'Classroom', _id?: string | null, name?: string | null, school?: { __typename?: 'School', _id?: string | null, name?: string | null } | null } | null } | null> | null };
