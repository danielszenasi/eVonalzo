import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { gql } from 'apollo-boost';
import { Budget, TotalUsers } from './components';
import { useQuery } from '@apollo/react-hooks';

const GET_STUDENT = gql`
  query {
    getStudent {
      Evaluations {
        EvaluationId
        Subject
        NumberValue
        Date
        Mode
        Theme
      }
      Notes {
        NoteId
        Type
        Title
        Content
        SeenByTutelaryUTC
        Teacher
        Date
      }
      SubjectAverages {
        SubjectId
        Subject
        Value
        ClassValue
        Difference
      }
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_STUDENT);
  if (loading || !data) return <p>Loading ...</p>;
  if (error) return <p>Error</p>;

  const evaluations = data.getStudent.Evaluations.reduce(
    (group, evaluation) => {
      if (group[evaluation.Subject]) {
        return {
          ...group,
          [evaluation.Subject]: [...group[evaluation.Subject], evaluation]
        };
      }
      return {
        ...group,
        [evaluation.Subject]: [evaluation]
      };
    },
    {}
  );

  return (
    <div className={classes.root}>
      <TotalUsers
        subjectAverages={data.getStudent.SubjectAverages}
        evaluations={evaluations}
      />
      <Budget notes={data.getStudent.Notes} />
    </div>
  );
};

export default Dashboard;
