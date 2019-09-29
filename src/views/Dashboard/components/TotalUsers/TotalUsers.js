import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  CardHeader
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { formatDistance } from 'date-fns';
import huLocale from 'date-fns/locale/hu';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  evaluationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
    borderTopColor: theme.palette.grey[200],
    paddingTop: '6px',
    marginTop: '6px',
    '&:first-child': {
      borderTop: 'none',
      paddingTop: 0,
      marginTop: 0
    }
  },
  evaluationValue: {
    width: '50px'
  },
  evaluationInfo: {
    flex: 1
  },
  differenceNegative: {
    color: theme.palette.error.dark
  },
  differencePositive: {
    color: theme.palette.success.dark
  },
  cardActionContainer: {
    display: 'flex'
  }
}));

const TotalUsers = ({ subjectAverages, evaluations }) => {
  const classes = useStyles();
  console.log(evaluations);

  return (
    <Grid container spacing={3}>
      {subjectAverages.map(subjectAverage => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={subjectAverage.SubjectId}>
          <Card className={classes.card}>
            <CardHeader
              title={subjectAverage.Subject}
              action={
                <div className={classes.cardActionContainer}>
                  <Typography variant="h5">{subjectAverage.Value}</Typography>
                  <div
                    className={clsx([
                      subjectAverage.Difference > 0
                        ? classes.differencePositive
                        : classes.differenceNegative
                    ])}>
                    {subjectAverage.Difference > 0 ? (
                      <ArrowUpwardIcon />
                    ) : (
                      <ArrowDownwardIcon />
                    )}
                    <Typography variant="caption" color="inherit">
                      {subjectAverage.Difference}
                    </Typography>
                  </div>
                </div>
              }
            />
            <Divider />
            <CardContent>
              {evaluations[subjectAverage.Subject] &&
                evaluations[subjectAverage.Subject].map(evaluation => {
                  const created = formatDistance(
                    new Date(evaluation.Date),
                    new Date(),
                    {
                      locale: huLocale
                    }
                  );
                  return (
                    <div
                      key={evaluation.EvaluationId}
                      className={classes.evaluationContainer}>
                      <Typography
                        variant="h2"
                        className={classes.evaluationValue}>
                        {evaluation.NumberValue}
                      </Typography>
                      <div className={classes.evaluationInfo}>
                        <Typography variant="h5">{evaluation.Mode}</Typography>
                        <Typography variant="h6">{evaluation.Theme}</Typography>
                      </div>
                      <div>
                        <Typography variant="caption">{created}</Typography>
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TotalUsers;
