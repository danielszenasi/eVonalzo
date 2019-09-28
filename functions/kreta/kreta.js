/* eslint-disable */
const { ApolloServer, gql } = require('apollo-server-lambda');
const { GraphQLScalarType } = require('graphql');
const KretaGlobal = require('./apis/kreta-global.js');
const Kreta = require('./apis/kreta.js');
const fetch = require('node-fetch');
const queryString = require('query-string');

const typeDefs = gql`
  scalar Date
  type FeatureToggleSet {
    JustificationFeatureEnabled: Boolean
  }
  type Institute {
    InstituteId: Int
    InstituteCode: String
    Name: String
    Url: String
    City: String
    AdvertisingUrl: String
    FeatureToggleSet: FeatureToggleSet
  }
  type Jelleg {
    Id: Int
    Nev: String
    Leiras: String
  }
  type ErtekFajta {
    Id: Int
    Nev: String
    Leiras: String
  }
  type Evaluation {
    EvaluationId: Int
    Form: String
    FormName: String
    Type: String
    TypeName: String
    Subject: String
    SubjectCategory: Int
    SubjectCategoryName: String
    Theme: String
    IsAtlagbaBeleszamit: Boolean
    Mode: String
    Weight: String
    Value: String
    NumberValue: Int
    SeenByTutelaryUTC: Date
    Teacher: String
    Date: Date
    CreatingTime: Date
    Jelleg: Jelleg
    JellegNev: String
    ErtekFajta: ErtekFajta
  }
  type SubjectAverage {
    SubjectId: Int
    Subject: String
    SubjectCategory: Int
    SubjectCategoryName: String
    Value: Float
    ClassValue: Float
    Difference: Float
  }
  type Absence {
    AbsenceId: Int
  }
  type Note {
    NoteId: Int
    Type: String
    Title: String
    Content: String
    SeenByTutelaryUTC: Date
    Teacher: String
    Date: String
    CreatingTime: String
  }
  type Event {
    EventId: Int
  }
  type FormTeacher {
    TeacherId: Int
    Name: String
    Email: String
    PhoneNumber: String
  }
  type Tutelary {
    TutelaryId: Int
    Name: String
    Email: String
    PhoneNumber: String
  }
  type Student {
    TanuloAktualisOktatasNevelesiKategoriaja: String
    StudentId: Int
    SchoolYearId: Int
    Name: String
    NameOfBirth: String
    PlaceOfBirth: String
    MothersName: String
    AddressDataList: [String]
    DateOfBirthUtc: Date
    InstituteName: String
    InstituteCode: String
    Evaluations: [Evaluation]
    SubjectAverages: [SubjectAverage]
    Absences: [Absence]
    Notes: [Note]
    Lessons: [Lesson]
    Events: [Event]
    FormTeacher: FormTeacher
    Tutelaries: [Tutelary]
  }
  type Lesson {
    LessonId: Int
    CalendarOraType: String
    Count: Int
    Date: Date
    StartTime: Date
    EndTime: Date
    Subject: String
    SubjectCategory: Int
    SubjectCategoryName: String
    ClassRoom: String
    ClassGroup: String
    Teacher: String
    DeputyTeacher: String
    State: String
    StateName: String
    PresenceType: String
    PresenceTypeName: String
    TeacherHomeworkId: Int
    IsTanuloHaziFeladatEnabled: Boolean
    BejelentettSzamonkeresIdList: [Int]
    Theme: String
    Nev: String
    Homework: String
  }
  type AuthPayload {
    access_token: String
    token_type: String
    expires_in: Int
    refresh_token: String
  }
  type Query {
    getInstitutes(query: String): [Institute]
    getStudent: Student
    getLessons: [Lesson]
  }
  type Mutation {
    login(
      username: String!
      password: String!
      instituteCode: String!
    ): AuthPayload
  }
`;
const resolvers = {
  Query: {
    getInstitutes: async (_, { query }, { dataSources }) => {
      return dataSources.KretaGlobal.getInstitutes(query);
    },
    getStudent: async (_, _params, { dataSources }) => {
      return dataSources.Kreta.getStudent();
    },
    getLessons: async (_, _params, { dataSources }) => {
      return dataSources.Kreta.getLessons();
    }
  },
  Mutation: {
    login: async (_, { username, password, instituteCode }) => {
      console.log(username, password, instituteCode);

      const params = {
        institute_code: instituteCode,
        grant_type: 'password',
        client_id: process.env.KRETA_CLIENT_ID,
        userName: username,
        password: password
      };
      const urlParams = queryString.stringify(params);
      const result = await fetch(
        `https://${instituteCode}.e-kreta.hu/idp/api/v1/Token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            host: `${instituteCode}.e-kreta.hu`
          },
          body: urlParams
        }
      );
      return result.json();
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return value.getTime();
    },
    serialize(value) {
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    }
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    KretaGlobal: new KretaGlobal(),
    Kreta: new Kreta()
  }),
  context: ({ event }) => {
    const token = event.headers.authorization || '';
    const instituteCode = event.headers.institutecode || '';
    return { token, instituteCode };
  }
});

exports.handler = server.createHandler();
